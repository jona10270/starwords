import type { PaginationMetaDTO, ResourceDetailName, ResourceDetailTitle } from "../../common";

// Los datos que me llegan del backend y que ecojo de los que llegan
export interface StarshipDTO {
    id:string;
    name: string;
    model: string;
    manufacturer: string;
    cost_in_credits: string;
    length: string;
    max_atmosphering_speed: string;
    crew: string;
    passengers: string;
    cargo_capacity: string;
    consumables: string;
    hyperdrive_rating: string;
    MGLT: string;
    starship_class: string;
    pilots: ResourceDetailName[];
    films: ResourceDetailTitle[];
    url: string;
}

// Como debo de recibir los datos del backend si o si
// Una clave starship con muchos starshipdto
export interface StarshipListResponseDTO {
    starship: StarshipDTO[];
    meta: PaginationMetaDTO;
}
// Como debo de recibir los datos del backend si o si
// Una clave starship con muchos starshipdto
export interface StarshipResponseDTO {
    starship: StarshipDTO;
}