import type { UseCase } from "@/core/lib";
import type { SpecieRepository } from "../domain/SpecieRepository";
import type { Specie } from "../domain/Specie";
import type { PageRequest, Paginated } from "../../common";

interface SpecieUseCaseProps {
    specieRepository: SpecieRepository;
}

export class GetAllSpeciesUseCase implements UseCase<PageRequest, Paginated<Specie>> {
    private readonly specieRepository: SpecieRepository;

    constructor({ specieRepository }: SpecieUseCaseProps) {
        this.specieRepository = specieRepository;
    }

    async execute({ page, limit }: PageRequest): Promise<Paginated<Specie>> {
        return this.specieRepository.getAllSpecies({ page, limit });
    }
}