import { ResourceErrorMapper, type HttpClient } from "../../common";
import type { Planet } from "../domain/Planet";
import type { PlanetRepository } from "../domain/PlanetRepository";
import type { PlanetListResponseDTO, PlanetResponseDTO } from "./PlanetDTO";
import { PlanetMapper } from "./PlanetMapper";

interface PlanetHTTPRepositoryProps {
    httpClient: HttpClient;
}

export class PlanetHTTPRepository implements PlanetRepository {
    private readonly httpClient: HttpClient;

    constructor({ httpClient }: PlanetHTTPRepositoryProps) {
        this.httpClient = httpClient;
    }

    async getAllPlanets(): Promise<Planet[]> {
        let data: PlanetListResponseDTO;
        try {
            data = await this.httpClient.get<PlanetListResponseDTO>(
                '/starwars/planets'
            );
        } catch (error) {
            throw ResourceErrorMapper.toListError(error);
        }
        return data.planets.map(PlanetMapper.toPlanet);
    }

    async getPlanet(id: string): Promise<Planet> {
        let data: PlanetResponseDTO;
        try {
            data = await this.httpClient.get<PlanetResponseDTO>(
                `/starwars/planets/${id}`
            );
        } catch (error) {
            throw ResourceErrorMapper.toDetailError(error, 'El planeta no existe');
        }
        return PlanetMapper.toPlanet(data.planet);
    }
}