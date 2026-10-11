import { useState } from "react";
import { generatePath } from "react-router-dom";

import { ArchiveNote, LoadingBar } from "@/ui/atoms";
import { ArchiveHeading, ErrorPanel, Toolbar, ViewToggle, type RecordView } from "@/ui/molecules";
import { RecordGrid, type RecordItem } from "@/ui/organisms/RecordGrid";
import type { Specie } from "@/core/modules/specie";

import { useListSpecies } from "@/app/hooks/useListSpecies";
import { isRetryable } from "@/app/hooks/retryResource";
import { ROUTES } from "@/app/navigation/routes";

import { formatStarshipValue } from "../starships/formatStarshipValue";

const CATEGORY_LABEL = "Species";

// Paso una especie al formato de tarjeta que entiende la ui
const toRecord = (specie: Specie): RecordItem => ({
    key: specie.id,
    title: specie.name,
    badge: `#${specie.id.padStart(2, "0")} · ${CATEGORY_LABEL}`,
    stats: [
        { label: "Clasificación", value: formatStarshipValue(specie.classification) },
        { label: "Designación", value: formatStarshipValue(specie.designation) },
        { label: "Idioma", value: formatStarshipValue(specie.language) },
        { label: "Altura media", value: formatStarshipValue(specie.averageHeight, "cm") },
    ],
    detailPath: generatePath(ROUTES.specieDetail, { id: specie.id }),
});

// Archivo de especies con la cabecera fija y el contenido segun el estado de la peticion
export const SpeciesListPage = () => {
    const { data, isPending, isError, error, refetch, isFetching } = useListSpecies();
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
