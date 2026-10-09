// Guardo todas las rutas de la app en un solo sitio
export const ROUTES = {
    home: "/",
    login: "/login",
    register: "/register",
    characters: "/characters",
    characterDetail: "/characters/:id",
    films: "/films",
} as const;

// Nombre del parametro donde viaja la ruta a la que vuelvo tras el login
export const REDIRECT_PARAM = "redirectTo";
