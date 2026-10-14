import type { UseCase } from "@/core/lib";
import type { FilmRepository } from "../domain/FilmsRepository";
import type { Film } from "../domain/Film";
import type { Paginated, SearchPageRequest } from "../../common";

interface FilmsUseCaseProps {
    filmRepository: FilmRepository;
}

export class GetAllFilmsUseCase implements UseCase<SearchPageRequest, Paginated<Film>> {
    private readonly filmRepository: FilmRepository;

    constructor({ filmRepository }: FilmsUseCaseProps ) {
        this.filmRepository = filmRepository;
    }

    async execute(request: SearchPageRequest): Promise<Paginated<Film>> {
        return this.filmRepository.getAllFilms(request);
    }
}