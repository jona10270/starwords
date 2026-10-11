import { ResourceErrorMapper, type HttpClient } from "../../common";
import type { Specie } from "../domain/Specie";
import type { SpecieRepository } from "../domain/SpecieRepository";
import type { SpecieListResponseDTO, SpecieResponseDTO } from "./SpecieDTO";
import { SpecieMapper } from "./SpecieMapper";

interface SpecieHTTPRepositoryProps {
    httpClient: HttpClient;
}

export class SpecieHTTPRepository implements SpecieRepository {
    private readonly httpClient: HttpClient;

    constructor({ httpClient }: SpecieHTTPRepositoryProps) {
        this.httpClient = httpClient;
    }

    async getAllSpecies(): Promise<Specie[]> {
        let data: SpecieListResponseDTO
        try {
            data = await this.httpClient.get<SpecieListResponseDTO>(
                '/starwars/species'
            );
        } catch (error) {
            throw ResourceErrorMapper.toListError(error);
        }
        return data.species.map(SpecieMapper.toSpecie)
    }

    async getSpecie(id: string): Promise<Specie> {
        let data: SpecieResponseDTO;
        try {
            data = await this.httpClient.get<SpecieResponseDTO>(
                `/starwars/species/${id}`
            );
        } catch (error) {
            throw ResourceErrorMapper.toDetailError(error, 'La especie no existe');
        }
        return SpecieMapper.toSpecie(data.specie)
    }
}