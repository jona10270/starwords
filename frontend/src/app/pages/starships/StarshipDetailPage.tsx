import { useParams } from "react-router-dom";

import { ArchiveNote, LoadingBar } from "@/ui/atoms";
import { ErrorPanel } from "@/ui/molecules";
import { RecordDetail } from "@/ui/organisms/RecordDetail";
import type { Starship } from "@/core/modules/starship";

import { useGetStarship } from "../../hooks/useGetStarship";
import { isRetryable } from "../../hooks/retryResource";
import { ROUTES } from "../../navigation/routes";

import { formatStarshipValue } from "./formatStarshipValue";

const CATEGORY_LABEL = "Starships";

// Paso la nave al formato de ficha que entiende la ui
const toDetail = (starship: Starship) => {
    const highlights = [
        { label: "Modelo", value: formatStarshipValue(starship.model) },
        { label: "Clase", value: formatStarshipValue(starship.starshipClass) },
        { label: "Fabricante", value: formatStarshipValue(starship.manufacturer) },
        { label: "Coste", value: formatStarshipValue(starship.costInCredits, "créditos") },
    ];

    return {
        badge: `#${starship.id.padStart(2, "0")} · ${CATEGORY_LABEL}`,
        breadcrumb: `SWAPI · Archivo central / ${CATEGORY_LABEL} / ${starship.name}`,
        title: starship.name,
        subtitle: highlights.slice(0, 2).map(({ label, value }) => `${label}: ${value}`).join(" · "),
        highlights,
        attributes: [
            { label: "Registro", value: starship.id },
            ...highlights,
            { label: "Longitud", value: formatStarshipValue(starship.length, "m") },
            { label: "Velocidad atmosférica", value: formatStarshipValue(starship.maxAtmospheringSpeed, "km/h") },
            { label: "Tripulación", value: formatStarshipValue(starship.crew) },
            { label: "Pasajeros", value: formatStarshipValue(starship.passengers) },
            { label: "Capacidad de carga", value: formatStarshipValue(starship.cargoCapacity, "kg") },
            { label: "Autonomía", value: formatStarshipValue(starship.consumables) },
            { label: "Hiperimpulsor", value: formatStarshipValue(starship.hyperdriveRating) },
            { label: "MGLT", value: formatStarshipValue(starship.mglt) },
            { label: "Pilotos", value: String(starship.pilots.length) },
            { label: "Películas", value: String(starship.films.length) },
        ],
    };
};

// Ficha de una nave con todos sus datos
export const StarshipDetailPage = () => {
    const { id } = useParams();

    const starshipQuery = useGetStarship(id);
    const starship = starshipQuery.data;

    return (
        <main className="relative z-10 mx-auto max-w-[1280px] px-4 pt-12 pb-24 sm:px-7">
            {starshipQuery.isPending && <LoadingBar />}

            {starshipQuery.isPending && (
                <ArchiveNote className="mt-12">Descodificando registro galáctico…</ArchiveNote>
            )}

            {starshipQuery.isError && (
                <ErrorPanel
                    message={starshipQuery.error.message}
                    onRetry={isRetryable(starshipQuery.error) ? () => starshipQuery.refetch() : undefined}
                    isRetrying={starshipQuery.isFetching}
                />
            )}

            {starship && <RecordDetail backPath={ROUTES.starships} {...toDetail(starship)} />}
        </main>
    );
};
