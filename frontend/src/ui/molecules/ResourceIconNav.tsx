import { NavLink } from "react-router-dom";

import type { NavItem } from "../types";

interface ResourceIconNavProps {
    items: NavItem[];
}

// Iconos de la izquierda de la cabecera y los que no tienen pagina salen apagados
export const ResourceIconNav = ({ items }: ResourceIconNavProps) => (
    <nav aria-label="Recursos" className="hidden min-w-0 flex-1 items-center gap-5 lg:flex">
        {items.map(({ key, label, icon: Icon, to }) =>
            to ? (
                <NavLink
                    key={key}
                    to={to}
                    title={label}
                    aria-label={label}
                    className={({ isActive }) =>
                        `flex items-center transition-[color,filter] duration-200 hover:text-accent hover:drop-shadow-[0_0_8px_rgba(247,217,43,0.8)] ${
                            isActive ? "text-accent" : "text-dim"
                        }`
                    }
                >
                    <Icon />
                </NavLink>
            ) : (
                <span
                    key={key}
                    role="link"
                    aria-disabled="true"
                    aria-label={`${label}, próximamente`}
                    title={`${label} · próximamente`}
                    className="flex cursor-not-allowed items-center text-dim opacity-35"
                >
                    <Icon />
                </span>
            ),
        )}
    </nav>
);
