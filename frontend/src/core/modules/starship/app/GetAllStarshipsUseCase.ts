import type { UseCase } from "@/core/lib";
import type { StarshipRepository } from "../domain/StarshipRepository";
import type { Starship } from "../domain/Starship";
import type { Paginated, SearchPageRequest } from "../../common";

interface GetAllStarshipsUseCaseProps {
    starshipRepository: StarshipRepository
}

export class GetAllStarshipsUseCase implements UseCase<SearchPageRequest, Paginated<Starship>> {
    private readonly starshipRepository: StarshipRepository;

    constructor({ starshipRepository }: GetAllStarshipsUseCaseProps ) {
        this.starshipRepository = starshipRepository;
    }

    async execute({ page, limit, search }: SearchPageRequest): Promise<Paginated<Starship>> {
        return this.starshipRepository.getAllStarships({ page, limit, search });
    }
}