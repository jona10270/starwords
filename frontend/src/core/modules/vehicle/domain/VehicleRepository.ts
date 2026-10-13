import type { PageRequest, Paginated } from "../../common";
import type { Vehicle } from "./Vehicle";

// Creo el puerto de Vehicles
export interface VehicleRepository {
    // Funcion para listar todos los vehicles
    getAllVehicles(request: PageRequest): Promise<Paginated<Vehicle>>

    // Funciona para mostrar solo un vehicle
    getVehicle(id: string): Promise<Vehicle>
}