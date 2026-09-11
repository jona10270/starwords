import { ApiProperty } from '@nestjs/swagger';
import { PeopleAllDto } from '@app/modules/starwars/people/dto/people.all.dto';

export class PeopleVM {
  @ApiProperty({ type: String, example: 'Luke Skywalker' })
  public readonly name: string;

  @ApiProperty({ type: String, example: '172' })
  public readonly height: string;

  @ApiProperty({ type: String, example: '77' })
  public readonly mass: string;

  @ApiProperty({ type: String, example: 'blond' })
  public readonly hair_color: string;

  @ApiProperty({ type: String, example: 'fair' })
  public readonly skin_color: string;

  @ApiProperty({ type: String, example: 'blue' })
  public readonly eye_color: string;

  @ApiProperty({ type: String, example: '19BBY' })
  public readonly birth_year: string;

  @ApiProperty({ type: String, example: 'male' })
  public readonly gender: string;

  @ApiProperty({
    type: String,
    example: 'https://swapi.info/api/planets/1',
  })
  public readonly homeworld: string;

  @ApiProperty({
    type: [String],
    example: ['https://swapi.info/api/films/1'],
  })
  public readonly films: string[];

  @ApiProperty({
    type: [String],
    example: [],
  })
  public readonly species: string[];

  @ApiProperty({
    type: [String],
    example: ['https://swapi.info/api/vehicles/14'],
  })
  public readonly vehicles: string[];

  @ApiProperty({
    type: [String],
    example: ['https://swapi.info/api/starships/12'],
  })
  public readonly starships: string[];

  @ApiProperty({
    type: String,
    example: 'https://swapi.info/api/people/1',
  })
  public readonly url: string;

  public constructor(people: PeopleAllDto) {
    this.name = people.name;
    this.height = people.height;
    this.mass = people.mass;
    this.hair_color = people.hair_color;
    this.skin_color = people.skin_color;
    this.eye_color = people.eye_color;
    this.birth_year = people.birth_year;
    this.gender = people.gender;
    this.homeworld = people.homeworld;
    this.films = people.films;
    this.species = people.species;
    this.vehicles = people.vehicles;
    this.starships = people.starships;
    this.url = people.url;
  }
}