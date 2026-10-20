import {
  ResourceNameDto,
  ResourceTitleDto,
} from '../../common/resource-ref.dto';

export interface VehicleAllDto {
  cargo_capacity: string;
  consumables: string;
  cost_in_credits: string;
  created: string;
  crew: string;
  edited: string;
  length: string;
  manufacturer: string;
  max_atmosphering_speed: string;
  model: string;
  name: string;
  passengers: string;
  pilots: string[];
  films: string[];
  url: string;
  vehicle_class: string;
}

// Creo un tipo para el envio de datos al frontend
export type VehicleWithIdDto = VehicleAllDto & { id: string };

export type VehicleDetailDto = Omit<VehicleWithIdDto, 'pilots' | 'films'> & {
  pilots: ResourceNameDto[];
  films: ResourceTitleDto[];
};
