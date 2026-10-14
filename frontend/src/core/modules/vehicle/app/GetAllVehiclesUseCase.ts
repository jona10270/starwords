import type { UseCase } from "@/core/lib";
import type { VehicleRepository } from "../domain/VehicleRepository";
import type { Vehicle } from "../domain/Vehicle";
import type { Paginated, SearchPageRequest } from "../../common";

interface VehiclesUseCaseProps {
    vehicleRepository: VehicleRepository;
}

export class GetAllVehiclesUseCase implements UseCase<SearchPageRequest, Paginated<Vehicle>> {
    private readonly vehicleRepository: VehicleRepository;

    constructor({ vehicleRepository }: VehiclesUseCaseProps) {
        this.vehicleRepository = vehicleRepository;
    }

    async execute({ page, limit, search }: SearchPageRequest): Promise<Paginated<Vehicle>> {
        return this.vehicleRepository.getAllVehicles({ page, limit, search });
    }
}