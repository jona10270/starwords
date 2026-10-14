import type { Film } from "../domain/Film";
import type { FilmRepository } from "../domain/FilmsRepository";
import type { FilmResponseDTO, FilmListResponseDTO } from "./FilmDTO";
import { PaginationMapper, ResourceErrorMapper, type HttpClient, type Paginated, type SearchPageRequest } from "../../common";
import { FilmMapper } from "./FilmMapper";

interface FilmHTTPRepositoryProps {
    httpClient: HttpClient;
}

export class FilmHTTPRepository implements FilmRepository {
    private readonly httpClient: HttpClient;

    constructor({ httpClient }: FilmHTTPRepositoryProps) {
        this.httpClient = httpClient
    }

    async getAllFilms({ page, limit, search }: SearchPageRequest): Promise<Paginated<Film>> {
        let data: FilmListResponseDTO;
        try {
            data = await this.httpClient.get<FilmListResponseDTO>('/starwars/films', { page, limit, search });
        } catch (error) {
            throw ResourceErrorMapper.toListError(error);
        }

        const films = data.film.map(FilmMapper.toFilm);
        return PaginationMapper.toPaginated(films, data.meta);
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