import { ApiProperty } from '@nestjs/swagger';
import { FilmAllDto } from '@app/modules/starwars/film/dto/film.all.dto';

export class FilmVM {
  @ApiProperty({ type: String, example: 'A New Hope' })
  public readonly title: string;

  @ApiProperty({ type: Number, example: 4 })
  public readonly episode_id: number;

  @ApiProperty({
    type: String,
    example: 'It is a period of civil war. Rebel spaceships...',
  })
  public readonly opening_crawl: string;

  @ApiProperty({ type: String, example: 'George Lucas' })
  public readonly director: string;

  @ApiProperty({ type: String, example: 'Gary Kurtz, Rick McCallum' })
  public readonly producer: string;

  @ApiProperty({ type: String, example: '1977-05-25' })
  public readonly release_date: string;

  @ApiProperty({
    type: [String],
    example: [
      'https://swapi.info/api/people/1',
      'https://swapi.info/api/people/2',
    ],
  })
  public readonly characters: string[];

  @ApiProperty({
    type: [String],
    example: [
      'https://swapi.info/api/planets/1',
      'https://swapi.info/api/planets/2',
    ],
  })
  public readonly planets: string[];

  @ApiProperty({
    type: [String],
    example: [
      'https://swapi.info/api/starships/2',
      'https://swapi.info/api/starships/3',
    ],
  })
  public readonly starships: string[];

  @ApiProperty({
    type: [String],
    example: [
      'https://swapi.info/api/vehicles/4',
      'https://swapi.info/api/vehicles/6',
    ],
  })
  public readonly vehicles: string[];

  @ApiProperty({
    type: [String],
    example: [
      'https://swapi.info/api/species/1',
      'https://swapi.info/api/species/2',
    ],
  })
  public readonly species: string[];

  @ApiProperty({
    type: String,
    example: 'https://swapi.info/api/films/1',
  })
  public readonly url: string;

  public constructor(film: FilmAllDto) {
    this.title = film.title;
    this.episode_id = film.episode_id;
    this.opening_crawl = film.opening_crawl;
    this.director = film.director;
    this.producer = film.producer;
    this.release_date = film.release_date;
    this.characters = film.characters;
    this.planets = film.planets;
    this.starships = film.starships;
    this.vehicles = film.vehicles;
    this.species = film.species;
    this.url = film.url;
  }
}