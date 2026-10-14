import { HttpClient, PaginationMapper, ResourceErrorMapper, type Paginated, type SearchPageRequest } from "../../common";
import type { Starship } from "../domain/Starship";
import type { StarshipRepository } from "../domain/StarshipRepository";
import type { StarshipListResponseDTO, StarshipResponseDTO } from "./StarshipDTO";
import { StarshipMapper } from "./StarshipMapper";

interface StarshipHTTPRepositoryProps {
    httpClient: HttpClient;
}

export class StarshipHTTPRepository implements StarshipRepository {

    private readonly httpClient: HttpClient;

    constructor({ httpClient }: StarshipHTTPRepositoryProps) {
        this.httpClient = httpClient;
    }

    async getAllStarships({ page, limit, search }: SearchPageRequest): Promise<Paginated<Starship>> {
        let data: StarshipListResponseDTO;
        try {
            data = await this.httpClient.get<StarshipListResponseDTO>(
                '/starwars/starships', { page, limit, search }
            );
        } catch (error) {
            throw ResourceErrorMapper.toListError(error);
        }
        const starships = data.starship.map(StarshipMapper.toStarship);
        return PaginationMapper.toPaginated(starships, data.meta);
    }

    async getStarship(id: string): Promise<Starship> {
        let data: StarshipResponseDTO;
        try {
            data = await this.httpClient.get<StarshipResponseDTO>(
                `/starwars/starships/${id}`
            );
        } catch (error) {
            throw ResourceErrorMapper.toDetailError(error, 'La nave espacial no existe');
        }
        return StarshipMapper.toStarship(data.starship)
    }
}