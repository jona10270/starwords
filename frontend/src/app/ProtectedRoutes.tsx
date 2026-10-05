import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthState } from "./hooks/useAuthState";

interface RouteGuardProps {
    children: ReactNode
};

// Reviso si tengo session si no la tengo me lleva al login si no al children la pagina que pido
export const AuthRoute = ({ children }: RouteGuardProps ) => {
    const authState = useAuthState();

    if (authState.kind === "CheckingAuthState") {
        return <p className="p-8">Comprobando sessión...</p>;
    }

    if (authState.kind === "UnauthenticatedAuthState") {
        return <Navigate to="/login" replace />;
    }

    return children;
};

// Sirve para que si estoy ya logueado y hago /login me lleve a /
export const GuestRoute = ({ children }: RouteGuardProps) => {
    const authState = useAuthState();

    if (authState.kind === "CheckingAuthState") {
        return <p className="p-8">Comprobando sessión...</p>;
    }
    
    if (authState.kind === "AuthenticatedAuthState") {
        return <Navigate to="/" replace />;
    }

    return children 

}
