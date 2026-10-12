// Nombre del parametro de la url donde viaja la pagina del listado
export const PAGE_PARAM = "page";

// Cuantos registros pido por pagina y con 12 la rejilla de 3 columnas queda completa
export const PAGE_SIZE = 12;

// Leo la pagina de la url y si no es un numero valido vuelvo a la primera
export const readPageParam = (value: string | null): number => {
    const page = Number(value);
    return Number.isInteger(page) && page > 0 ? page : 1;
};
