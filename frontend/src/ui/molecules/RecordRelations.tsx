import { Link } from "react-router-dom";

export interface RecordLink {
    id: string;
    label: string;
    to: string;
}

export interface RecordRelationGroup {
    title: string;
    links: RecordLink[];
}

interface RecordRelationsProps {
    groups: RecordRelationGroup[];
}

// Bloque de registros vinculados con un enlace al detalle de cada uno
export const RecordRelations = ({ groups }: RecordRelationsProps) => {
    const total = groups.reduce((sum, group) => sum + group.links.length, 0);

    return (
        <section className="border border-line bg-surface p-[22px] sm:p-6">
            <h2 className="mb-1.5 text-[15px] font-bold tracking-[0.18em] text-white uppercase">
                Archivos vinculados en la base de datos
            </h2>
            <p className="mb-5 font-terminal text-[10px] tracking-[0.22em] text-muted uppercase">
                {total > 0
                    ? `${total} ${total === 1 ? "referencia cruzada" : "referencias cruzadas"} en ${groups.length} ${groups.length === 1 ? "bloque" : "bloques"}`
                    : "No hay información relacionada"}
            </p>

            <div className="flex flex-col gap-[22px]">
                {groups.map(({ title, links }) => (
                    <div key={title} className="flex flex-col gap-3">
                        <h3 className="font-terminal text-[10px] tracking-[0.28em] text-accent uppercase">
                            {title} · {links.length}
                        </h3>

                        {links.length > 0 ? (
                            <ul className="flex flex-wrap gap-2">
                                {links.map(({ id, label, to }) => (
                                    <li key={id}>
                                        <Link
                                            to={to}
                                            className="block border border-field bg-[#0b0b0b] px-[13px] py-2 font-terminal text-[11px] tracking-[0.12em] text-[#cfd3d8] transition-[border-color,color,box-shadow] duration-200 hover:border-accent hover:text-accent hover:shadow-[0_0_18px_rgba(247,217,43,0.2)] focus-visible:border-accent focus-visible:text-accent focus-visible:outline-none"
                                        >
                                            {label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="font-terminal text-[11px] tracking-[0.12em] text-faint">No hay información disponible</p>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
};
