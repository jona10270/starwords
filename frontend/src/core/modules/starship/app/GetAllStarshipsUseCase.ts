import type { UseCase } from "@/core/lib";
import type { StarshipRepository } from "../domain/StarshipRepository";
import type { Starship } from "../domain/Starship";

interface GetAllStarshipsUseCaseProps {
    starshipRepository: StarshipRepository
}

export class GetAllStarshipsUseCase implements UseCase<void, Starship[]> {
    private readonly starshipRepository: StarshipRepository;

    constructor({ starshipRepository }: GetAllStarshipsUseCaseProps ) {
        this.starshipRepository = starshipRepository;
    }

    async execute(): Promise<Starship[]> {
        return this.starshipRepository.getAllStarships();
    }
}