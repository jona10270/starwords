import { useSearchParams } from "react-router-dom";

import { REDIRECT_PARAM, ROUTES } from "../navigation/routes";
import { getSafeRedirectPath, withRedirectParam } from "../navigation/safeRedirect";

// Doy las rutas de login y registro conservando la pagina a la que el usuario queria volver
export const useAuthPaths = () => {
    const [searchParams] = useSearchParams();
    const safePath = getSafeRedirectPath(searchParams.get(REDIRECT_PARAM));

    // Solo arrastro el destino si es seguro y no es home
    const redirectTo = safePath === ROUTES.home ? null : safePath;

    return {
        loginPath: withRedirectParam(ROUTES.login, redirectTo),
        registerPath: withRedirectParam(ROUTES.register, redirectTo),
    };
};
