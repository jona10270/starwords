interface PaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

type PageItem = number | "gap";

// Paginas que enseño alrededor de la actual antes de cortar con puntos
const SIBLINGS = 1;

const BUTTON_BASE =
    "min-w-9 cursor-pointer border px-3 py-[7px] font-terminal text-[10px] tracking-[0.22em] uppercase transition-colors duration-200";
const BUTTON_IDLE = "border-field text-dim hover:border-steel hover:text-white";
const BUTTON_ACTIVE = "border-accent bg-accent-soft text-accent";
const BUTTON_DISABLED = "disabled:cursor-not-allowed disabled:border-line disabled:text-faint disabled:hover:text-faint";

// Saco la primera, la ultima y las vecinas de la actual y relleno los huecos con puntos
const getPageItems = (page: number, totalPages: number): PageItem[] => {
    const pages = new Set([1, totalPages]);
    for (let current = page - SIBLINGS; current <= page + SIBLINGS; current++) {
        if (current > 1 && current < totalPages) pages.add(current);
    }

    const sorted = [...pages].sort((a, b) => a - b);

    return sorted.flatMap((current, index): PageItem[] => {
        const previous = sorted[index - 1];
        if (previous === undefined || current - previous === 1) return [current];
        if (current - previous === 2) return [current - 1, current];
        return ["gap", current];
    });
};

// Botones para moverme entre las paginas del listado
export const Pagination = ({ page, totalPages, onPageChange }: PaginationProps) => {
    // Con una sola pagina no hace falta salvo que me haya pasado y tenga que volver
    if (totalPages <= 1 && page <= 1) return null;

    const isFirst = page <= 1;
    const isLast = page >= totalPages;

    return (
        <nav aria-label="Paginación" className="mt-10 flex flex-col items-center gap-4">
            <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                    type="button"
                    disabled={isFirst}
                    // Si me paso de la ultima me lleva a la ultima que existe
                    onClick={() => onPageChange(Math.min(page - 1, totalPages))}
                    className={`${BUTTON_BASE} ${BUTTON_IDLE} ${BUTTON_DISABLED}`}
                >
                    ◂ Anterior
                </button>

                {getPageItems(page, totalPages).map((item, index) => {
                    if (item === "gap") {
                        return (
                            <span key={`gap-${index}`} aria-hidden="true" className="px-1 font-terminal text-[10px] text-faint">
                                …
                            </span>
                        );
                    }

                    const isActive = item === page;

                    return (
                        <button
                            key={item}
                            type="button"
                            aria-label={`Página ${item}`}
                            aria-current={isActive ? "page" : undefined}
                            onClick={() => onPageChange(item)}
                            className={`${BUTTON_BASE} ${isActive ? BUTTON_ACTIVE : BUTTON_IDLE}`}
                        >
                            {String(item).padStart(2, "0")}
                        </button>
                    );
                })}

                <button
                    type="button"
                    disabled={isLast}
                    onClick={() => onPageChange(page + 1)}
                    className={`${BUTTON_BASE} ${BUTTON_IDLE} ${BUTTON_DISABLED}`}
                >
                    Siguiente ▸
                </button>
            </div>

            <p className="font-terminal text-[10px] tracking-[0.3em] text-faint uppercase">
                Página {page} de {totalPages}
            </p>
        </nav>
    );
};
