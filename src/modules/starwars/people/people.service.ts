import { Injectable } from "@nestjs/common";
import { SwapiRequest } from "../common/swapi.service";
import { PeopleAllDto } from "./dto/people.all.dto";
import { PeopleManyResponse } from "@app/app/rest/api/modules/starwars/controller/client/response/people/swapi.client.many.response";
import { PeopleSingleResponse } from "@app/app/rest/api/modules/starwars/controller/client/response/people/swapi.client.single.response";
import { PeopleSingleDto } from "./dto/people.single.dto";

@Injectable()
export class PeopleService {
    constructor(
        private readonly swapiRequest: SwapiRequest
    ) {}

    // Request for view all peoples
    public async getAllPeople(): Promise<PeopleManyResponse> {
        const data = await this.swapiRequest.request<PeopleAllDto[]>('/people');

        return new PeopleManyResponse(data);
    };

    // Request only one people
    public async getPeople(peopeleId: string): Promise<PeopleSingleResponse>{
        const people = await this.swapiRequest.request<PeopleSingleDto>(`/people/${peopeleId}`)

        return new PeopleSingleResponse(people)
    }
}