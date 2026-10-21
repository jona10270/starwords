interface ArchiveHeadingProps {
    title: string;
    counter: string;
}

// Titulo de la seccion con el contador de resultados a la derecha
export const ArchiveHeading = ({ title, counter }: ArchiveHeadingProps) => (
    <div className="flex flex-wrap items-end justify-between gap-5 border-b border-line pb-5">
        <h1 className="text-[32px] leading-none font-bold tracking-[0.14em] text-white uppercase sm:text-[40px]">
            {title}
        </h1>
        <p
            aria-live="polite"
            className="font-terminal text-xs tracking-[0.24em] text-accent uppercase [text-shadow:0_0_14px_rgba(247,217,43,0.35)]"
        >
            {counter}
        </p>
    </div>
);
