import type { Vehicle } from "./Vehicle";

// Creo el puerto de Vehicles
export interface VehicleRepository {
    // Funcion para listar todos los vehicles
    getAllVehicles(): Promise<Vehicle[]>

    // Funciona para mostrar solo un vehicle
    getVehicle(id: string): Promise<Vehicle>
}