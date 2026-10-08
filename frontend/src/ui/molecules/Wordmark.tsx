import { Link } from "react-router-dom";

interface WordmarkProps {
    to: string;
    title: string;
    tagline: string;
}

// Logo de texto del centro de la cabecera que lleva al inicio del archivo
export const Wordmark = ({ to, title, tagline }: WordmarkProps) => (
    <Link
        to={to}
        className="flex shrink-0 flex-col items-center gap-[3px] transition-[text-shadow] duration-200 hover:[text-shadow:0_0_18px_rgba(247,217,43,0.6)]"
    >
        <span className="text-[30px] leading-none font-bold tracking-[0.34em] text-accent uppercase">{title}</span>
        <span className="font-terminal text-[9px] tracking-[0.38em] text-[#6f747c] uppercase">{tagline}</span>
    </Link>
);
