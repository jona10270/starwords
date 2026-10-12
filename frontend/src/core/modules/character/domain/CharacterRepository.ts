import type { Character } from "./Character";
import type { PageRequest, Paginated } from "../../common";

export interface CharacterRepository {
    // Lista una pagina de personajes de starwords
    getAll(request: PageRequest): Promise<Paginated<Character>>;
    // Listo solo un personaje de starwords
    getCharacter(id: string): Promise<Character>;
}