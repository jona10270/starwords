import type { UseCase } from "@/core/lib";
import type { VehicleRepository } from "../domain/VehicleRepository";
import type { Vehicle } from "../domain/Vehicle";

interface VehiclesUseCaseProps {
    vehicleRepository: VehicleRepository;
}

export class GetAllVehiclesUseCase implements UseCase<void, Vehicle[]> {
    private readonly vehicleRepository: VehicleRepository;

    constructor({ vehicleRepository }: VehiclesUseCaseProps) {
        this.vehicleRepository = vehicleRepository;
    }

    async execute(): Promise<Vehicle[]> {
        return this.vehicleRepository.getAllVehicles();
    }
}