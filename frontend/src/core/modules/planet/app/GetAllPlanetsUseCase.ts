import type { UseCase } from "@/core/lib";
import type { PlanetRepository } from "../domain/PlanetRepository";
import type { Planet } from "../domain/Planet";

interface PlanetUseCaseProps {
    planetRepository: PlanetRepository;
}

export class GetAllPlanetsUseCase implements UseCase<void, Planet[]> {
    private readonly planetRepository: PlanetRepository;

    constructor({ planetRepository }: PlanetUseCaseProps) {
        this.planetRepository = planetRepository;
    }

    async execute(): Promise<Planet[]> {
        return this.planetRepository.getAllPlanets();
    }
}