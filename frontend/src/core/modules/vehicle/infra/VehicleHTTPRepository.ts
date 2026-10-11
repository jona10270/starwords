import { ResourceErrorMapper, type HttpClient } from "../../common";
import type { Vehicle } from "../domain/Vehicle";
import type { VehicleRepository } from "../domain/VehicleRepository";
import type { VehicleListResponseDTO, VehicleResponseDTO } from "./VehicleDTO";
import { VehicleMapper } from "./VehicleMapper";

interface VehicleHTTPRepositoryProps {
    httpClient: HttpClient;
}

export class VehicleHTTPRepository implements VehicleRepository{
    private readonly httpClient: HttpClient;

    constructor({ httpClient }: VehicleHTTPRepositoryProps) {
        this.httpClient = httpClient;
    }

    async getAllVehicles(): Promise<Vehicle[]> {
        let data: VehicleListResponseDTO
        try {
            data = await this.httpClient.get<VehicleListResponseDTO>(
                '/starwars/vehicles'
            )
        } catch (error) {
            throw ResourceErrorMapper.toListError(error);
        }
        return data.vehicles.map(VehicleMapper.toVehicle)
    }

    async getVehicle(id: string): Promise<Vehicle> {
        let data: VehicleResponseDTO;
        try {
            data = await this.httpClient.get<VehicleResponseDTO>(
                `/starwars/vehicles/${id}`
            )
        } catch (error) {
            throw ResourceErrorMapper.toDetailError(error, 'El vehículo no existe');
        }
        return VehicleMapper.toVehicle(data.vehicle)
    }
}