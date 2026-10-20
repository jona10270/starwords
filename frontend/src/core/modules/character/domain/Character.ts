import type { ResourceDetailName, ResourceDetailTitle } from "../../common";

// Como son mis datos en el fronted
export interface Character {
    id: string
    name: string;
    birthYear: string | null;
    gender: string | null;
    height: string | null;
    mass: string | null;
    homeWorld: ResourceDetailName;
    films: ResourceDetailTitle[];
    species: ResourceDetailName[];
    vehicles: ResourceDetailName[];
    starships: ResourceDetailName[];
}