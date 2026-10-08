import { Link } from "react-router-dom";

import { useAuthState } from "../hooks/useAuthState";
import { ROUTES } from "../navigation/routes";

// Portada del archivo con un saludo y el nombre si hay sesion
export const HomePage = () => {
    const authState = useAuthState();
    const username = authState.kind === "AuthenticatedAuthState" ? authState.user.username : null;

    return (
        <main className="relative z-10 mx-auto flex max-w-[1280px] flex-col items-center px-4 pt-24 pb-24 text-center sm:px-7">
            <p className="font-terminal text-[10px] tracking-[0.42em] text-[#6f747c] uppercase">
                SWAPI · Archivo central
            </p>
            <h1 className="mt-4 text-[34px] leading-tight font-bold tracking-[0.14em] text-white uppercase sm:text-[48px]">
                Bienvenido
                {username && (
                    <>
                        , <span className="break-all text-accent">{username}</span>
                    </>
                )}
            </h1>
            <p className="mt-6 max-w-[52ch] font-terminal text-xs leading-relaxed tracking-[0.08em] text-dim">
                La base de datos galáctica de Star Wars: personajes, películas, naves, vehículos, especies y planetas.
            </p>
            <Link
                to={ROUTES.characters}
                className="mt-10 bg-accent px-5 py-3 font-terminal text-[11px] font-medium tracking-[0.26em] text-black uppercase transition-shadow hover:shadow-[0_0_26px_rgba(247,217,43,0.5)]"
            >
                Ver personajes ▸
            </Link>
        </main>
    );
};
