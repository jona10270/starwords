import type { UseCase } from "@/core/lib";
import type { FilmRepository } from "../domain/FilmsRepository";
import type { Film } from "../domain/Film";
import type { PageRequest, Paginated } from "../../common";

interface FilmsUseCaseProps {
    filmRepository: FilmRepository;
}

export class GetAllFilmsUseCase implements UseCase<PageRequest, Paginated<Film>> {
    private readonly filmRepository: FilmRepository;

    constructor({ filmRepository }: FilmsUseCaseProps ) {
        this.filmRepository = filmRepository;
    }

    async execute(request: PageRequest): Promise<Paginated<Film>> {
        return this.filmRepository.getAllFilms(request);
    }
}