import { useState } from "react";
import { generatePath } from "react-router-dom";

import { ArchiveNote, LoadingBar } from "@/ui/atoms";
import { ArchiveHeading, ErrorPanel, Toolbar, ViewToggle, type RecordView } from "@/ui/molecules";
import { RecordGrid, type RecordItem } from "@/ui/organisms/RecordGrid";
import type { Starship } from "@/core/modules/starship";

import { useListStarship } from "@/app/hooks/useListStarship";
import { isRetryable } from "@/app/hooks/retryResource";
import { ROUTES } from "@/app/navigation/routes";

import { formatStarshipValue } from "./formatStarshipValue";

const CATEGORY_LABEL = "Starships";

// Paso una nave al formato de tarjeta que entiende la ui
const toRecord = (starship: Starship): RecordItem => ({
    key: starship.id,
    title: starship.name,
    badge: `#${starship.id.padStart(2, "0")} · ${CATEGORY_LABEL}`,
    stats: [
        { label: "Clase", value: formatStarshipValue(starship.starshipClass) },
        { label: "Fabricante", value: formatStarshipValue(starship.manufacturer) },
        { label: "Tripulación", value: formatStarshipValue(starship.crew) },
        { label: "Longitud", value: formatStarshipValue(starship.length, "m") },
    ],
    detailPath: generatePath(ROUTES.starshipDetail, { id: starship.id }),
});

// Archivo de naves con la cabecera fija y el contenido segun el estado de la peticion
export const StarshipsListPage = () => {
    const { data, isPending, isError, error, refetch, isFetching } = useListStarship();
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
