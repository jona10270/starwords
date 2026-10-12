import type { Planet } from "../domain/Planet";
import type { PlanetDTO } from "./PlanetDTO";

export const PlanetMapper = {
    toPlanet: (dto: PlanetDTO): Planet => ({
        id: dto.id,
        name: dto.name,
        rotationPeriod: dto.rotation_period,
        orbitalPeriod: dto.orbital_period,
        diameter: dto.diameter,
        climate: dto.climate,
        gravity: dto.gravity,
        terrain: dto.terrain,
        surfaceWater: dto.surface_water,
        population: dto.population,
        residents: dto.residents,
        films: dto.films,
        url: dto.url,
    })
}