import type { Film } from "../domain/Film";
import type { FilmRepository } from "../domain/FilmaRepository";
import type { FilmListResponseDTO } from "./FilmDTO";
import { ResourceErrorMapper, type HttpClient } from "../../common";
import { FilmMapper } from "./FilmMapper";

interface FilmHTTPRepositoryProps {
    httpClient: HttpClient;
}

export class FilmHTTPRepository implements FilmRepository {
    private readonly httplClient: HttpClient;

    constructor({ httpClient }: FilmHTTPRepositoryProps) {
        this.httplClient = httpClient
    }

    async getAllFilms(): Promise<Film[]> {
        let data: FilmListResponseDTO; 

        try {
            data = await this.httplClient.get<FilmListResponseDTO>(
                '/starwars/films'
            );
        } catch (error) {
            throw ResourceErrorMapper.toListError(error)
        }
        return data.film.map((FilmMapper.toFilm))
    }
}