import { Injectable } from '@nestjs/common';
import { SwapiRequest } from '../common/swapi.service';
import {
  PeopleAllDto,
  PeopleDetailDto,
  PeopleWithIdDto,
} from './dto/people.all.dto';
import { PeopleManyResponse } from '@app/app/rest/api/modules/starwars/controller/client/response/people/swapi.client.many.response';
import { PeopleSingleResponse } from '@app/app/rest/api/modules/starwars/controller/client/response/people/swapi.client.single.response';
import { PeopleSingleDto } from './dto/people.single.dto';
import { getIdFromUrl } from '../common/get-id-from-url';
import { paginate } from '../common/paginate';
import { filterByText } from '../common/filter-by-text';
import { ResourceRefService } from '../common/resource-ref.service';

@Injectable()
export class PeopleService {
  constructor(
    private readonly swapiRequest: SwapiRequest,
    private readonly resourceRefService: ResourceRefService,
  ) {}

  // Request for view all peoples
  public async getAllPeople(
    page: number,
    limit: number,
    search?: string,
  ): Promise<PeopleManyResponse> {
    const data = await this.swapiRequest.request<PeopleAllDto[]>('/people');

    const characters = data.map((person) => ({
      ...person,
      id: getIdFromUrl(person.url),
    }));

    // Filtro antes de paginar para que el total cuente solo lo encontrado
    const found = filterByText(characters, search, (person) => person.name);

    const { items, total } = paginate(found, page, limit);

    const resolvedPeople = await Promise.all(
      items.map((person) => this.resolveRelations(person)),
    );

    return new PeopleManyResponse(resolvedPeople, total, page, limit);
  }

  // Request only one people
  public async getPeople(peopleId: string): Promise<PeopleSingleResponse> {
    const people = await this.swapiRequest.request<PeopleSingleDto>(
      `/people/${peopleId}`,
    );

    const character = await this.resolveRelations({
      ...people,
      id: getIdFromUrl(people.url),
    });

    return new PeopleSingleResponse(character);
  }


  // Cambio las urls del planeta natal y de las películas por su id y nombre
  private async resolveRelations(
    person: PeopleWithIdDto,
  ): Promise<PeopleDetailDto> {
    return {
      ...person,
      homeworld: await this.resourceRefService.getNameRef(
        'planets',
        person.homeworld,
      ),
      films: await Promise.all(
        person.films.map((url) => this.resourceRefService.getTitleRef(url)),
      ),
    };
  }
}
