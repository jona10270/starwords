import type { FilmDTO } from "./FilmDTO"
import type { Film } from "../domain/Film"

export const FilmMapper = {
    toFilm: (dto: FilmDTO): Film => ({
        id: dto.id,
        title: dto.title,
        episodeId: dto.episode_id,
        openingCrawl: dto.opening_crawl,
        director: dto.director,
        producer: dto.producer,
        releaseDate: dto.release_date,
        characters: dto.characters,
        planets: dto.planets,
        starships: dto.starships,
        species: dto.species,
        urlFilm: dto.url,        
    })
}