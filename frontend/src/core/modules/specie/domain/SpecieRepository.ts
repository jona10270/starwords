import type { PageRequest, Paginated } from "../../common";
import type { Specie } from "./Specie";

// Puerto de objeto specie
export interface SpecieRepository {
    // Funcion para ver todo las species
    getAllSpecies(request: PageRequest): Promise<Paginated<Specie>>;

    // Funcion para ver un solo specie
    getSpecie(id: string): Promise<Specie>;
}