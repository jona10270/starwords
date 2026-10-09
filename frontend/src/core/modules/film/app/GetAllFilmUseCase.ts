import type { UseCase } from "@/core/lib";
import type { FilmRepository } from "../domain/FilmaRepository";
import type { Film } from "../domain/Film";

interface FilmsUseCaseProps {
    filmRepository: FilmRepository;
}

export class GetAllFilmsUseCase implements UseCase<void, Film[]> {
    private readonly filmRepository: FilmRepository;

    constructor({ filmRepository }: FilmsUseCaseProps ) {
        this.filmRepository = filmRepository;
    }

    async execute(): Promise<Film[]> {
        return this.filmRepository.getAllFilms();
    }
}