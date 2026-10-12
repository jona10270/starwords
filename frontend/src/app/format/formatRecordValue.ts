// Valores que la SWAPI manda cuando no sabe el dato
const EMPTY_VALUES = ["", "unknown", "n/a", "none"];

// Enseño un guion si no hay dato y solo separo los miles y pongo la unidad si es un numero
export const formatRecordValue = (value: string, unit?: string) => {
    const text = value.trim();
    if (EMPTY_VALUES.includes(text.toLowerCase())) return "—";

    // Quito las comas de miles que manda la SWAPI como en 1,600
    const number = Number(text.replaceAll(",", ""));
    if (Number.isNaN(number)) return text;

    const formatted = number.toLocaleString("es-ES");

    return unit ? `${formatted} ${unit}` : formatted;
};
