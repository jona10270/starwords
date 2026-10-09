import type { Film } from "./Film";

export interface FilmRepository {
    // Puerto para buscar todos las peliculas
    getAllFilms(): Promise<Film[]>;
}