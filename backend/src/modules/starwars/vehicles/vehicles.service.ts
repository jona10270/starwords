import { Injectable } from '@nestjs/common';
import { SwapiRequest } from '../common/swapi.service';
import { VehiclesManyResponse } from '@app/app/rest/api/modules/starwars/controller/client/response/vehicle/vehicles.client.many.response';
import {
  VehicleAllDto,
  VehicleDetailDto,
  VehicleWithIdDto,
} from './dto/vehicles.all.dto';
import { VehicleSingleDto } from './dto/vehicle.single.dto';
import { VehicleSingleResponse } from '@app/app/rest/api/modules/starwars/controller/client/response/vehicle/vehicle.client.single.response';
import { getIdFromUrl } from '../common/get-id-from-url';
import { paginate } from '../common/paginate';
import { filterByText } from '../common/filter-by-text';
import { ResourceRefService } from '../common/resource-ref.service';

@Injectable()
export class VehiclesService {
  public constructor(
    private readonly swapiRequest: SwapiRequest,
    private readonly resourceRefService: ResourceRefService,
  ) {}

  public async getAllVehicles(
    page: number,
    limit: number,
    search?: string,
  ): Promise<VehiclesManyResponse> {
    const data = await this.swapiRequest.request<VehicleAllDto[]>('/vehicles');

    // Saco de cada vehicle su id y lo meto en el array
    const vehicles = data.map((vehicle) => ({
      ...vehicle,
      id: getIdFromUrl(vehicle.url),
    }));

    // Filtro antes de paginar para que el total cuente solo lo encontrado

    const found = filterByText(vehicles, search, (vehicle) => vehicle.name);
    const { items, total } = paginate(found, page, limit);

    const detailVehicles = await Promise.all(
      items.map((vehicle) => this.resolveRelation(vehicle)),
    );

    return new VehiclesManyResponse(detailVehicles, total, page, limit);
  }

  public async getVehicle(vehicleId: string): Promise<VehicleSingleResponse> {
    const data = await this.swapiRequest.request<VehicleSingleDto>(
      `/vehicles/${vehicleId}`,
    );

    // Añado al vehicle la clave id
    const vehicle = await this.resolveRelation({
      ...data,
      id: getIdFromUrl(data.url),
    });

    return new VehicleSingleResponse(vehicle);
  }

  // Ejecuto todas las peticiones en paralelo para ganar mas velocidad
  private async resolveRelation(
    vehicle: VehicleWithIdDto,
  ): Promise<VehicleDetailDto> {
    const [pilots, films] = await Promise.all([
      Promise.all(
        vehicle.pilots.map((url) =>
          this.resourceRefService.getNameRef('people', url),
        ),
      ),
      Promise.all(
        vehicle.films.map((url) =>
          this.resourceRefService.getTitleRef('films', url),
        ),
      ),
    ]);

    return {
      ...vehicle,
      pilots,
      films,
    };
  }
}
