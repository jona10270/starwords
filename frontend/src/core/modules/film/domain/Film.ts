export interface Film {
    id: string;
    title: string;
    episodeId: number;
    openingCrawl: string;
    director: string;
    producer: string;
    releaseDate: string;
    characters: string[];
    planets: string[];
    starships: string[];
    species: string[];
    vehicles: string[];
    urlFilm: string;
}