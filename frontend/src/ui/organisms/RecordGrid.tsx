import { RecordCard, type RecordCardProps, type RecordView } from "../molecules";

export interface RecordItem extends Omit<RecordCardProps, "wide"> {
    key: string;
}

interface RecordGridProps {
    records: RecordItem[];
    view: RecordView;
}

// Coloco las tarjetas en rejilla o en una sola columna segun la vista elegida
export const RecordGrid = ({ records, view }: RecordGridProps) => (
    <ul
        className={`mt-[22px] grid gap-4 ${
            view === "grid" ? "grid-cols-[repeat(auto-fill,minmax(min(300px,100%),1fr))]" : "grid-cols-1"
        }`}
    >
        {records.map(({ key, ...card }) => (
            <li key={key} className="min-w-0">
                <RecordCard {...card} wide={view === "list"} />
            </li>
        ))}
    </ul>
);
