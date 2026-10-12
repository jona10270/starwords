import type { PageRequest, Paginated } from "../../common";
import type { Film } from "./Film";

export interface FilmRepository {
    // Puerto para buscar todos las peliculas
    getAllFilms(request: PageRequest): Promise<Paginated<Film>>;
    // Puerto para buscar una pelicula
    getFilm(id: string):Promise<Film>;
}