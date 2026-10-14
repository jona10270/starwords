import { PaginationMapper, ResourceErrorMapper, type HttpClient, type Paginated, type SearchPageRequest } from "../../common";
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

    async getAllSpecies({ page, limit, search }: SearchPageRequest): Promise<Paginated<Specie>> {
        let data: SpecieListResponseDTO
        try {
            data = await this.httpClient.get<SpecieListResponseDTO>(
                '/starwars/species', { page, limit, search }
            );
        } catch (error) {
            throw ResourceErrorMapper.toListError(error);
        }
        const species = data.species.map(SpecieMapper.toSpecie);
        return PaginationMapper.toPaginated(species, data.meta);
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