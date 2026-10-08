import { NavLink } from "react-router-dom";

import type { NavItem } from "../types";

interface SectionNavProps {
    items: NavItem[];
}

const BASE_CLASS =
    "relative flex items-center px-0.5 pt-4 pb-[15px] text-[13px] font-semibold tracking-[0.2em] whitespace-nowrap uppercase transition-[color,text-shadow] duration-200";

// Barra de secciones debajo de la cabecera con la activa subrayada en amarillo
export const SectionNav = ({ items }: SectionNavProps) => (
    <nav aria-label="Secciones" className="hidden items-stretch justify-center gap-10 px-7 lg:flex">
        {items.map(({ key, label, to }) =>
            to ? (
                <NavLink
                    key={key}
                    to={to}
                    className={({ isActive }) =>
                        `${BASE_CLASS} ${
                            isActive
                                ? "text-white [text-shadow:0_0_16px_rgba(247,217,43,0.35)]"
                                : "text-steel hover:text-white hover:[text-shadow:0_0_14px_rgba(247,217,43,0.5)]"
                        }`
                    }
                >
                    {({ isActive }) => (
                        <>
                            {label}
                            <span
                                aria-hidden="true"
                                className={`absolute inset-x-0 bottom-0 h-1 ${
                                    isActive ? "bg-accent shadow-[0_0_14px_#f7d92b]" : "bg-transparent"
                                }`}
                            />
                        </>
                    )}
                </NavLink>
            ) : (
                <span
                    key={key}
                    role="link"
                    aria-disabled="true"
                    title="Próximamente"
                    className={`${BASE_CLASS} cursor-not-allowed text-steel opacity-40`}
                >
                    {label}
                </span>
            ),
        )}
    </nav>
);
