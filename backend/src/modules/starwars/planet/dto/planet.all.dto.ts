import type { ResourceRefDto } from "../../common/resource-ref.dto";

export interface PlanetAllDto {
  name: string;
  rotation_period: string;
  orbital_period: string;
  diameter: string;
  climate: string;
  gravity: string;
  terrain: string;
  surface_water: string;
  population: string;
  residents: string[];
  films: string[];
  url: string;
}

export type PlanetWithIdDto = PlanetAllDto & { id: string };

// El planeta del detalle con las peliculas ya resueltas
export type PlanetDetailDto = Omit<PlanetWithIdDto, 'films'> & { films: ResourceRefDto[] };