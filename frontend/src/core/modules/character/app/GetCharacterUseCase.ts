import type { UseCase } from "@/core/lib";

import type { Character } from "../domain/Character";
import type { CharacterRepository } from "../domain/CharacterRepository";

interface CharacterUseCaseProps {
    characterRepository: CharacterRepository;
}

export class GetCharacterUseCase implements UseCase<void, Character[]> {
    private readonly characterRepository: CharacterRepository;

    constructor({ characterRepository }: CharacterUseCaseProps) {
        this.characterRepository = characterRepository;
    }

    async execute(): Promise<Character[]> {
        return this.characterRepository.getAll();
    }
}
