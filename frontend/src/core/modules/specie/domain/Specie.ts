import type { ResourceDetailName, ResourceDetailTitle } from "../../common";

export interface Specie {
    id: string;
    name: string;
    classification: string;
    designation: string;
    averageHeight: string;
    skinColors: string;
    hairColors: string;
    eyeColors: string;
    averageLifespan: string;
    homeWorld: ResourceDetailName | null;
    language: string;
    people: ResourceDetailName[];
    films: ResourceDetailTitle[];
    url: string;
}

