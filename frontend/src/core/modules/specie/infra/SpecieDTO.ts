import type { PaginationMetaDTO, ResourceDetailName, ResourceDetailTitle } from "../../common";

export interface SpecieDTO {
    id: string;
    name: string;
    classification: string;
    designation: string;
    average_height: string;
    skin_colors: string;
    hair_colors: string;
    eye_colors: string;
    average_lifespan: string;
    homeworld: ResourceDetailName | null;
    language: string;
    people: ResourceDetailName[];
    films: ResourceDetailTitle[];
    url: string;
}

export interface SpecieListResponseDTO {
    species: SpecieDTO[];
    meta: PaginationMetaDTO;
}
export interface SpecieResponseDTO {
    specie: SpecieDTO
}

