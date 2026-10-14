import type { UseCase } from "@/core/lib";
import type { SpecieRepository } from "../domain/SpecieRepository";
import type { Specie } from "../domain/Specie";
import type { Paginated, SearchPageRequest } from "../../common";

interface SpecieUseCaseProps {
    specieRepository: SpecieRepository;
}

export class GetAllSpeciesUseCase implements UseCase<SearchPageRequest, Paginated<Specie>> {
    private readonly specieRepository: SpecieRepository;

    constructor({ specieRepository }: SpecieUseCaseProps) {
        this.specieRepository = specieRepository;
    }

    async execute({ page, limit, search }: SearchPageRequest): Promise<Paginated<Specie>> {
        return this.specieRepository.getAllSpecies({ page, limit, search });
    }
}