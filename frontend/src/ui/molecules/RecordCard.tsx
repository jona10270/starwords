import { Link } from "react-router-dom";

export interface RecordStat {
    label: string;
    value: string;
}

export interface RecordCardProps {
    title: string;
    badge: string;
    stats: RecordStat[];
    // En la vista de lista reparto los datos en una sola fila
    wide?: boolean;
    detailPath?: string;
}

// Tarjeta de un registro del archivo con su nombre y sus datos
export const RecordCard = ({ title, badge, detailPath, stats, wide = false }: RecordCardProps) => (
    <article className="flex h-full flex-col gap-3.5 border border-line bg-surface p-[18px] transition-[border-color,box-shadow,background-color] duration-200 hover:border-accent hover:bg-[#0a0a0a] hover:shadow-[0_0_28px_rgba(247,217,43,0.16)]">
        <header className="flex items-start justify-between gap-3">
            <h2 className="min-w-0 text-[17px] leading-tight font-bold tracking-[0.1em] break-words text-accent uppercase">
                {title}
            </h2>
            <span className="shrink-0 border border-field px-2 py-1 font-terminal text-[9px] tracking-[0.2em] whitespace-nowrap text-dim uppercase">
                {badge}
            </span>
        </header>
        <dl className={`grid grid-cols-2 gap-x-[18px] gap-y-3 border-t border-divider pt-3 ${wide ? "sm:grid-cols-4" : ""}`}>
            {stats.map(({ label, value }) => (
                <div key={label} className="flex min-w-0 flex-col gap-1">
                    <dt className="font-terminal text-[9px] tracking-[0.22em] text-muted uppercase">{label}</dt>
                    <dd title={value} className="truncate font-terminal text-xs tracking-[0.06em] text-[#e8eaee]">
                        {value}
                    </dd>
                </div>
            ))}
        </dl>
        { detailPath && (
            <Link
                to={detailPath}
                className="mt-auto flex items-center gap-2 border-t border-divider pt-3 font-terminal text-[10px] 
                tracking-[0.24em] text-dim uppercase transition-[color,text-shadow] duration-200 hover:text-accent 
                hover:[text-shadow:0_0_12px_rgba(247,217,43,0.6)]"
            >
                Ver registro completo
            </Link>
        )}
    </article>
);
