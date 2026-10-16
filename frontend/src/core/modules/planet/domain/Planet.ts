import type { ResourceRefDto } from "../../common/domain/ResourceDetailPlanet";
import type { ResourceResidentDto } from "../../common/domain/ResourceDetailPlanet";

export interface Planet {
    id: string;
    name: string;
    rotationPeriod: string;
    orbitalPeriod: string;
    diameter: string;
    climate: string;
    gravity: string;
    terrain: string;
    surfaceWater: string;
    population: string;
    residents: ResourceResidentDto[];
    films: ResourceRefDto[];
    url: string;
}
