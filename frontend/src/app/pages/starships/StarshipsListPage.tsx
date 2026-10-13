import { useState } from "react";
import { generatePath, useSearchParams } from "react-router-dom";

import { ArchiveNote, LoadingBar } from "@/ui/atoms";
import { ArchiveHeading, ErrorPanel, Pagination, Toolbar, ViewToggle, type RecordView } from "@/ui/molecules";
import { RecordGrid, type RecordItem } from "@/ui/organisms/RecordGrid";
import type { Starship } from "@/core/modules/starship";

import { useListStarship } from "@/app/hooks/useListStarship";
import { isRetryable } from "@/app/hooks/retryResource";
import { ROUTES } from "@/app/navigation/routes";
import { PAGE_PARAM, PAGE_SIZE, readPageParam } from "@/app/navigation/pagination";

import { formatRecordValue } from "@/app/format/formatRecordValue";

const CATEGORY_LABEL = "Starships";

// Paso una nave al formato de tarjeta que entiende la ui
const toRecord = (starship: Starship): RecordItem => ({
    key: starship.id,
    title: starship.name,
    badge: `#${starship.id.padStart(2, "0")} · ${CATEGORY_LABEL}`,
    stats: [
        { label: "Clase", value: formatRecordValue(starship.starshipClass) },
        { label: "Fabricante", value: formatRecordValue(starship.manufacturer) },
        { label: "Tripulación", value: formatRecordValue(starship.crew) },
        { label: "Longitud", value: formatRecordValue(starship.length, "m") },
    ],
    detailPath: generatePath(ROUTES.starshipDetail, { id: starship.id }),
});

// Archivo de naves con la cabecera fija y el contenido segun el estado de la peticion
export const StarshipsListPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const page = readPageParam(searchParams.get(PAGE_PARAM));

    const { data, isPending, isError, error, refetch, isFetching } = useListStarship({ page, limit: PAGE_SIZE });
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
