import type { UseCase } from "@/core/lib";
import type { StarshipRepository } from "../domain/StarshipRepository";
import type { Starship } from "../domain/Starship";
import type { PageRequest, Paginated } from "../../common";

interface GetAllStarshipsUseCaseProps {
    starshipRepository: StarshipRepository
}

export class GetAllStarshipsUseCase implements UseCase<PageRequest, Paginated<Starship>> {
    private readonly starshipRepository: StarshipRepository;

    constructor({ starshipRepository }: GetAllStarshipsUseCaseProps ) {
        this.starshipRepository = starshipRepository;
    }

    async execute({page, limit}: PageRequest): Promise<Paginated<Starship>> {
        return this.starshipRepository.getAllStarships({page, limit});
    }
}