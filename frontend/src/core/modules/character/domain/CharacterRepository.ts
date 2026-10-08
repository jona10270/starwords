import type { Character } from "./Character"

export interface CharacterRepository {
    // Lista todos los personajes de starwords
    getAll(): Promise<Character[]>
}