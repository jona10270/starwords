import type { PaginationMetaDTO } from "../../common";
import type { ResourceRefDto } from "../../common/domain/ResourceDetailPlanet";
import type { ResourceResidentDto } from "../../common/domain/ResourceDetailPlanet";

// Como recibo los datos del backend
export interface PlanetDTO {
    id: string;
    name: string;
    rotation_period: string;
    orbital_period: string;
    diameter: string;
    climate: string;
    gravity: string;
    terrain: string;
    surface_water: string;
    population: string;
    residents: ResourceResidentDto[];
    films: ResourceRefDto[];
    url: string;
}

export interface PlanetListResponseDTO {
    planets: PlanetDTO[];
    meta: PaginationMetaDTO;
}

export interface PlanetResponseDTO {
    planet: PlanetDTO;
}

