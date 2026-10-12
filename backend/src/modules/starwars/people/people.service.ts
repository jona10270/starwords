import { Injectable } from '@nestjs/common';
import { SwapiRequest } from '../common/swapi.service';
import { PeopleAllDto } from './dto/people.all.dto';
import { PeopleManyResponse } from '@app/app/rest/api/modules/starwars/controller/client/response/people/swapi.client.many.response';
import { PeopleSingleResponse } from '@app/app/rest/api/modules/starwars/controller/client/response/people/swapi.client.single.response';
import { PeopleSingleDto } from './dto/people.single.dto';
import { getIdFromUrl } from '../common/get-id-from-url';
import { paginate } from '../common/paginate';

@Injectable()
export class PeopleService {
  constructor(private readonly swapiRequest: SwapiRequest) {}

  // Request for view all peoples
  public async getAllPeople(
    page: number,
    limit: number,
  ): Promise<PeopleManyResponse> {
    const data = await this.swapiRequest.request<PeopleAllDto[]>('/people');
    const characters = data.map((person) => ({
      ...person,
      id: getIdFromUrl(person.url),
    }));

    const { items, total } = paginate(characters, page, limit);
    return new PeopleManyResponse(items, total, page, limit);
  }

  // Request only one people
  public async getPeople(peopleId: string): Promise<PeopleSingleResponse> {
    const people = await this.swapiRequest.request<PeopleSingleDto>(
      `/people/${peopleId}`,
    );

    const character = {
      ...people,
      id: getIdFromUrl(people.url),
    };

    return new PeopleSingleResponse(character);
  }
}
