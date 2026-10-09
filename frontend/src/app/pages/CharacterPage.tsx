import { useState } from "react";
import { generatePath } from "react-router-dom";
import { ROUTES } from "../navigation/routes";

import { ArchiveNote, LoadingBar } from "@/ui/atoms";
import { ArchiveHeading, ErrorPanel, Toolbar, ViewToggle, type RecordView } from "@/ui/molecules";
import { RecordGrid, type RecordItem } from "@/ui/organisms/RecordGrid";
import type { Character } from "@/core/modules/character";

import { useGetCharacter } from "../hooks/useCharacters";
import { isRetryable } from "../hooks/retryResource";

const CATEGORY_LABEL = "People";

// Pongo la unidad solo si el dato existe
const withUnit = (value: string | null, unit: string) => (value ? `${value} ${unit}` : "—");

// Paso un personaje al formato de tarjeta que entiende la ui
const toRecord = (character: Character, index: number): RecordItem => ({
    key: character.name,
    title: character.name,
    badge: `#${String(index + 1).padStart(2, "0")} · ${CATEGORY_LABEL}`,
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
    const { data, isPending, isError, error, refetch, isFetching } = useGetCharacter();
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
