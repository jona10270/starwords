import { useState } from "react";
import { generatePath } from "react-router-dom";

import { ArchiveNote, LoadingBar } from "@/ui/atoms";
import { ArchiveHeading, ErrorPanel, Toolbar, ViewToggle, type RecordView } from "@/ui/molecules";
import { RecordGrid, type RecordItem } from "@/ui/organisms/RecordGrid";
import type { Film } from "@/core/modules/film";

import { useListFilms } from "@/app/hooks/useListFilms";
import { isRetryable } from "@/app/hooks/retryResource";
import { ROUTES } from "@/app/navigation/routes";

const CATEGORY_LABEL = "Films";

// Paso una pelicula al formato de tarjeta que entiende la ui
const toRecord = (film: Film): RecordItem => ({
    key: film.id,
    title: film.title,
    badge: `EP ${String(film.episodeId).padStart(2, "0")} · ${CATEGORY_LABEL}`,
    stats: [
        { label: "Director", value: film.director || "—" },
        { label: "Productor", value: film.producer || "—" },
        { label: "Estreno", value: film.releaseDate || "—" },
        { label: "Personajes", value: String(film.characters.length) },
    ],
    detailPath: generatePath(ROUTES.filmDetail, { id: film.id }),
});

// Archivo de peliculas con la cabecera fija y el contenido segun el estado de la peticion
export const FilmsListPage = () => {
    const { data, isPending, isError, error, refetch, isFetching } = useListFilms();
    const [view, setView] = useState<RecordView>("grid");

    let counter = `${data?.length ?? 0} registros descodificados`;
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
                    <RecordGrid records={data.map(toRecord)} view={view} />
                    <ArchiveNote className="mt-8">
                        Fin del volcado · {data.length} registros cargados
                    </ArchiveNote>
                </>
            )}
        </main>
    );
};
