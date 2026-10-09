import type { UseCase } from "@/core/lib";
import type { FilmRepository } from "../domain/FilmsRepository";
import type { Film } from "../domain/Film";

interface GetFilmUseCaseProps {
    filmRepository: FilmRepository;
}

export class GetFilmUseCase implements UseCase<string, Film> {
    private readonly filmRepository: FilmRepository;

    constructor({ filmRepository }: GetFilmUseCaseProps ) {
        this.filmRepository = filmRepository;
    }

    async execute(id: string): Promise<Film> {
        return this.filmRepository.getFilm(id);
    }
}