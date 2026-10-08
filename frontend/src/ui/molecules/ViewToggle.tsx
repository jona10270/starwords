export type RecordView = "grid" | "list";

interface ViewToggleProps {
    value: RecordView;
    onChange: (view: RecordView) => void;
}

const OPTIONS: { value: RecordView; label: string }[] = [
    { value: "grid", label: "Grid" },
    { value: "list", label: "Lista" },
];

// Botones para cambiar entre rejilla y lista
export const ViewToggle = ({ value, onChange }: ViewToggleProps) => (
    <div role="group" aria-label="Vista del listado" className="flex gap-2">
        {OPTIONS.map((option) => {
            const isActive = option.value === value;

            return (
                <button
                    key={option.value}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => onChange(option.value)}
                    className={`cursor-pointer border px-3.5 py-[7px] font-terminal text-[10px] tracking-[0.22em] uppercase transition-colors duration-200 ${
                        isActive ? "border-accent bg-accent-soft text-accent" : "border-field text-dim hover:text-white"
                    }`}
                >
                    {option.label}
                </button>
            );
        })}
    </div>
);
