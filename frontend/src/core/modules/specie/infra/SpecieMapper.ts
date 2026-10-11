import type { Specie } from "../domain/Specie"
import type { SpecieDTO } from "./SpecieDTO"

// Adapto los datos recibidos del backend al modelo de dominio del frontend
export const SpecieMapper = {
    toSpecie: (dto: SpecieDTO): Specie => ({
        id: dto.id,
        name: dto.name,
        classification: dto.classification,
        designation: dto.designation,
        averageHeight: dto.average_height,
        skinColors: dto.skin_colors,
        hairColors: dto.hair_colors,
        eyeColors: dto.eye_colors,
        averageLifespan: dto.average_lifespan,
        homeWorld: dto.homeworld,
        language: dto.language,
        people: dto.people,
        films: dto.films,
        url: dto.url,
    })
}