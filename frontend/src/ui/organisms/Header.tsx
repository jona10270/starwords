import { useState } from "react";

import { MenuIcon } from "../atoms";
import { AuthControl, MobileMenu, ResourceIconNav, SectionNav, Wordmark } from "../molecules";
import type { HeaderAuth, NavItem } from "../types";

interface HeaderProps {
    items: NavItem[];
    homePath: string;
    auth: HeaderAuth;
}

const MOBILE_MENU_ID = "mobile-menu";

// Cabecera del archivo con iconos a la izquierda logo en el centro y acceso a la derecha
export const Header = ({ items, homePath, auth }: HeaderProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            <header className="relative z-20 border-b border-[#1a1a1a] bg-[linear-gradient(#000,rgba(0,0,0,0.85))] backdrop-blur-[2px]">
                <div className="flex items-center justify-between gap-6 border-b border-[#111] px-4 py-3.5 sm:px-7">
                    <ResourceIconNav items={items} />

                    <Wordmark to={homePath} title="SWAPI" tagline="Galactic database" />

                    <div className="flex flex-1 items-center justify-end gap-4">
                        <div className="hidden items-center gap-4 lg:flex">
                            <AuthControl auth={auth} />
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
                            aria-expanded={isMenuOpen}
                            aria-controls={MOBILE_MENU_ID}
                            aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
                            className="flex h-8 w-9 cursor-pointer items-center justify-center border border-field bg-[#0c0c0c] text-accent lg:hidden"
                        >
                            <MenuIcon />
                        </button>
                    </div>
                </div>

                <SectionNav items={items} />

                {isMenuOpen && (
                    <MobileMenu
                        id={MOBILE_MENU_ID}
                        items={items}
                        auth={auth}
                        onNavigate={() => setIsMenuOpen(false)}
                    />
                )}
            </header>

            <div className="relative z-10 flex items-center justify-center gap-2 border-b border-[#161616] bg-[#0a0a0a] px-5 py-[9px]">
                <span className="font-terminal text-[10px] tracking-[0.3em] text-[#7d818a] uppercase">
                    Star Wars on SWAPI database
                </span>
                <span aria-hidden="true" className="text-[10px] text-accent">
                    ▸
                </span>
            </div>
        </>
    );
};
