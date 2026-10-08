import type { UseCase } from "@/core/lib";
import type { CharacterRepository } from "../domain/CharacterRepository";
import type { Character } from "../domain/Character";

// Lo que nesesiro para poder hacer la funcion de ver un character
interface OneCharacterUseCase {
    characterRepository: CharacterRepository
}

// La clase que ejecuta y construye el character
export class GetOneCharacterUseCase implements UseCase<string, Character> {
    private readonly characterRepository: CharacterRepository;

    constructor({ characterRepository }: OneCharacterUseCase ) {
        this.characterRepository = characterRepository;
    }

    async execute(id: string): Promise<Character> {
        return this.characterRepository.getCharacter(id);
    }
}