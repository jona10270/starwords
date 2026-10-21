import { generatePath, useParams } from "react-router-dom";

import { AlertNote, ArchiveNote, LoadingBar } from "@/ui/atoms";
import { ErrorPanel } from "@/ui/molecules";
import { RecordDetail } from "@/ui/organisms/RecordDetail";
import type { Starship } from "@/core/modules/starship";

import { useGetStarship } from "../../hooks/useGetStarship";
import { useFavoriteButtons } from "../../hooks/useFavoriteButtons";
import { isRetryable } from "../../hooks/retryResource";
import { ROUTES } from "../../navigation/routes";

import { formatRecordValue } from "@/app/format/formatRecordValue";

const CATEGORY_LABEL = "Starships";

// Paso la nave al formato de ficha que entiende la ui
const toDetail = (starship: Starship) => {
    const highlights = [
        { label: "Modelo", value: formatRecordValue(starship.model) },
        { label: "Clase", value: formatRecordValue(starship.starshipClass) },
        { label: "Fabricante", value: formatRecordValue(starship.manufacturer) },
        { label: "Coste", value: formatRecordValue(starship.costInCredits, "créditos") },
    ];

    return {
        badge: CATEGORY_LABEL,
        title: starship.name,
        subtitle: highlights.slice(0, 2).map(({ label, value }) => `${label}: ${value}`).join(" · "),
        highlights,
        attributes: [
            ...highlights,
            { label: "Longitud", value: formatRecordValue(starship.length, "m") },
            { label: "Velocidad atmosférica", value: formatRecordValue(starship.maxAtmospheringSpeed, "km/h") },
            { label: "Tripulación", value: formatRecordValue(starship.crew) },
            { label: "Pasajeros", value: formatRecordValue(starship.passengers) },
            { label: "Capacidad de carga", value: formatRecordValue(starship.cargoCapacity, "kg") },
            { label: "Autonomía", value: formatRecordValue(starship.consumables) },
            { label: "Hiperimpulsor", value: formatRecordValue(starship.hyperdriveRating) },
            { label: "MGLT", value: formatRecordValue(starship.mglt) },
            { label: "Pilotos", value: String(starship.pilots.length) },
            { label: "Películas", value: String(starship.films.length) },
        ],
        relations: [
            {
                title: "Pilotos",
                links: starship.pilots.map((pilot) => ({
                    id: pilot.id,
                    label: pilot.name,
                    to: generatePath(ROUTES.characterDetail, { id: pilot.id }),
                })),
            },
            {
                title: "Películas",
                links: starship.films.map((film) => ({
                    id: film.id,
                    label: film.title,
                    to: generatePath(ROUTES.filmDetail, { id: film.id }),
                })),
            },
        ],
    };
};

// Ficha de una nave con todos sus datos
export const StarshipDetailPage = () => {
    const { id } = useParams();

    const starshipQuery = useGetStarship(id);
    const { getFavoriteButton, errorMessage: favoriteError } = useFavoriteButtons("STARSHIP", id ? [id] : []);
    const starship = starshipQuery.data;

    return (
        <main className="relative z-10 mx-auto max-w-[1280px] px-4 pt-12 pb-24 sm:px-7">
            {starshipQuery.isPending && <LoadingBar />}

            {starshipQuery.isPending && (
                <ArchiveNote className="mt-12">Cargando…</ArchiveNote>
            )}

            {starshipQuery.isError && (
                <ErrorPanel
                    message={starshipQuery.error.message}
                    onRetry={isRetryable(starshipQuery.error) ? () => starshipQuery.refetch() : undefined}
                    isRetrying={starshipQuery.isFetching}
                />
            )}

            {favoriteError && <AlertNote>{favoriteError}</AlertNote>}

            {starship && <RecordDetail backPath={ROUTES.starships} {...toDetail(starship)} favorite={getFavoriteButton(starship.id)} />}
        </main>
    );
};
