import type { Character } from "./Character";
import type { SearchPageRequest, Paginated } from "../../common";

export interface CharacterRepository {
    // Lista una pagina de personajes de starwords
    getAll(request: SearchPageRequest): Promise<Paginated<Character>>;
    // Listo solo un personaje de starwords
    getCharacter(id: string): Promise<Character>;
}