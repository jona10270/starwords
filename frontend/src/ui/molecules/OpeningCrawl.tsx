interface OpeningCrawlProps {
    text: string;
}

// Texto de apertura de la pelicula en amarillo y respetando sus saltos de linea
export const OpeningCrawl = ({ text }: OpeningCrawlProps) => (
    <section className="relative overflow-hidden border border-line bg-surface p-[22px] sm:px-10 sm:py-9">
        <h2 className="mb-6 border-b border-[#161616] pb-3 font-terminal text-[10px] font-medium tracking-[0.3em] text-accent uppercase">
            Texto de apertura
        </h2>
        <p className="mx-auto max-w-[46ch] text-center text-[15px] leading-[1.75] tracking-[0.06em] whitespace-pre-line text-accent/90 [text-shadow:0_0_18px_rgba(247,217,43,0.18)] sm:text-[17px]">
            {text}
        </p>
        <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-surface to-transparent" />
    </section>
);
