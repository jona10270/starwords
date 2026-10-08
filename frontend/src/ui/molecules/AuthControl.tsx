import { Link } from "react-router-dom";

import { UserIcon } from "../atoms";
import type { HeaderAuth } from "../types";

interface AuthControlProps {
    auth: HeaderAuth;
}

const ACTION_CLASS =
    "flex cursor-pointer items-center gap-2 text-xs font-semibold tracking-[0.22em] whitespace-nowrap text-white uppercase transition-[color,text-shadow] duration-200 hover:text-accent hover:[text-shadow:0_0_12px_rgba(247,217,43,0.6)]";

// Acceso de la derecha de la cabecera segun haya sesion o no
export const AuthControl = ({ auth }: AuthControlProps) => {
    // Mientras compruebo la sesion no pinto nada para que no parpadee
    if (auth.status === "checking") return null;

    if (auth.status === "guest") {
        return (
            <Link to={auth.loginPath} className={ACTION_CLASS}>
                <UserIcon />
                Iniciar sesión
            </Link>
        );
    }

    return (
        <>
            <span className="font-terminal text-[10px] tracking-[0.18em] whitespace-nowrap text-accent uppercase">
                Operador · {auth.username}
            </span>
            <button type="button" onClick={auth.onLogout} className={ACTION_CLASS}>
                <UserIcon />
                Cerrar sesión
            </button>
        </>
    );
};
