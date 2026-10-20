import type { ResourceDetailName } from "../../common";
export interface Film {
    id: string;
    title: string;
    episodeId: number;
    openingCrawl: string;
    director: string;
    producer: string;
    releaseDate: string;
    characters: ResourceDetailName[];
    planets: ResourceDetailName[];
    starships: ResourceDetailName[];
    species: ResourceDetailName[];
    vehicles: ResourceDetailName[];
    urlFilm: string;
}