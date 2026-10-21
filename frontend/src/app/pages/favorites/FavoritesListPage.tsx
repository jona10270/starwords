import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { generatePath, useSearchParams } from "react-router-dom";

import { AlertNote, ArchiveNote, LoadingBar } from "@/ui/atoms";
import { ArchiveHeading, ErrorPanel, Pagination, Toolbar, ViewToggle, type RecordView } from "@/ui/molecules";
import { RecordGrid, type RecordItem } from "@/ui/organisms/RecordGrid";
import type { Favorite } from "@/core/modules/favorite";

import { useListFavorites } from "@/app/hooks/useListFavorites";
import { useDeleteFavorite } from "@/app/hooks/useDeleteFavorite";
import { ROUTES } from "@/app/navigation/routes";
import { PAGE_PARAM, PAGE_SIZE, readPageParam } from "@/app/navigation/pagination";

const CATEGORY_LABEL = "Favoritos";

// Lo que necesito de cada tipo para pintar su tarjeta y enlazar a su ficha
const RESOURCE_INFO: Record<string, { label: string; category: string; detailRoute: string }> = {
    PEOPLE: { label: "Personaje", category: "People", detailRoute: ROUTES.characterDetail },
    FILM: { label: "Película", category: "Films", detailRoute: ROUTES.filmDetail },
    STARSHIP: { label: "Nave", category: "Starships", detailRoute: ROUTES.starshipDetail },
    VEHICLE: { label: "Vehículo", category: "Vehicles", detailRoute: ROUTES.vehicleDetail },
    SPECIE: { label: "Especie", category: "Species", detailRoute: ROUTES.specieDetail },
    PLANET: { label: "Planeta", category: "Planets", detailRoute: ROUTES.planetDetail },
};

// Paso la fecha del backend a 21 oct 2026
const formatSavedDate = (date: string) => {
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return "—";
    return parsed.toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });
};

// Archivo de mis favoritos paginado y con el corazon para quitarlos
export const FavoritesListPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const page = readPageParam(searchParams.get(PAGE_PARAM));
    const queryClient = useQueryClient();
    const deleteFavorite = useDeleteFavorite();
    const [view, setView] = useState<RecordView>("grid");
    const [removingIds, setRemovingIds] = useState<ReadonlySet<string>>(new Set());

    const { data, isPending, isPlaceholderData, isError, error, refetch, isFetching } = useListFavorites({
        page,
        limit: PAGE_SIZE,
    });

    // Guardo la pagina en la url y subo arriba para empezar a leer la nueva
    const goToPage = (nextPage: number) => {
        setSearchParams((params) => {
            params.set(PAGE_PARAM, String(nextPage));
            return params;
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const setRemoving = (uuid: string, isRemoving: boolean) =>
        setRemovingIds((current) => {
            const next = new Set(current);
            if (isRemoving) next.add(uuid);
            else next.delete(uuid);
            return next;
        });

    // Lo quito por su uuid y vuelvo a pedir la lista y los corazones del resto de paginas
    const remove = async (uuid: string) => {
        if (removingIds.has(uuid)) return;
        setRemoving(uuid, true);
        try {
            await deleteFavorite.mutateAsync({ favoriteId: uuid });
            await queryClient.invalidateQueries({ queryKey: ["favorites"] });
        } catch {
            // Si falla dejo la tarjeta como estaba y el aviso sale arriba
        } finally {
            setRemoving(uuid, false);
        }
    };

    // Paso un favorito al formato de tarjeta que entiende la ui
    const toRecord = (favorite: Favorite): RecordItem => {
        const info = RESOURCE_INFO[favorite.favoriteType];
        const number = favorite.favoriteId.padStart(2, "0");

        return {
            key: favorite.id,
            title: `${info?.label ?? favorite.favoriteType} #${number}`,
            badge: `#${number} · ${info?.category ?? favorite.favoriteType}`,
            stats: [
                { label: "Tipo", value: info?.label ?? favorite.favoriteType },
                { label: "Registro", value: `#${number}` },
                { label: "Guardado", value: formatSavedDate(favorite.createdAt) },
            ],
            detailPath: info ? generatePath(info.detailRoute, { id: favorite.favoriteId }) : undefined,
            favorite: {
                isFavorite: !removingIds.has(favorite.id),
                onClick: () => void remove(favorite.id),
            },
        };
    };

    let counter = "";
    if (data) counter = data.total ? `${data.total} registros · página ${page} de ${data.totalPages}` : "0 registros";
    if (isPending) counter = "Descodificando...";
    if (isError && !data) counter = "Sin señal";

    return (
        <main className="relative z-10 mx-auto max-w-[1280px] px-4 pt-12 pb-24 sm:px-7">
            {(isPending || isPlaceholderData) && <LoadingBar />}

            <ArchiveHeading eyebrow="SWAPI · Archivo personal" title={CATEGORY_LABEL} counter={counter} />

            {isPending && <ArchiveNote className="mt-12">Descodificando tus registros guardados…</ArchiveNote>}

            {isError && (
                <ErrorPanel message={error.message} onRetry={() => refetch()} isRetrying={isFetching} />
            )}

            {data && (
                <>
                    <Toolbar>
                        <ViewToggle value={view} onChange={setView} />
                    </Toolbar>
                    {deleteFavorite.error && <AlertNote className="mt-4">{deleteFavorite.error.message}</AlertNote>}
                    <RecordGrid records={data.items.map(toRecord)} view={view} />
                    {data.items.length === 0 && (
                        <ArchiveNote className="mt-12">
                            {data.total === 0
                                ? "Aún no tienes favoritos · pulsa el corazón de cualquier registro para guardarlo aquí"
                                : "No hay registros en esta página"}
                        </ArchiveNote>
                    )}
                    <Pagination page={page} totalPages={data.totalPages} onPageChange={goToPage} />
                </>
            )}
        </main>
    );
};
