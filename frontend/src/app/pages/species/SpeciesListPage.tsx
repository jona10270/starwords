import { useState } from "react";
import { generatePath, useSearchParams } from "react-router-dom";

import { AlertNote, ArchiveNote, LoadingBar } from "@/ui/atoms";
import { ArchiveHeading, ErrorPanel, Pagination, SearchField, Toolbar, ViewToggle, type RecordView } from "@/ui/molecules";
import { RecordGrid, type RecordItem } from "@/ui/organisms/RecordGrid";
import type { Specie } from "@/core/modules/specie";

import { useListSpecies } from "@/app/hooks/useListSpecies";
import { useFavoriteButtons } from "@/app/hooks/useFavoriteButtons";
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
    const { getFavoriteButton, errorMessage: favoriteError } = useFavoriteButtons(
        "SPECIE",
        data?.items.map((specie) => specie.id) ?? [],
    );

    // Guardo la pagina en la url y subo arriba para empezar a leer la nueva
    const goToPage = (nextPage: number) => {
        setSearchParams((params) => {
            params.set(PAGE_PARAM, String(nextPage));
            return params;
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    let counter = "";
    if (data) counter = data.total ? `${data.total} resultados · página ${page} de ${data.totalPages}` : "0 resultados";
    if (isPending) counter = "Cargando...";
    if (isError && !data) counter = "Sin señal";

    return (
        <main className="relative z-10 mx-auto max-w-[1280px] px-4 pt-12 pb-24 sm:px-7">
            {(isPending || isPlaceholderData) && <LoadingBar />}

            <ArchiveHeading title={CATEGORY_LABEL} counter={counter} />

            {isPending && <ArchiveNote className="mt-12">Cargando…</ArchiveNote>}

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
                    {favoriteError && <AlertNote className="mt-4">{favoriteError}</AlertNote>}
                    <RecordGrid
                        records={data.items.map((specie) => ({ ...toRecord(specie), favorite: getFavoriteButton(specie.id) }))}
                        view={view}
                    />
                    {data.items.length === 0 && (
                        <ArchiveNote className="mt-12">
                            {search ? `Nada coincide con «${search}»` : "No hay nada en esta página"}
                        </ArchiveNote>
                    )}
                    <Pagination page={page} totalPages={data.totalPages} onPageChange={goToPage} />
                </>
            )}
        </main>
    );
};
