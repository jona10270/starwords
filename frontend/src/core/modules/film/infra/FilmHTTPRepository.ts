import type { Film } from "../domain/Film";
import type { FilmRepository } from "../domain/FilmsRepository";
import type { FilmResponseDTO, FilmListResponseDTO } from "./FilmDTO";
import { ResourceErrorMapper, type HttpClient } from "../../common";
import { FilmMapper } from "./FilmMapper";

interface FilmHTTPRepositoryProps {
    httpClient: HttpClient;
}

export class FilmHTTPRepository implements FilmRepository {
    private readonly httpClient: HttpClient;

    constructor({ httpClient }: FilmHTTPRepositoryProps) {
        this.httpClient = httpClient
    }

    async getAllFilms(): Promise<Film[]> {
        let data: FilmListResponseDTO; 

        try {
            data = await this.httpClient.get<FilmListResponseDTO>(
                '/starwars/films'
            );
        } catch (error) {
            throw ResourceErrorMapper.toListError(error)
        }
        return data.film.map((FilmMapper.toFilm))
    }

    async getFilm(id: string): Promise<Film> {
        let data: FilmResponseDTO;
        try {
            data = await this.httpClient.get<FilmResponseDTO>(
                `/starwars/films/${id}`
            )
        } catch (error) {
            throw ResourceErrorMapper.toDetailError(error, 'La película no existe')
        }
        return FilmMapper.toFilm(data.film)
    }
}