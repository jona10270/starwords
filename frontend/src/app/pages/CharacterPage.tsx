import { useState } from "react";
import { generatePath, useSearchParams } from "react-router-dom";
import { ROUTES } from "../navigation/routes";
import { PAGE_PARAM, PAGE_SIZE, readPageParam } from "../navigation/pagination";
import { SEARCH_MAX_LENGTH } from "../navigation/search";

import { AlertNote, ArchiveNote, LoadingBar } from "@/ui/atoms";
import { ArchiveHeading, ErrorPanel, Pagination, SearchField, Toolbar, ViewToggle, type RecordView } from "@/ui/molecules";
import { RecordGrid, type RecordItem } from "@/ui/organisms/RecordGrid";
import type { Character } from "@/core/modules/character";

import { useGetCharacter } from "../hooks/useCharacters";
import { useFavoriteButtons } from "../hooks/useFavoriteButtons";
import { isRetryable } from "../hooks/retryResource";
import { useUrlSearch } from "../hooks/useUrlSearch";

const CATEGORY_LABEL = "People";

// Pongo la unidad solo si el dato existe
const withUnit = (value: string | null, unit: string) => (value ? `${value} ${unit}` : "—");

// Paso un personaje al formato de tarjeta que entiende la ui
const toRecord = (character: Character): RecordItem => ({
    key: character.id,
    title: character.name,
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
    const { searchText, search, changeSearch } = useUrlSearch();

    const { data, isPending, isPlaceholderData, isError, error, refetch, isFetching } = useGetCharacter({
        page,
        limit: PAGE_SIZE,
        search: search || undefined,
    });
    const [view, setView] = useState<RecordView>("grid");
    const { getFavoriteButton, errorMessage: favoriteError } = useFavoriteButtons(
        "PEOPLE",
        data?.items.map((character) => character.id) ?? [],
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
                            label="Buscar personajes por nombre"
                            placeholder="Buscar por nombre"
                            maxLength={SEARCH_MAX_LENGTH}
                        />
                        <ViewToggle value={view} onChange={setView} />
                    </Toolbar>
                    {favoriteError && <AlertNote className="mt-4">{favoriteError}</AlertNote>}
                    <RecordGrid
                        records={data.items.map((character) => ({ ...toRecord(character), favorite: getFavoriteButton(character.id) }))}
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
