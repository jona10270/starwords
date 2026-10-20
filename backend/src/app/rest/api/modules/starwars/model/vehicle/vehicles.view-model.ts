import { ApiProperty } from '@nestjs/swagger';
import { VehicleDetailDto } from '@app/modules/starwars/vehicles/dto/vehicles.all.dto';
import {
  ResourceNameVM,
  ResourceTitleVM,
} from '../common/resource-ref.view-model';
import {
  ResourceNameDto,
  ResourceTitleDto,
} from '@app/modules/starwars/common/resource-ref.dto';

export class VehicleVM {
  @ApiProperty({
    type: String,
    example: '4',
  })
  public readonly id: string;

  @ApiProperty({
    type: String,
    example: 'Sand Crawler',
  })
  public readonly name: string;

  @ApiProperty({
    type: String,
    example: 'Digger Crawler',
  })
  public readonly model: string;

  @ApiProperty({
    type: String,
    example: 'Corellia Mining Corporation',
  })
  public readonly manufacturer: string;

  @ApiProperty({
    type: String,
    example: '150000',
  })
  public readonly cost_in_credits: string;

  @ApiProperty({
    type: String,
    example: '36.8',
  })
  public readonly length: string;

  @ApiProperty({
    type: String,
    example: '30',
  })
  public readonly max_atmosphering_speed: string;

  @ApiProperty({
    type: String,
    example: '46',
  })
  public readonly crew: string;

  @ApiProperty({
    type: String,
    example: '30',
  })
  public readonly passengers: string;

  @ApiProperty({
    type: String,
    example: '50000',
  })
  public readonly cargo_capacity: string;

  @ApiProperty({
    type: String,
    example: '2 months',
  })
  public readonly consumables: string;

  @ApiProperty({
    type: [ResourceNameVM],
    example: [],
  })
  public readonly pilots: ResourceNameDto[];

  @ApiProperty({
    type: [ResourceTitleVM],
    example: [
      { id: '1', title: 'A New Hope' },
      { id: '5', title: 'Attack of the Clones' },
    ],
  })
  public readonly films: ResourceTitleDto[];

  @ApiProperty({
    type: String,
    example: 'https://swapi.info/api/vehicles/4',
  })
  public readonly url: string;

  @ApiProperty({
    type: String,
    example: 'wheeled',
  })
  public readonly vehicle_class: string;

  public constructor(vehicle: VehicleDetailDto) {
    this.id = vehicle.id;
    this.name = vehicle.name;
    this.model = vehicle.model;
    this.manufacturer = vehicle.manufacturer;
    this.cost_in_credits = vehicle.cost_in_credits;
    this.length = vehicle.length;
    this.max_atmosphering_speed = vehicle.max_atmosphering_speed;
    this.crew = vehicle.crew;
    this.passengers = vehicle.passengers;
    this.cargo_capacity = vehicle.cargo_capacity;
    this.consumables = vehicle.consumables;
    this.pilots = vehicle.pilots;
    this.films = vehicle.films;
    this.url = vehicle.url;
    this.vehicle_class = vehicle.vehicle_class;
  }
}
