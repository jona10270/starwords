import type { CharacterDTO } from "./CharacterDTO"
import type { Character } from "../domain/Character"

export const CharacterMapper = {

    // Convierto el personaje del backend en el mio del frontend
    toCharacter: (dto: CharacterDTO): Character => ({
        id: dto.id,
        name: dto.name,
        birthYear: dto.birth_year,
        gender: dto.gender,
        height: dto.height,
        mass: dto.mass,
        homeWorld: dto.homeworld,
    }),
}