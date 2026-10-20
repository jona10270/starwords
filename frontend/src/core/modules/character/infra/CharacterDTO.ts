import type { PaginationMetaDTO, ResourceDetailName, ResourceDetailTitle } from "../../common";

// Personaje tal como me lo manda el backend
export interface CharacterDTO {
    id: string;
    name: string;
    height: string;
    mass: string;
    hair_color: string;
    skin_color: string;
    eye_color: string;
    birth_year: string;
    gender: string;
    homeworld: ResourceDetailName;
    films: ResourceDetailTitle[];
    species: ResourceDetailName[];
    vehicles: ResourceDetailName[];
    starships: ResourceDetailName[];
    url: string;
}

export interface CharacterListResponseDTO {
    people: CharacterDTO[];
    meta: PaginationMetaDTO;
}

export interface CharacterResponseDTO {
    people: CharacterDTO;
}