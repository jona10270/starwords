import { Injectable } from '@nestjs/common';
import { SwapiRequest } from '../common/swapi.service';
import { PeopleAllDto } from './dto/people.all.dto';
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
    private readonly resolveRelations: ResourceRefService,
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

    const peoples = await Promise.all(
      items.map(async (person) => ({
        ...person,
        homeworld: await this.resolveRelations.getNameRef(
          'planets',
          person.homeworld,
        ),
      })),
    );
    return new PeopleManyResponse(peoples, total, page, limit);
  }

  // Request only one people
  public async getPeople(peopleId: string): Promise<PeopleSingleResponse> {
    const people = await this.swapiRequest.request<PeopleSingleDto>(
      `/people/${peopleId}`,
    );

    const character = {
      ...people,
      id: getIdFromUrl(people.url),
      homeworld: await this.resolveRelations.getNameRef(
        'planets',
        people.homeworld,
      ),
    };

    return new PeopleSingleResponse(character);
  }
}
