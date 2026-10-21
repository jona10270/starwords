import { generatePath, useParams } from "react-router-dom";

import { AlertNote, ArchiveNote, LoadingBar } from "@/ui/atoms";
import { ErrorPanel } from "@/ui/molecules";
import { RecordDetail } from "@/ui/organisms/RecordDetail";
import type { Planet } from "@/core/modules/planet";

import { useGetPlanet } from "../../hooks/useGetPlanet";
import { useFavoriteButtons } from "../../hooks/useFavoriteButtons";
import { isRetryable } from "../../hooks/retryResource";
import { ROUTES } from "../../navigation/routes";

import { formatRecordValue } from "@/app/format/formatRecordValue";

const CATEGORY_LABEL = "Planets";

// Paso el planeta al formato de ficha que entiende la ui
const toDetail = (planet: Planet) => {
    const highlights = [
        { label: "Clima", value: formatRecordValue(planet.climate) },
        { label: "Terreno", value: formatRecordValue(planet.terrain) },
        { label: "Población", value: formatRecordValue(planet.population) },
        { label: "Diámetro", value: formatRecordValue(planet.diameter, "km") },
    ];

    return {
        badge: `#${planet.id.padStart(2, "0")} · ${CATEGORY_LABEL}`,
        breadcrumb: `SWAPI · Archivo central / ${CATEGORY_LABEL} / ${planet.name}`,
        title: planet.name,
        subtitle: highlights.slice(0, 2).map(({ label, value }) => `${label}: ${value}`).join(" · "),
        highlights,
        attributes: [
            { label: "Registro", value: planet.id },
            ...highlights,
            { label: "Periodo de rotación", value: formatRecordValue(planet.rotationPeriod, "horas") },
            { label: "Periodo orbital", value: formatRecordValue(planet.orbitalPeriod, "días") },
            { label: "Gravedad", value: formatRecordValue(planet.gravity) },
            { label: "Agua superficial", value: formatRecordValue(planet.surfaceWater, "%") },
            { label: "Residentes", value: String(planet.residents.length) },
            { label: "Películas", value: String(planet.films.length) },
        ],
        relations: [
            {
                title: "Residentes",
                links: planet.residents.map((resident) => ({
                    id: resident.id,
                    label: resident.name,
                    to: generatePath(ROUTES.characterDetail, { id: resident.id }),
                })),
            },
            {
                title: "Películas",
                links: planet.films.map((film) => ({
                    id: film.id,
                    label: film.title,
                    to: generatePath(ROUTES.filmDetail, { id: film.id }),
                })),
            },
        ],
    };
};

// Ficha de un planeta con todos sus datos
export const PlanetDetailPage = () => {
    const { id } = useParams();

    const planetQuery = useGetPlanet(id);
    const { getFavoriteButton, errorMessage: favoriteError } = useFavoriteButtons("PLANET", id ? [id] : []);
    const planet = planetQuery.data;

    return (
        <main className="relative z-10 mx-auto max-w-[1280px] px-4 pt-12 pb-24 sm:px-7">
            {planetQuery.isPending && <LoadingBar />}

            {planetQuery.isPending && (
                <ArchiveNote className="mt-12">Descodificando registro galáctico…</ArchiveNote>
            )}

            {planetQuery.isError && (
                <ErrorPanel
                    message={planetQuery.error.message}
                    onRetry={isRetryable(planetQuery.error) ? () => planetQuery.refetch() : undefined}
                    isRetrying={planetQuery.isFetching}
                />
            )}

            {favoriteError && <AlertNote>{favoriteError}</AlertNote>}

            {planet && <RecordDetail backPath={ROUTES.planets} {...toDetail(planet)} favorite={getFavoriteButton(planet.id)} />}
        </main>
    );
};
