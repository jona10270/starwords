// Valores que la SWAPI manda cuando no sabe el dato
const EMPTY_VALUES = ["", "unknown", "n/a", "none"];

// Enseño un guion si no hay dato y separo los miles si es un numero limpio
export const formatStarshipValue = (value: string, unit?: string) => {
    if (EMPTY_VALUES.includes(value.trim().toLowerCase())) return "—";

    const number = Number(value);
    const formatted = Number.isNaN(number) ? value : number.toLocaleString("es-ES");

    return unit ? `${formatted} ${unit}` : formatted;
};
