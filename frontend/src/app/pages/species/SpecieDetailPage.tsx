import { generatePath, useParams } from "react-router-dom";

import { ArchiveNote, LoadingBar } from "@/ui/atoms";
import { ErrorPanel } from "@/ui/molecules";
import { RecordDetail } from "@/ui/organisms/RecordDetail";
import type { Specie } from "@/core/modules/specie";

import { useGetSpecie } from "../../hooks/useGetSpecie";
import { isRetryable } from "../../hooks/retryResource";
import { ROUTES } from "../../navigation/routes";

import { formatRecordValue } from "@/app/format/formatRecordValue";

const CATEGORY_LABEL = "Species";

// Paso la especie al formato de ficha que entiende la ui
const toDetail = (specie: Specie) => {
    const highlights = [
        { label: "Clasificación", value: formatRecordValue(specie.classification) },
        { label: "Designación", value: formatRecordValue(specie.designation) },
        { label: "Idioma", value: formatRecordValue(specie.language) },
        { label: "Esperanza de vida", value: formatRecordValue(specie.averageLifespan, "años") },
    ];

    return {
        badge: `#${specie.id.padStart(2, "0")} · ${CATEGORY_LABEL}`,
        breadcrumb: `SWAPI · Archivo central / ${CATEGORY_LABEL} / ${specie.name}`,
        title: specie.name,
        subtitle: highlights.slice(0, 2).map(({ label, value }) => `${label}: ${value}`).join(" · "),
        highlights,
        attributes: [
            { label: "Registro", value: specie.id },
            ...highlights,
            { label: "Altura media", value: formatRecordValue(specie.averageHeight, "cm") },
            { label: "Color de piel", value: formatRecordValue(specie.skinColors) },
            { label: "Color de pelo", value: formatRecordValue(specie.hairColors) },
            { label: "Color de ojos", value: formatRecordValue(specie.eyeColors) },
            { label: "Planeta natal", value: specie.homeWorld?.name ?? "—" },
            { label: "Personajes", value: String(specie.people.length) },
            { label: "Películas", value: String(specie.films.length) },
        ],
        relations: [
            {
                title: "Personajes",
                links: specie.people.map((person) => ({
                    id: person.id,
                    label: person.name,
                    to: generatePath(ROUTES.characterDetail, { id: person.id }),
                })),
            },
            {
                title: "Películas",
                links: specie.films.map((film) => ({
                    id: film.id,
                    label: film.title,
                    to: generatePath(ROUTES.filmDetail, { id: film.id }),
                })),
            },
        ],
    };
};

// Ficha de una especie con todos sus datos
export const SpecieDetailPage = () => {
    const { id } = useParams();

    const specieQuery = useGetSpecie(id);
    const specie = specieQuery.data;

    return (
        <main className="relative z-10 mx-auto max-w-[1280px] px-4 pt-12 pb-24 sm:px-7">
            {specieQuery.isPending && <LoadingBar />}

            {specieQuery.isPending && (
                <ArchiveNote className="mt-12">Descodificando registro galáctico…</ArchiveNote>
            )}

            {specieQuery.isError && (
                <ErrorPanel
                    message={specieQuery.error.message}
                    onRetry={isRetryable(specieQuery.error) ? () => specieQuery.refetch() : undefined}
                    isRetrying={specieQuery.isFetching}
                />
            )}

            {specie && <RecordDetail backPath={ROUTES.species} {...toDetail(specie)} />}
        </main>
    );
};
