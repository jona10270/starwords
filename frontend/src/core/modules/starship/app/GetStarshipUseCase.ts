import type { UseCase } from "@/core/lib";
import type { StarshipRepository } from "../domain/StarshipRepository";
import type { Starship } from "../domain/Starship";

interface GetStarshipUseCaseProps {
    starshipRepository: StarshipRepository;
}

export class GetStarshipUseCase implements UseCase<string, Starship> {
    private readonly starshipRepository: StarshipRepository;

    constructor({ starshipRepository }: GetStarshipUseCaseProps) {
        this.starshipRepository = starshipRepository;
    }

    async execute(id: string): Promise<Starship> {
        return this.starshipRepository.getStarship(id);
    }
}