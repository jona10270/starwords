import { useParams } from "react-router-dom"

import { ArchiveNote, LoadingBar } from "@/ui/atoms";
import { ErrorPanel } from "@/ui/molecules";
import { RecordDetail } from "@/ui/organisms/RecordDetail";
import type { Character } from "@/core/modules/character";

import { useOneGetCharacter } from "../hooks/useOneCharacter";
import { isRetryable } from "../hooks/retryResource";
import { ROUTES } from "../navigation/routes";

const CATEGORY_LABEL = "People";

// Pongo la unidad solo si el dato existe
const withUnit = (value: string | null, unit: string) => (value ? `${value} ${unit}` : "—");

// Paso el personaje al formato de ficha que entiende la ui
const toDetail = (character: Character) => {
    const highlights = [
        { label: "Nacimiento", value: character.birthYear ?? "—" },
        { label: "Género", value: character.gender ?? "—" },
        { label: "Altura", value: withUnit(character.height, "cm") },
        { label: "Masa", value: withUnit(character.mass, "kg") },
    ];

    return {
        badge: `#${character.id.padStart(2, "0")} · ${CATEGORY_LABEL}`,
        breadcrumb: `SWAPI · Archivo central / ${CATEGORY_LABEL} / ${character.name}`,
        title: character.name,
        subtitle: highlights.slice(0, 2).map(({ label, value }) => `${label}: ${value}`).join(" · "),
        highlights,
        attributes: [
            { label: "Registro", value: character.id },
            ...highlights,
            { label: "Planeta natal", value: character.homeWorld },
        ],
    };
};

export const CharacterDetailPage = () => {
    const { id } = useParams();

    const characterQuery = useOneGetCharacter(id);
    const character = characterQuery.data
    return (
        <main className="relative z-10 mx-auto max-w-[1280px] px-4 pt-12 pb-24 sm:px-7">
            {characterQuery.isPending && <LoadingBar />}

            {characterQuery.isPending && (
                <ArchiveNote className="mt-12">Descodificando registro galáctico…</ArchiveNote>
            )}

            {characterQuery.isError && (
                <ErrorPanel
                    message={characterQuery.error.message}
                    onRetry={isRetryable(characterQuery.error) ? () => characterQuery.refetch() : undefined}
                    isRetrying={characterQuery.isFetching}
                />
            )}

            {character && <RecordDetail backPath={ROUTES.characters} {...toDetail(character)} />}
        </main>
    );
}
