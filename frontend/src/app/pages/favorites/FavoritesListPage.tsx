import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { generatePath, useSearchParams } from "react-router-dom";

import { AlertNote, ArchiveNote, LoadingBar } from "@/ui/atoms";
import { ArchiveHeading, ErrorPanel, Pagination, Toolbar, ViewToggle, type RecordView } from "@/ui/molecules";
import { RecordGrid, type RecordItem } from "@/ui/organisms/RecordGrid";
import type { FavoriteWithName } from "@/core/modules/favorite";

import { useListFavorites } from "@/app/hooks/useListFavorites";
import { useDeleteFavorite } from "@/app/hooks/useDeleteFavorite";
import { ROUTES } from "@/app/navigation/routes";
import { PAGE_PARAM, PAGE_SIZE, readPageParam } from "@/app/navigation/pagination";

const CATEGORY_LABEL = "Favoritos";

// Lo que necesito de cada tipo para pintar su tarjeta y enlazar a su ficha
const RESOURCE_INFO: Record<string, { label: string; detailRoute: string }> = {
    PEOPLE: { label: "Personaje", detailRoute: ROUTES.characterDetail },
    FILM: { label: "Película", detailRoute: ROUTES.filmDetail },
    STARSHIP: { label: "Nave", detailRoute: ROUTES.starshipDetail },
    VEHICLE: { label: "Vehículo", detailRoute: ROUTES.vehicleDetail },
    SPECIE: { label: "Especie", detailRoute: ROUTES.specieDetail },
    PLANET: { label: "Planeta", detailRoute: ROUTES.planetDetail },
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
    const toRecord = (favorite: FavoriteWithName): RecordItem => {
        const info = RESOURCE_INFO[favorite.favoriteType];
        const typeLabel = info?.label ?? favorite.favoriteType;

        return {
            key: favorite.id,
            // Si el backend no encuentra el nombre enseño solo el tipo
            title: favorite.name || `${typeLabel} sin nombre`,
            badge: typeLabel,
            stats: [{ label: "Guardado", value: formatSavedDate(favorite.createdAt) }],
            detailPath: info ? generatePath(info.detailRoute, { id: favorite.favoriteId }) : undefined,
            favorite: {
                isFavorite: !removingIds.has(favorite.id),
                onClick: () => void remove(favorite.id),
            },
        };
    };

    let counter = "";
    if (data) counter = data.total ? `${data.total} guardados · página ${page} de ${data.totalPages}` : "0 guardados";
    if (isPending) counter = "Cargando...";
    if (isError && !data) counter = "Sin señal";

    return (
        <main className="relative z-10 mx-auto max-w-[1280px] px-4 pt-12 pb-24 sm:px-7">
            {(isPending || isPlaceholderData) && <LoadingBar />}

            <ArchiveHeading title={CATEGORY_LABEL} counter={counter} />

            {isPending && <ArchiveNote className="mt-12">Cargando tus favoritos…</ArchiveNote>}

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
                                ? "Aún no tienes favoritos · pulsa el corazón de un personaje, película o planeta para guardarlo aquí"
                                : "No hay nada en esta página"}
                        </ArchiveNote>
                    )}
                    <Pagination page={page} totalPages={data.totalPages} onPageChange={goToPage} />
                </>
            )}
        </main>
    );
};
