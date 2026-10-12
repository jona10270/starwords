import { useState } from "react";
import { generatePath, useSearchParams } from "react-router-dom";
import { ROUTES } from "../navigation/routes";
import { PAGE_PARAM, PAGE_SIZE, readPageParam } from "../navigation/pagination";

import { ArchiveNote, LoadingBar } from "@/ui/atoms";
import { ArchiveHeading, ErrorPanel, Pagination, Toolbar, ViewToggle, type RecordView } from "@/ui/molecules";
import { RecordGrid, type RecordItem } from "@/ui/organisms/RecordGrid";
import type { Character } from "@/core/modules/character";

import { useGetCharacter } from "../hooks/useCharacters";
import { isRetryable } from "../hooks/retryResource";

const CATEGORY_LABEL = "People";

// Pongo la unidad solo si el dato existe
const withUnit = (value: string | null, unit: string) => (value ? `${value} ${unit}` : "—");

// Paso un personaje al formato de tarjeta que entiende la ui
const toRecord = (character: Character): RecordItem => ({
    key: character.id,
    title: character.name,
    badge: `#${character.id.padStart(2, "0")} · ${CATEGORY_LABEL}`,
    stats: [
        { label: "Nacimiento", value: character.birthYear ?? "—" },
        { label: "Género", value: character.gender ?? "—" },
        { label: "Altura", value: withUnit(character.height, "cm") },
        { label: "Masa", value: withUnit(character.mass, "kg") },
    ],
    detailPath: generatePath(ROUTES.characterDetail, { id: character.id }),
});

// Archivo de personajes con la cabecera fija y el contenido segun el estado de la peticion
export const CharacterPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const page = readPageParam(searchParams.get(PAGE_PARAM));

    const { data, isPending, isError, error, refetch, isFetching } = useGetCharacter({ page, limit: PAGE_SIZE });
    const [view, setView] = useState<RecordView>("grid");

    // Guardo la pagina en la url y subo arriba para empezar a leer la nueva
    const goToPage = (nextPage: number) => {
        setSearchParams((params) => {
            params.set(PAGE_PARAM, String(nextPage));
            return params;
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    let counter = data ? `${data.total} registros · página ${page} de ${data.totalPages}` : "";
    if (isPending) counter = "Descodificando...";
    if (isError && !data) counter = "Sin señal";

    return (
        <main className="relative z-10 mx-auto max-w-[1280px] px-4 pt-12 pb-24 sm:px-7">
            {isPending && <LoadingBar />}

            <ArchiveHeading eyebrow="SWAPI · Archivo central" title={CATEGORY_LABEL} counter={counter} />

            {isPending && <ArchiveNote className="mt-12">Descodificando base de datos galáctica…</ArchiveNote>}

            {isError && (
                <ErrorPanel
                    message={error.message}
                    onRetry={isRetryable(error) ? () => refetch() : undefined}
                    isRetrying={isFetching}
                />
            )}

            {data && (
                <>
                    <Toolbar>
                        <ViewToggle value={view} onChange={setView} />
                    </Toolbar>
                    <RecordGrid records={data.items.map(toRecord)} view={view} />
                    {data.items.length === 0 && (
                        <ArchiveNote className="mt-12">No hay registros en esta página</ArchiveNote>
                    )}
                    <Pagination page={page} totalPages={data.totalPages} onPageChange={goToPage} />
                </>
            )}
        </main>
    );
};
