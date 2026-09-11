import { Injectable } from "@nestjs/common";
import { SwapiRequest } from "../common/swapi.service";
import { StarshipManyResponse } from "@app/app/rest/api/modules/starwars/controller/client/response/starship/starship.client.many.response";
import { StarshipAllDto } from "./dto/starship.all.dto";
import { StarshipSingleResponse } from "@app/app/rest/api/modules/starwars/controller/client/response/starship/starship.client.single.response";

@Injectable()
export class StarshipService {
    constructor(
        private readonly swapiRequest: SwapiRequest
    ) {}

    public async getAllStarships(): Promise<StarshipManyResponse> {
        const data = await this.swapiRequest.request<StarshipAllDto[]>('/starships')

        return new StarshipManyResponse(data)
    }

    public async getSingleStarship(starShipId: string): Promise<StarshipSingleResponse> {
        const data = await this.swapiRequest.request<StarshipAllDto>(`/starships/${starShipId}`)

        return new StarshipSingleResponse(data)
    }
}