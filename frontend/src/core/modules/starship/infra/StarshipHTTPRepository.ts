import { HttpClient, ResourceErrorMapper } from "../../common";
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

    async getAllStarships(): Promise<Starship[]> {
        let data: StarshipListResponseDTO;
        try {
            data = await this.httpClient.get<StarshipListResponseDTO>(
                '/starwars/starships'
            );
        } catch (error) {
            throw ResourceErrorMapper.toListError(error);
        }

        return data.starship.map(StarshipMapper.toStarship);
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