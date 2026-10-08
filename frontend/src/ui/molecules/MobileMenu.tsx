import { NavLink } from "react-router-dom";

import type { HeaderAuth, NavItem } from "../types";
import { AuthControl } from "./AuthControl";

interface MobileMenuProps {
    id: string;
    items: NavItem[];
    auth: HeaderAuth;
    onNavigate: () => void;
}

const ROW_CLASS =
    "border-b border-[#111] px-4 py-3.5 text-xs font-semibold tracking-[0.22em] uppercase sm:px-7";

// Menu desplegable del movil con las secciones y el acceso
export const MobileMenu = ({ id, items, auth, onNavigate }: MobileMenuProps) => (
    <nav id={id} aria-label="Menú" className="flex flex-col border-t border-[#1a1a1a] bg-[#050505] lg:hidden">
        {items.map(({ key, label, to }) =>
            to ? (
                <NavLink
                    key={key}
                    to={to}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                        `${ROW_CLASS} ${isActive ? "text-accent" : "text-[#cfd3d8] hover:text-accent"}`
                    }
                >
                    {label}
                </NavLink>
            ) : (
                <span key={key} role="link" aria-disabled="true" className={`${ROW_CLASS} text-dim opacity-50`}>
                    {label} · próximamente
                </span>
            ),
        )}
        <div className="flex items-center gap-4 px-4 py-3.5 sm:px-7">
            <AuthControl auth={auth} />
        </div>
    </nav>
);
