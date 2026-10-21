import { Link } from "react-router-dom";

interface WordmarkProps {
    to: string;
    title: string;
}

// Logo de texto del centro de la cabecera que lleva al inicio
export const Wordmark = ({ to, title }: WordmarkProps) => (
    <Link
        to={to}
        className="flex shrink-0 flex-col items-center transition-[text-shadow] duration-200 hover:[text-shadow:0_0_18px_rgba(247,217,43,0.6)]"
    >
        <span className="text-[24px] leading-none font-bold tracking-[0.3em] text-accent uppercase sm:text-[28px]">{title}</span>
    </Link>
);
