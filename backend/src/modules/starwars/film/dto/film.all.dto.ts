export interface FilmAllDto {
  title: string;
  episode_id: number;
  opening_crawl: string;
  director: string;
  producer: string;
  release_date: string;
  characters: string[];
  planets: string[];
  starships: string[];
  vehicles: string[];
  species: string[];
  url: string;
}

// La pelicula despues de que le añado el id sacado de la url
export type FilmWithIdDto = FilmAllDto & { id: string };
