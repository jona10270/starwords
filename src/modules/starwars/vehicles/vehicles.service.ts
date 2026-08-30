import { Injectable } from "@nestjs/common";
import { SwapiRequest } from "../common/swapi.service";
import { VehiclesManyResponse } from "@app/app/rest/api/modules/starwars/controller/client/response/vehicle/vehicles.client.many.response";
import { VehicleAllDto } from "./dto/vehicles.all.dto";
import { VehicleSingleResponse } from "@app/app/rest/api/modules/starwars/controller/client/response/vehicle/vehicle.client.single.response";

@Injectable()
export class VehiclesService {
    public constructor(
        private readonly swapiRequest: SwapiRequest,
    ) {}

    public async getAllVehicles(): Promise<VehiclesManyResponse> {
        const data = await this.swapiRequest.request<VehicleAllDto[]>('/vehicles')

        return new VehiclesManyResponse(data)
    }

    public async getVehicle(vehicleId): Promise<VehicleSingleResponse> {
        const data = await this.swapiRequest.request<VehicleAllDto>(`/vehicles/${vehicleId}`)

        return new VehicleSingleResponse(data)
    }

}