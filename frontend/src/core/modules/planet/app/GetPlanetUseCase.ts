import type { UseCase } from "@/core/lib";
import type { PlanetRepository } from "../domain/PlanetRepository";
import type { Planet } from "../domain/Planet";

interface PlanetUseCaseProps {
    planetRepository: PlanetRepository;
}

export class GetPlanetUseCase implements UseCase<string, Planet> {
    private readonly planetRepository: PlanetRepository;

    constructor({ planetRepository }: PlanetUseCaseProps) {
        this.planetRepository = planetRepository;
    }

    async execute(id: string): Promise<Planet> {
        return this.planetRepository.getPlanet(id);
    }
}