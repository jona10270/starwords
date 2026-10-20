import { ApiProperty } from '@nestjs/swagger';
import { ResourceRefDto } from '@app/modules/starwars/common/resource-ref.dto';
import { PlanetDetailDto } from '@app/modules/starwars/planet/dto/planet.all.dto';
import { ResourceRefVM } from '../common/resource-ref.view-model';
import { ResourceResidentVM } from '../common/resource-ref.view-model';
import { ResourceResidentDto } from '@app/modules/starwars/common/resource-ref.dto';

export class PlanetVM {
  @ApiProperty({
    type: String,
    example: '1',
  })
  public readonly id: string;

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
    type: [ResourceResidentVM],
    example: [
      { id: '1', name: 'Luke Skywalker' },
      { id: '2', name: 'C-3PO' },
      { id: '4', name: 'Darth Vader' },
    ],
  })
  public readonly residents: ResourceResidentDto[];

  @ApiProperty({
    type: [ResourceRefVM],
    example: [
      { id: '1', title: 'A New Hope' },
      { id: '3', title: 'Return of the Jedi' },
      { id: '4', title: 'The Phantom Menace' },
      { id: '5', title: 'Attack of the Clones' },
      { id: '6', title: 'Revenge of the Sith' },
    ],
  })
  public readonly films: ResourceRefDto[];

  @ApiProperty({
    type: String,
    example: 'https://swapi.info/api/planets/1',
  })
  public readonly url: string;

  constructor(planet: PlanetDetailDto) {
    this.id = planet.id;
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
