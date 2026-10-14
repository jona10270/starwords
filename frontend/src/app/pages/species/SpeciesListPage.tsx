import { useState } from "react";
import { generatePath, useSearchParams } from "react-router-dom";

import { ArchiveNote, LoadingBar } from "@/ui/atoms";
import { ArchiveHeading, ErrorPanel, Pagination, SearchField, Toolbar, ViewToggle, type RecordView } from "@/ui/molecules";
import { RecordGrid, type RecordItem } from "@/ui/organisms/RecordGrid";
import type { Specie } from "@/core/modules/specie";

import { useListSpecies } from "@/app/hooks/useListSpecies";
import { isRetryable } from "@/app/hooks/retryResource";
import { useUrlSearch } from "@/app/hooks/useUrlSearch";
import { ROUTES } from "@/app/navigation/routes";
import { PAGE_PARAM, PAGE_SIZE, readPageParam } from "@/app/navigation/pagination";
import { SEARCH_MAX_LENGTH } from "@/app/navigation/search";

import { formatRecordValue } from "@/app/format/formatRecordValue";

const CATEGORY_LABEL = "Species";

// Paso una especie al formato de tarjeta que entiende la ui
const toRecord = (specie: Specie): RecordItem => ({
    key: specie.id,
    title: specie.name,
    badge: `#${specie.id.padStart(2, "0")} · ${CATEGORY_LABEL}`,
    stats: [
        { label: "Clasificación", value: formatRecordValue(specie.classification) },
        { label: "Designación", value: formatRecordValue(specie.designation) },
        { label: "Idioma", value: formatRecordValue(specie.language) },
        { label: "Altura media", value: formatRecordValue(specie.averageHeight, "cm") },
    ],
    detailPath: generatePath(ROUTES.specieDetail, { id: specie.id }),
});

// Archivo de especies con la cabecera fija y el contenido segun el estado de la peticion
export const SpeciesListPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const page = readPageParam(searchParams.get(PAGE_PARAM));
    const { searchText, search, changeSearch } = useUrlSearch();

    const { data, isPending, isPlaceholderData, isError, error, refetch, isFetching } = useListSpecies({
        page,
        limit: PAGE_SIZE,
        search: search || undefined,
    });
    const [view, setView] = useState<RecordView>("grid");

    // Guardo la pagina en la url y subo arriba para empezar a leer la nueva
    const goToPage = (nextPage: number) => {
        setSearchParams((params) => {
            params.set(PAGE_PARAM, String(nextPage));
            return params;
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    let counter = "";
    if (data) counter = data.total ? `${data.total} registros · página ${page} de ${data.totalPages}` : "0 registros";
    if (isPending) counter = "Descodificando...";
    if (isError && !data) counter = "Sin señal";

    return (
        <main className="relative z-10 mx-auto max-w-[1280px] px-4 pt-12 pb-24 sm:px-7">
            {(isPending || isPlaceholderData) && <LoadingBar />}

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
                        <SearchField
                            value={searchText}
                            onChange={changeSearch}
                            label="Buscar especies por nombre"
                            placeholder="Buscar por nombre"
                            maxLength={SEARCH_MAX_LENGTH}
                        />
                        <ViewToggle value={view} onChange={setView} />
                    </Toolbar>
                    <RecordGrid records={data.items.map(toRecord)} view={view} />
                    {data.items.length === 0 && (
                        <ArchiveNote className="mt-12">
                            {search ? `Ningún registro coincide con «${search}»` : "No hay registros en esta página"}
                        </ArchiveNote>
                    )}
                    <Pagination page={page} totalPages={data.totalPages} onPageChange={goToPage} />
                </>
            )}
        </main>
    );
};
