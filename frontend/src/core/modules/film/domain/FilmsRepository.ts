import type { Film } from "./Film";

export interface FilmRepository {
    // Puerto para buscar todos las peliculas
    getAllFilms(): Promise<Film[]>;
    // Puerto para buscar una pelicula
    getFilm(id: string):Promise<Film>;
}