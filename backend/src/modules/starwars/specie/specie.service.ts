import { Injectable } from "@nestjs/common";
import { SwapiRequest } from "../common/swapi.service";
import { SpecieManyResponse } from "@app/app/rest/api/modules/starwars/controller/client/response/specie/specie.client.many.response";
import { SpeciesAllDto } from "./dto/specie.all.dto";
import { SpecieSingleResponse } from "@app/app/rest/api/modules/starwars/controller/client/response/specie/specie.client.single.response";
import { SpeciesSingleDto } from "./dto/specie.single.dto";

@Injectable()
export class SpecieService {
    constructor(
        private readonly swapiRequest: SwapiRequest,
    ) {}

    public async getSpecies(): Promise<SpecieManyResponse> {
        const data = await this.swapiRequest.request<SpeciesAllDto[]>('/species')

        return new SpecieManyResponse(data)
    }

    public async getSpecie(specieId): Promise<SpecieSingleResponse> {
        const data = await this.swapiRequest.request<SpeciesSingleDto>(`/species/${specieId}`)

        return new SpecieSingleResponse(data)
    }
}