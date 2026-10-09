import type { CharacterDTO } from "./CharacterDTO"
import type { Character } from "../domain/Character"

// Valores con los que swapi dice que no lo sabe
const UNKNOWN_VALUES = ["unknown", "n/a", "none"];

// Paso a null lo que swapi no sabe para que no llegue a la pantalla
const toKnownValue = (value: string): string | null => (UNKNOWN_VALUES.includes(value) ? null : value);

export const CharacterMapper = {

    // Convierto el personaje del backend en el mio del frontend
    toCharacter: (dto: CharacterDTO): Character => ({
        id: dto.id,
        name: dto.name,
        birthYear: toKnownValue(dto.birth_year),
        gender: toKnownValue(dto.gender),
        height: toKnownValue(dto.height),
        mass: toKnownValue(dto.mass),
        homeWorld: dto.homeworld,
    }),
}
