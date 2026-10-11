// Las claves que utilizamo en el frontend de los datos que recibimos del backend
export interface Vehicle {
    id: string;
    name: string;
    model: string;
    manufacturer: string;
    costInCredits: string;
    length: string;
    maxAtmospheringSpeed: string;
    crew: string;
    passengers: string;
    cargoCapacity: string;
    consumables: string;
    pilots: string[];
    films: string[];
    url: string;
    vehicleClass: string;
}