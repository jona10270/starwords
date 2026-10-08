import type { ComponentType } from "react";

import type { IconProps } from "./atoms/Icons";

// Una seccion del archivo y si aun no tiene pagina va sin ruta
export interface NavItem {
    key: string;
    label: string;
    icon: ComponentType<IconProps>;
    to?: string;
}

// Lo que la cabecera necesita saber de la sesion sin conocer el store
export type HeaderAuth =
    | { status: "checking" }
    | { status: "guest"; loginPath: string }
    | { status: "user"; username: string; onLogout: () => void };
