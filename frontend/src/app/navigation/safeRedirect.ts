import { REDIRECT_PARAM, ROUTES } from "./routes";

// Lo minimo que necesito saber de donde estaba el usuario
interface CurrentLocation {
    pathname: string;
    search: string;
    hash: string;
}

// Rutas a las que nunca vuelvo para no entrar en bucle
const BLOCKED_REDIRECT_PATHS: readonly string[] = [ROUTES.login, ROUTES.register];

// Añado el redirectTo a una ruta solo si hay una pagina a la que volver
export const withRedirectParam = (path: string, redirectTo: string | null): string => {
    if (!redirectTo) return path;

    const params = new URLSearchParams({ [REDIRECT_PARAM]: redirectTo });
    return `${path}?${params.toString()}`;
};

// Monto la url del login apuntando de donde venia el usuario
export const buildLoginPath = ({ pathname, search, hash }: CurrentLocation): string => {
    const from = `${pathname}${search}${hash}`;

    // Si venia de home no hace falta apuntar nada
    return withRedirectParam(ROUTES.login, from === ROUTES.home ? null : from);
};

// Devuelvo siempre una ruta interna segura y si dudo mando a home
export const getSafeRedirectPath = (
    value: string | null,
    origin: string = window.location.origin,
): string => {
    if (!value || !value.startsWith("/")) return ROUTES.home;

    // Dejo que el navegador interprete la url para no adivinar trucos como //evil.com
    let url: URL;
    try {
        url = new URL(value, origin);
    } catch {
        return ROUTES.home;
    }

    // Si apunta a otro dominio es una redireccion abierta y la descarto
    if (url.origin !== origin) return ROUTES.home;

    if (BLOCKED_REDIRECT_PATHS.includes(url.pathname)) return ROUTES.home;

    return `${url.pathname}${url.search}${url.hash}`;
};
