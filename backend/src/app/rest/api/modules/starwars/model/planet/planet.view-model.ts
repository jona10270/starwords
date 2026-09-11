import { PlanetAllDto } from '@app/modules/starwars/planet/dto/planet.all.dto';
import { ApiProperty } from '@nestjs/swagger';

export class PlanetVM {
  @ApiProperty({
    type: String,
    example: 'Tatooine',
  })
  public readonly name: string;

  @ApiProperty({
    type: String,
    example: '23',
  })
  public readonly rotation_period: string;

  @ApiProperty({
    type: String,
    example: '304',
  })
  public readonly orbital_period: string;

  @ApiProperty({
    type: String,
    example: '10465',
  })
  public readonly diameter: string;

  @ApiProperty({
    type: String,
    example: 'arid',
  })
  public readonly climate: string;

  @ApiProperty({
    type: String,
    example: '1 standard',
  })
  public readonly gravity: string;

  @ApiProperty({
    type: String,
    example: 'desert',
  })
  public readonly terrain: string;

  @ApiProperty({
    type: String,
    example: '1',
  })
  public readonly surface_water: string;

  @ApiProperty({
    type: String,
    example: '200000',
  })
  public readonly population: string;

  @ApiProperty({
    type: [String],
    example: [
      'https://swapi.info/api/people/1',
      'https://swapi.info/api/people/2',
    ],
  })
  public readonly residents: string[];

  @ApiProperty({
    type: [String],
    example: [
      'https://swapi.info/api/films/1',
      'https://swapi.info/api/films/3',
      'https://swapi.info/api/films/4',
      'https://swapi.info/api/films/5',
      'https://swapi.info/api/films/6',
    ],
  })
  public readonly films: string[];

  @ApiProperty({
    type: String,
    example: 'https://swapi.info/api/planets/1',
  })
  public readonly url: string;

  constructor(planet: PlanetAllDto) {
    this.name = planet.name;
    this.rotation_period = planet.rotation_period;
    this.orbital_period = planet.orbital_period;
    this.diameter = planet.diameter;
    this.climate = planet.climate;
    this.gravity = planet.gravity;
    this.terrain = planet.terrain;
    this.surface_water = planet.surface_water;
    this.population = planet.population;
    this.residents = planet.residents;
    this.films = planet.films;
    this.url = planet.url;
  }
}
