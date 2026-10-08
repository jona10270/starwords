import type { Character } from "./Character"

export interface CharacterRepository {
    // Lista todos los personajes de starwords
    getAll(): Promise<Character[]>;
    // Listo solo un personaje de starwords
    getCharacter(id: string): Promise<Character>;
}