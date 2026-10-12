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
import { FilmDetailPage } from "./pages/films/FilmDetailPage";
import { StarshipsListPage } from "./pages/starships/StarshipsListPage";
import { StarshipDetailPage } from "./pages/starships/StarshipDetailPage";
import { VehiclesListPage } from "./pages/vehicles/VehiclesListPage";
import { VehicleDetailPage } from "./pages/vehicles/VehicleDetailPage";
import { SpeciesListPage } from "./pages/species/SpeciesListPage";
import { SpecieDetailPage } from "./pages/species/SpecieDetailPage";
import { PlanetsListPage } from "./pages/planets/PlanetsListPage";
import { PlanetDetailPage } from "./pages/planets/PlanetDetailPage";

export const AppRoutes = () => (
    <Routes>
        {/* Paginas del archivo que comparten la cabecera para poder volver al listado desde arriba */}
        <Route element={<AppLayout />}>
            <Route path={ROUTES.home} element={<HomePage />} />
            <Route path={ROUTES.characters} element={<CharacterPage />} />
            <Route path={ROUTES.characterDetail} element={<CharacterDetailPage />} />
            <Route path={ROUTES.films} element={<FilmsListPage />} />
            <Route path={ROUTES.filmDetail} element={<FilmDetailPage />} />
            <Route path={ROUTES.starships} element={<StarshipsListPage />} />
            <Route path={ROUTES.starshipDetail} element={<StarshipDetailPage />} />
            <Route path={ROUTES.vehicles} element={<VehiclesListPage />} />
            <Route path={ROUTES.vehicleDetail} element={<VehicleDetailPage />} />
            <Route path={ROUTES.species} element={<SpeciesListPage />} />
            <Route path={ROUTES.specieDetail} element={<SpecieDetailPage />} />
            <Route path={ROUTES.planets} element={<PlanetsListPage />} />
            <Route path={ROUTES.planetDetail} element={<PlanetDetailPage />} />
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
