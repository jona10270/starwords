import { Route, Routes } from "react-router-dom";

import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { HomePage } from "./pages/HomePage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { GuestRoute } from "./ProtectedRoutes";
import { ROUTES } from "./navigation/routes";
import { CharacterPage } from './pages/CharacterPage'
import { CharacterDetailPage } from "./pages/CharacterDetailPage";
import { AppLayout } from "./layouts/AppLayout";
import { FilmsListPage } from "./pages/films/FilmsListPage";

export const AppRoutes = () => (
    <Routes>
        {/* Paginas del archivo que comparten la cabecera para poder volver al listado desde arriba */}
        <Route element={<AppLayout />}>
            <Route path={ROUTES.home} element={<HomePage />} />
            <Route path={ROUTES.characters} element={<CharacterPage />} />
            <Route path={ROUTES.characterDetail} element={<CharacterDetailPage />} />
            <Route path={ROUTES.films} element={<FilmsListPage />} />
            <Route
                path={ROUTES.login}
                element={
                    <GuestRoute>
                        <LoginPage />
                    </GuestRoute>
                }
            />
            <Route
                path={ROUTES.register}
                element={
                    <GuestRoute>
                        <RegisterPage />
                    </GuestRoute>
                }
            />
        </Route>
        {/* Cualquier ruta que no exista acaba aqui en vez de en una pagina en blanco */}
        <Route path="*" element={<NotFoundPage />} />
    </Routes>
)
