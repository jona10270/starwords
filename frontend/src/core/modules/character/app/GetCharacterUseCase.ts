import type { UseCase } from "@/core/lib";

import type { Character } from "../domain/Character";
import type { CharacterRepository } from "../domain/CharacterRepository";
import type { PageRequest, Paginated } from "../../common";

interface CharacterUseCaseProps {
    characterRepository: CharacterRepository;
}

export class GetCharacterUseCase implements UseCase<PageRequest, Paginated<Character>> {
    private readonly characterRepository: CharacterRepository;

    constructor({ characterRepository }: CharacterUseCaseProps) {
        this.characterRepository = characterRepository;
    }

    async execute(request: PageRequest): Promise<Paginated<Character>> {
        return this.characterRepository.getAll(request);
    }
}
