import { Injectable } from "@nestjs/common";
import { SwapiRequest } from "../common/swapi.service";
import { PeopleAllDto } from "./dto/people.all.dto";
import { PeopleManyResponse } from "@app/app/rest/api/modules/starwars/response/swapi.client.many.response";

@Injectable()
export class PeopleService {
    constructor(
        private readonly swapiRequest: SwapiRequest
    ) {}

    // Request for view all peoples
    public async getAllPeople(): Promise<PeopleManyResponse> {
        const data = await this.swapiRequest.request<PeopleAllDto[]>('/people');

        return new PeopleManyResponse(data);
    }
}