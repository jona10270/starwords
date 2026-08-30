import { ApiProperty } from '@nestjs/swagger';
import { SpeciesAllDto } from '@app/modules/starwars/specie/dto/specie.all.dto';

export class SpecieVM {
  @ApiProperty({
    type: String,
    example: 'Wookie',
  })
  public readonly name: string;

  @ApiProperty({
    type: String,
    example: 'mammal',
  })
  public readonly classification: string;

  @ApiProperty({
    type: String,
    example: 'sentient',
  })
  public readonly designation: string;

  @ApiProperty({
    type: String,
    example: '210',
  })
  public readonly average_height: string;

  @ApiProperty({
    type: String,
    example: 'gray',
  })
  public readonly skin_colors: string;

  @ApiProperty({
    type: String,
    example: 'black, brown',
  })
  public readonly hair_colors: string;

  @ApiProperty({
    type: String,
    example: 'blue, green, yellow, brown, golden, red',
  })
  public readonly eye_colors: string;

  @ApiProperty({
    type: String,
    example: '400',
  })
  public readonly average_lifespan: string;

  @ApiProperty({
    type: String,
    example: 'https://swapi.info/api/planets/14',
  })
  public readonly homeworld: string;

  @ApiProperty({
    type: String,
    example: 'Shyriiwook',
  })
  public readonly language: string;

  @ApiProperty({
    type: [String],
    example: [
      'https://swapi.info/api/people/13',
      'https://swapi.info/api/people/80',
    ],
  })
  public readonly people: string[];

  @ApiProperty({
    type: [String],
    example: [
      'https://swapi.info/api/films/1',
      'https://swapi.info/api/films/2',
      'https://swapi.info/api/films/3',
      'https://swapi.info/api/films/6',
    ],
  })
  public readonly films: string[];

  @ApiProperty({
    type: String,
    example: 'https://swapi.info/api/species/3',
  })
  public readonly url: string;

  constructor(specie: SpeciesAllDto) {
    this.name = specie.name;
    this.classification = specie.classification;
    this.designation = specie.designation;
    this.average_height = specie.average_height;
    this.skin_colors = specie.skin_colors;
    this.hair_colors = specie.hair_colors;
    this.eye_colors = specie.eye_colors;
    this.average_lifespan = specie.average_lifespan;
    this.homeworld = specie.homeworld;
    this.language = specie.language;
    this.people = specie.people;
    this.films = specie.films;
    this.url = specie.url;
  }
}
