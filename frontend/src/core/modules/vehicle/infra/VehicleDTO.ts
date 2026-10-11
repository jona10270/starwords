export interface VehicleDTO {
    id: string,
    name: string,
    model: string,
    manufacturer: string,
    cost_in_credits: string,
    length: string,
    max_atmosphering_speed: string,
    crew: string,
    passengers: string,
    cargo_capacity: string,
    consumables: string,
    pilots: string[],
    films: string[]
    url: string,
    vehicle_class: string
}

export interface VehicleListResponseDTO {
    vehicles: VehicleDTO[]
}

export interface VehicleResponseDTO {
    vehicle: VehicleDTO
}