import { Injectable } from '@nestjs/common';
import { SwapiRequest } from '../common/swapi.service';
import { VehiclesManyResponse } from '@app/app/rest/api/modules/starwars/controller/client/response/vehicle/vehicles.client.many.response';
import { VehicleAllDto } from './dto/vehicles.all.dto';
import { VehicleSingleDto } from './dto/vehicle.single.dto';
import { VehicleSingleResponse } from '@app/app/rest/api/modules/starwars/controller/client/response/vehicle/vehicle.client.single.response';
import { getIdFromUrl } from '../common/get-id-from-url';
import { paginate } from '../common/paginate';

@Injectable()
export class VehiclesService {
  public constructor(private readonly swapiRequest: SwapiRequest) {}

  public async getAllVehicles(
    page: number,
    limit: number,
  ): Promise<VehiclesManyResponse> {
    const data = await this.swapiRequest.request<VehicleAllDto[]>('/vehicles');

    // Saco de cada vehicle su id y lo meto en el array
    const vehicles = data.map((vehicle) => ({
      ...vehicle,
      id: getIdFromUrl(vehicle.url),
    }));

    const { items, total } = paginate(vehicles, page, limit);
    return new VehiclesManyResponse(items, total, page, limit);
  }

  public async getVehicle(vehicleId: string): Promise<VehicleSingleResponse> {
    const data = await this.swapiRequest.request<VehicleSingleDto>(
      `/vehicles/${vehicleId}`,
    );

    // Añado al vehicle la clave id
    const vehicle = {
      ...data,
      id: getIdFromUrl(data.url),
    };

    return new VehicleSingleResponse(vehicle);
  }
}
