import type { Paginated, SearchPageRequest } from "../../common";
import type { Planet } from "./Planet";

// Creo el puerto de planets
export interface PlanetRepository {
    // Funcion para pedir todos los planetas
    getAllPlanets(request: SearchPageRequest): Promise<Paginated<Planet>>;

    // Funcion para pedir solo un planeta
    getPlanet(id: string): Promise<Planet>;
}