import type { Vehicle } from "../domain/Vehicle";
import type { VehicleDTO } from "./VehicleDTO";

export const VehicleMapper = {
    toVehicle: (dto: VehicleDTO): Vehicle => ({
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
        pilots: dto.pilots,
        films: dto.films,
        url: dto.url,
        vehicleClass: dto.vehicle_class
    })
}