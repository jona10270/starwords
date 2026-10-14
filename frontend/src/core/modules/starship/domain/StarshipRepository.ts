import type { Paginated, SearchPageRequest } from "../../common";
import type { Starship } from "./Starship";

// Puerto de startship
export interface StarshipRepository {
    // Funcion para listar todas las starships
    getAllStarships(request: SearchPageRequest): Promise<Paginated<Starship>>;

    // Funcion para pedir solo un starship
    getStarship(id: string): Promise<Starship> ;
}