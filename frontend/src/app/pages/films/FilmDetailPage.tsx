import { useParams } from "react-router-dom";

import { ArchiveNote, LoadingBar } from "@/ui/atoms";
import { ErrorPanel, OpeningCrawl } from "@/ui/molecules";
import { RecordDetail } from "@/ui/organisms/RecordDetail";
import type { Film } from "@/core/modules/film";

import { useGetFilm } from "../../hooks/useGetFilm";
import { isRetryable } from "../../hooks/retryResource";
import { ROUTES } from "../../navigation/routes";

const CATEGORY_LABEL = "Films";

const ROMAN_EPISODES = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX"];

// Paso el numero de episodio a romano como en las peliculas
const toRomanEpisode = (episode: number) => ROMAN_EPISODES[episode - 1] ?? String(episode);

// Paso la fecha 1977-05-25 a 25 de mayo de 1977
const formatReleaseDate = (date: string) => {
    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return date || "—";
    return parsed.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
};

// Paso la pelicula al formato de ficha que entiende la ui
const toDetail = (film: Film) => {
    const highlights = [
        { label: "Episodio", value: toRomanEpisode(film.episodeId) },
        { label: "Estreno", value: formatReleaseDate(film.releaseDate) },
        { label: "Director", value: film.director || "—" },
        { label: "Productor", value: film.producer || "—" },
    ];

    return {
        badge: `EP ${String(film.episodeId).padStart(2, "0")} · ${CATEGORY_LABEL}`,
        breadcrumb: `SWAPI · Archivo central / ${CATEGORY_LABEL} / ${film.title}`,
        title: film.title,
        subtitle: highlights.slice(0, 2).map(({ label, value }) => `${label}: ${value}`).join(" · "),
        highlights,
        attributes: [
            { label: "Registro", value: film.id },
            ...highlights,
            { label: "Personajes", value: String(film.characters.length) },
            { label: "Planetas", value: String(film.planets.length) },
            { label: "Naves", value: String(film.starships.length) },
            { label: "Especies", value: String(film.species.length) },
            { label: "Vehículos", value: String(film.vehicles.length) },
        ],
    };
};

// Ficha de una pelicula con su texto de apertura y todos sus datos
export const FilmDetailPage = () => {
    const { id } = useParams();

    const filmQuery = useGetFilm(id);
    const film = filmQuery.data;

    return (
        <main className="relative z-10 mx-auto max-w-[1280px] px-4 pt-12 pb-24 sm:px-7">
            {filmQuery.isPending && <LoadingBar />}

            {filmQuery.isPending && (
                <ArchiveNote className="mt-12">Descodificando registro galáctico…</ArchiveNote>
            )}

            {filmQuery.isError && (
                <ErrorPanel
                    message={filmQuery.error.message}
                    onRetry={isRetryable(filmQuery.error) ? () => filmQuery.refetch() : undefined}
                    isRetrying={filmQuery.isFetching}
                />
            )}

            {film && (
                <RecordDetail backPath={ROUTES.films} {...toDetail(film)}>
                    {film.openingCrawl && <OpeningCrawl text={film.openingCrawl} />}
                </RecordDetail>
            )}
        </main>
    );
};
