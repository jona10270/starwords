import { Injectable } from "@nestjs/common";
import { SwapiRequest } from "../common/swapi.service";
import { PlanerManyResponse } from "@app/app/rest/api/modules/starwars/controller/client/response/planet/planet.client.many.response";
import { PlanetAllDto } from "./dto/planet.all.dto";
import { PlanetSingleResponse } from "@app/app/rest/api/modules/starwars/controller/client/response/planet/planet.client.single.response";
import { PlanetSingleDto } from "./dto/planet.single.dto";

@Injectable()
export class PlanetService {
    constructor(
        private readonly swapiRequest: SwapiRequest
    ) {}

    public async getPlanets(): Promise<PlanerManyResponse> {
        const data = await this.swapiRequest.request<PlanetAllDto[]>('/planets')

        return new PlanerManyResponse(data)
    }

    public async getPlanet(planetId): Promise<PlanetSingleResponse> {
        const data = await this.swapiRequest.request<PlanetSingleDto>(`/planets/${planetId}`)

        return new PlanetSingleResponse(data)
    }
}