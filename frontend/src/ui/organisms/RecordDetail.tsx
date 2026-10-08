import { Link } from "react-router-dom";

import type { RecordStat } from "../molecules";

interface RecordDetailProps {
    // Recibo la ruta de vuelta de fuera para que la ui no dependa del router de la app
    backPath: string;
    badge: string;
    breadcrumb: string;
    title: string;
    subtitle: string;
    highlights: RecordStat[];
    attributes: RecordStat[];
}

// Ficha completa de un registro con sus datos destacados y todos sus atributos
export const RecordDetail = ({ backPath, badge, breadcrumb, title, subtitle, highlights, attributes }: RecordDetailProps) => (
    <article className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
            <Link
                to={backPath}
                className="flex items-center gap-2.5 font-terminal text-[11px] tracking-[0.24em] text-dim uppercase transition-[color,text-shadow] duration-200 hover:text-accent hover:[text-shadow:0_0_12px_rgba(247,217,43,0.7)]"
            >
                ◄ Volver al archivo central
            </Link>
            <span className="border border-field px-2.5 py-1.5 font-terminal text-[9px] tracking-[0.2em] whitespace-nowrap text-accent uppercase">
                {badge}
            </span>
        </div>

        <p className="font-terminal text-[10px] tracking-[0.26em] break-words text-muted uppercase">{breadcrumb}</p>

        <header className="border border-line bg-[linear-gradient(#080808,#030303)] p-5 sm:p-[30px]">
            <h1 className="text-[30px] leading-[1.05] font-bold tracking-[0.1em] break-words text-accent uppercase [text-shadow:0_0_26px_rgba(247,217,43,0.25)] sm:text-[42px]">
                {title}
            </h1>
            <p className="mt-3.5 font-terminal text-xs tracking-[0.2em] text-steel uppercase">{subtitle}</p>
            <dl className="mt-[26px] grid grid-cols-[repeat(auto-fit,minmax(min(170px,100%),1fr))] gap-3">
                {highlights.map(({ label, value }) => (
                    <div
                        key={label}
                        className="flex min-w-0 flex-col gap-[7px] border border-line bg-surface p-4 transition-[border-color,box-shadow] duration-200 hover:border-accent hover:shadow-[0_0_22px_rgba(247,217,43,0.14)]"
                    >
                        <dt className="font-terminal text-[9px] tracking-[0.24em] text-muted uppercase">{label}</dt>
                        <dd title={value} className="truncate font-terminal text-[19px] tracking-[0.04em] text-white">
                            {value}
                        </dd>
                    </div>
                ))}
            </dl>
        </header>

        <section className="border border-line bg-surface p-[22px]">
            <h2 className="mb-[18px] border-b border-[#161616] pb-3 font-terminal text-[10px] font-medium tracking-[0.3em] text-accent uppercase">
                Atributos técnicos completos
            </h2>
            <dl className="grid grid-cols-[repeat(auto-fit,minmax(min(150px,100%),1fr))] gap-x-5 gap-y-4">
                {attributes.map(({ label, value }) => (
                    <div key={label} className="flex min-w-0 flex-col gap-[5px]">
                        <dt className="font-terminal text-[9px] tracking-[0.22em] text-muted uppercase">{label}</dt>
                        <dd className="font-terminal text-[13px] tracking-[0.04em] break-words text-[#e8eaee]">{value}</dd>
                    </div>
                ))}
            </dl>
        </section>
    </article>
);
