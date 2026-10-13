import type { UseCase } from "@/core/lib";
import type { PlanetRepository } from "../domain/PlanetRepository";
import type { Planet } from "../domain/Planet";
import type { PageRequest, Paginated } from "../../common";

interface PlanetUseCaseProps {
    planetRepository: PlanetRepository;
}

export class GetAllPlanetsUseCase implements UseCase<PageRequest, Paginated<Planet>> {
    private readonly planetRepository: PlanetRepository;

    constructor({ planetRepository }: PlanetUseCaseProps) {
        this.planetRepository = planetRepository;
    }

    async execute({ page, limit }: PageRequest): Promise<Paginated<Planet>> {
        return this.planetRepository.getAllPlanets({ page, limit });
    }
}