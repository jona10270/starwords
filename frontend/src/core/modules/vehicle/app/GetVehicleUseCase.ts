import type { UseCase } from "@/core/lib";
import type { VehicleRepository } from "../domain/VehicleRepository";
import type { Vehicle } from "../domain/Vehicle";

interface VehicleUseCaseProps {
    vehicleRepository: VehicleRepository
}

export class GetVehicleUseCase implements UseCase<string, Vehicle> {
    private readonly vehicleRepository: VehicleRepository;

    constructor({ vehicleRepository }: VehicleUseCaseProps) {
        this.vehicleRepository = vehicleRepository;
    }

    async execute(id: string): Promise<Vehicle> {
        return this.vehicleRepository.getVehicle(id);
    }
}