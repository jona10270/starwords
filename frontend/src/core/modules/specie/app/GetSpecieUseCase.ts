import type { UseCase } from "@/core/lib";
import type { SpecieRepository } from "../domain/SpecieRepository";
import type { Specie } from "../domain/Specie";

interface SpecieUseCaseProps {
    specieRepository: SpecieRepository
}

export class GetSpecieUseCase implements UseCase<string, Specie> {
    private readonly specieRepository: SpecieRepository;

    constructor({ specieRepository }: SpecieUseCaseProps) {
        this.specieRepository = specieRepository;
    }

    async execute(id: string): Promise<Specie> {
        return this.specieRepository.getSpecie(id);
    }
}