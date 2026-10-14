import { SearchIcon } from "../atoms";

interface SearchFieldProps {
    value: string;
    onChange: (value: string) => void;
    label: string;
    placeholder?: string;
    maxLength?: number;
}

// Caja de busqueda del archivo con su boton para vaciarla
export const SearchField = ({ value, onChange, label, placeholder, maxLength }: SearchFieldProps) => (
    <div
        role="search"
        className="flex w-full items-center gap-2 border border-field bg-ink px-3 py-[7px] text-steel transition-[border-color,box-shadow] duration-200 focus-within:border-accent focus-within:shadow-[0_0_16px_rgba(247,217,43,0.18)] hover:border-accent sm:mr-auto sm:w-72"
    >
        <SearchIcon />
        <input
            type="search"
            value={value}
            onChange={(event) => onChange(event.target.value)}
            aria-label={label}
            placeholder={placeholder}
            maxLength={maxLength}
            autoComplete="off"
            spellCheck={false}
            className="min-w-0 flex-1 bg-transparent font-terminal text-[11px] tracking-[0.18em] text-white uppercase outline-none placeholder:text-faint [&::-webkit-search-cancel-button]:hidden"
        />
        {value && (
            <button
                type="button"
                onClick={() => onChange("")}
                aria-label="Vaciar búsqueda"
                className="cursor-pointer px-1 font-terminal text-[13px] leading-none text-dim transition-colors duration-200 hover:text-accent"
            >
                ×
            </button>
        )}
    </div>
);
