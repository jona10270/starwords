// Como llamo a los valores que llegan del backend
export interface Starship {
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
    hyperdriveRating: string;
    mglt: string;
    starshipClass: string;
    pilots: string[];
    films: string[];
    url: string;
}
