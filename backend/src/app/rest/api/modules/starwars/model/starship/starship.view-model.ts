import { ApiProperty } from '@nestjs/swagger';
import { StarshipAllDto } from '@app/modules/starwars/starships/dto/starship.all.dto';

export class StarshipVM {
  @ApiProperty({
    type: String,
    example: 'Death Star',
  })
  public readonly name: string;

  @ApiProperty({
    type: String,
    example: 'DS-1 Orbital Battle Station',
  })
  public readonly model: string;

  @ApiProperty({
    type: String,
    example:
      'Imperial Department of Military Research, Sienar Fleet Systems',
  })
  public readonly manufacturer: string;

  @ApiProperty({
    type: String,
    example: '1000000000000',
  })
  public readonly cost_in_credits: string;

  @ApiProperty({
    type: String,
    example: '120000',
  })
  public readonly length: string;

  @ApiProperty({
    type: String,
    example: 'n/a',
  })
  public readonly max_atmosphering_speed: string;

  @ApiProperty({
    type: String,
    example: '342,953',
  })
  public readonly crew: string;

  @ApiProperty({
    type: String,
    example: '843,342',
  })
  public readonly passengers: string;

  @ApiProperty({
    type: String,
    example: '1000000000000',
  })
  public readonly cargo_capacity: string;

  @ApiProperty({
    type: String,
    example: '3 years',
  })
  public readonly consumables: string;

  @ApiProperty({
    type: String,
    example: '4.0',
  })
  public readonly hyperdrive_rating: string;

  @ApiProperty({
    type: String,
    example: '10',
  })
  public readonly MGLT: string;

  @ApiProperty({
    type: String,
    example: 'Deep Space Mobile Battlestation',
  })
  public readonly starship_class: string;

  @ApiProperty({
    type: [String],
    example: [],
  })
  public readonly pilots: string[];

  @ApiProperty({
    type: [String],
    example: ['https://swapi.info/api/films/1'],
  })
  public readonly films: string[];

  @ApiProperty({
    type: String,
    example: 'https://swapi.info/api/starships/9',
  })
  public readonly url: string;

  public constructor(starship: StarshipAllDto) {
    this.name = starship.name;
    this.model = starship.model;
    this.manufacturer = starship.manufacturer;
    this.cost_in_credits = starship.cost_in_credits;
    this.length = starship.length;
    this.max_atmosphering_speed = starship.max_atmosphering_speed;
    this.crew = starship.crew;
    this.passengers = starship.passengers;
    this.cargo_capacity = starship.cargo_capacity;
    this.consumables = starship.consumables;
    this.hyperdrive_rating = starship.hyperdrive_rating;
    this.MGLT = starship.MGLT;
    this.starship_class = starship.starship_class;
    this.pilots = starship.pilots;
    this.films = starship.films;
    this.url = starship.url;
  }
}