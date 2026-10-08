import { Outlet } from "react-router-dom";

import { logoutUseCase } from "@/core/di/container";
import type { AuthState } from "@/core/modules/auth";
import { Header } from "@/ui/organisms/Header";
import type { HeaderAuth } from "@/ui/types";

import { useAuthState } from "../hooks/useAuthState";
import { ROUTES } from "../navigation/routes";
import { ARCHIVE_SECTIONS } from "../navigation/sections";

// Traduzco el estado de la sesion a lo que necesita la cabecera
const toHeaderAuth = (authState: AuthState): HeaderAuth => {
    if (authState.kind === "CheckingAuthState") return { status: "checking" };

    if (authState.kind === "AuthenticatedAuthState") {
        return {
            status: "user",
            username: authState.user.username,
            onLogout: () => void logoutUseCase.execute(),
        };
    }

    return { status: "guest", loginPath: ROUTES.login };
};

// Marco comun de las paginas del archivo con la cabecera arriba
export const AppLayout = () => {
    const authState = useAuthState();

    return (
        <div className="min-h-screen font-display text-white">
            <Header items={ARCHIVE_SECTIONS} homePath={ROUTES.characters} auth={toHeaderAuth(authState)} />
            <Outlet />
        </div>
    );
};
