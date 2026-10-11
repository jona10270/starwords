import type { Specie } from "./Specie";

// Puerto de objeto specie
export interface SpecieRepository {
    // Funcion para ver todo las species
    getAllSpecies(): Promise<Specie[]>;

    // Funcion para ver un solo specie
    getSpecie(id: string): Promise<Specie>;
}