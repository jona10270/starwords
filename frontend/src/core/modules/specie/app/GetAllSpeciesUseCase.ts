import type { UseCase } from "@/core/lib";
import type { SpecieRepository } from "../domain/SpecieRepository";
import type { Specie } from "../domain/Specie";

interface SpecieUseCaseProps {
    specieRepository: SpecieRepository;
}

export class GetAllSpeciesUseCase implements UseCase<void, Specie[]> {
    private readonly specieRepository: SpecieRepository;

    constructor({ specieRepository }: SpecieUseCaseProps) {
        this.specieRepository = specieRepository;
    }

    async execute(): Promise<Specie[]> {
        return this.specieRepository.getAllSpecies();
    }
}