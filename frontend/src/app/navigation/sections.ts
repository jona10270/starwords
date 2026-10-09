import { FilmsIcon, PeopleIcon, PlanetsIcon, SpeciesIcon, StarshipsIcon, VehiclesIcon } from "@/ui/atoms";
import type { NavItem } from "@/ui/types";

import { ROUTES } from "./routes";

// Secciones del archivo y las que aun no tienen pagina van sin ruta y salen apagadas
export const ARCHIVE_SECTIONS: NavItem[] = [
    { key: "people", label: "People", icon: PeopleIcon, to: ROUTES.characters },
    { key: "films", label: "Films", icon: FilmsIcon, to: ROUTES.films},
    { key: "starships", label: "Starships", icon: StarshipsIcon },
    { key: "vehicles", label: "Vehicles", icon: VehiclesIcon },
    { key: "species", label: "Species", icon: SpeciesIcon },
    { key: "planets", label: "Planets", icon: PlanetsIcon },
];
