import type { Starship } from "../domain/Starship";
import type { StarshipDTO } from "./StarshipDTO";

// Mapeo los datos del backend
export const StarshipMapper = {
    toStarship: (dto: StarshipDTO): Starship => ({
        id: dto.id,
        name: dto.name,
        model: dto.model,
        manufacturer: dto.manufacturer,
        costInCredits: dto.cost_in_credits,
        length: dto.length,
        maxAtmospheringSpeed: dto.max_atmosphering_speed,
        crew: dto.crew,
        passengers: dto.passengers,
        cargoCapacity: dto.cargo_capacity,
        consumables: dto.consumables,
        hyperdriveRating: dto.hyperdrive_rating,
        mglt: dto.MGLT,
        starshipClass: dto.starship_class,
        pilots: dto.pilots,
        films: dto.films,
        url: dto.url,
    })
}