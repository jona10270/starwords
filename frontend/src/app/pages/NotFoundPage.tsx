import { Link } from "react-router-dom";

import { ROUTES } from "../navigation/routes";

// Pagina para cualquier ruta que no existe
export const NotFoundPage = () => (
    <main className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-[440px] border border-line bg-[linear-gradient(#080808,#030303)] p-8 text-center">
            <p className="font-terminal text-[10px] tracking-[0.26em] text-muted uppercase">Error 404</p>
            <h1 className="mt-3 font-display text-3xl font-bold tracking-[0.12em] text-accent uppercase">
                Ruta perdida
            </h1>
            <p className="mt-4 font-terminal text-[11px] tracking-[0.16em] text-dim uppercase">
                Este no es el archivo que buscas
            </p>
            <Link
                to={ROUTES.home}
                className="mt-8 inline-block bg-accent px-4 py-3 font-terminal text-[11px] font-medium tracking-[0.26em] text-black uppercase transition-shadow hover:shadow-[0_0_26px_rgba(247,217,43,0.5)]"
            >
                Volver al inicio ▸
            </Link>
        </div>
    </main>
);
