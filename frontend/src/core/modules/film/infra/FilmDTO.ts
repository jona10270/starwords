import type { PaginationMetaDTO } from "../../common";
import type { ResourceDetailName } from "../../common";

export interface FilmDTO {
    id: string;
    title: string;
    episode_id: number;
    opening_crawl: string;
    director: string;
    producer: string;
    release_date: string;
    characters: ResourceDetailName[];
    planets: string[];
    starships: string[];
    vehicles: string[];
    species: string[];
    url: string;
}

export interface FilmListResponseDTO {
    film: FilmDTO[];
    meta: PaginationMetaDTO;
}

export interface FilmResponseDTO {
    film: FilmDTO;
}