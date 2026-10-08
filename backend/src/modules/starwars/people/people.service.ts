import { Injectable } from '@nestjs/common';
import { SwapiRequest } from '../common/swapi.service';
import { PeopleAllDto } from './dto/people.all.dto';
import { PeopleManyResponse } from '@app/app/rest/api/modules/starwars/controller/client/response/people/swapi.client.many.response';
import { PeopleSingleResponse } from '@app/app/rest/api/modules/starwars/controller/client/response/people/swapi.client.single.response';
import { PeopleSingleDto } from './dto/people.single.dto';

@Injectable()
export class PeopleService {
  constructor(private readonly swapiRequest: SwapiRequest) {}

  // Request for view all peoples
  public async getAllPeople(): Promise<PeopleManyResponse> {
    const data = await this.swapiRequest.request<PeopleAllDto[]>('/people');
    const characters = data.map((person) => ({
      ...person,
      id: new URL(person.url).pathname.split("/").filter(Boolean).pop()!,
    }))
    return new PeopleManyResponse(characters);
  }

  // Request only one people
  public async getPeople(peopeleId: string): Promise<PeopleSingleResponse> {
    const people = await this.swapiRequest.request<PeopleSingleDto>(
      `/people/${peopeleId}`,
    );

    const character = {
      ...people,
      id: new URL(people.url).pathname.split("/").filter(Boolean).pop()!,
    };

    return new PeopleSingleResponse(character);
  }
}
