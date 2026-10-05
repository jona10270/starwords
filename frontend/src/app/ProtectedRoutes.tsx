import type { ReactNode } from "react";
import { Navigate, useLocation, useSearchParams } from "react-router-dom";
import { useAuthState } from "./hooks/useAuthState";
import { REDIRECT_PARAM } from "./navigation/routes";
import { buildLoginPath, getSafeRedirectPath } from "./navigation/safeRedirect";

interface RouteGuardProps {
    children: ReactNode
};

// Reviso si tengo session si no la tengo me lleva al login apuntando la pagina que pedia
export const AuthRoute = ({ children }: RouteGuardProps ) => {
    const authState = useAuthState();
    const location = useLocation();

    if (authState.kind === "CheckingAuthState") {
        return <p className="p-8">Comprobando sessión...</p>;
    }

    if (authState.kind === "UnauthenticatedAuthState") {
        return <Navigate to={buildLoginPath(location)} replace />;
    }

    return children;
};

// Si ya estoy logueado me devuelve a la pagina que pedia o a home si no es segura
export const GuestRoute = ({ children }: RouteGuardProps) => {
    const authState = useAuthState();
    const [searchParams] = useSearchParams();

    if (authState.kind === "CheckingAuthState") {
        return <p className="p-8">Comprobando sessión...</p>;
    }

    if (authState.kind === "AuthenticatedAuthState") {
        return <Navigate to={getSafeRedirectPath(searchParams.get(REDIRECT_PARAM))} replace />;
    }

    return children

}
