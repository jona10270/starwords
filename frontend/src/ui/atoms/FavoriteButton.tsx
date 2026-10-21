import { HeartIcon } from "./Icons";

export interface FavoriteButtonProps {
    isFavorite: boolean;
    onClick: () => void;
}

// Corazon rojo si el registro esta en favoritos y transparente si no
export const FavoriteButton = ({ isFavorite, onClick }: FavoriteButtonProps) => (
    <button
        type="button"
        onClick={onClick}
        aria-pressed={isFavorite}
        aria-label={isFavorite ? "En favoritos" : "Guardar en favoritos"}
        title={isFavorite ? "En favoritos" : "Guardar en favoritos"}
        className={`grid size-8 shrink-0 cursor-pointer place-items-center border transition-[color,border-color,box-shadow] duration-200 ${
            isFavorite
                ? "border-danger/60 text-danger shadow-[0_0_14px_rgba(255,107,107,0.25)]"
                : "border-field text-dim hover:border-danger/60 hover:text-danger"
        }`}
    >
        <HeartIcon fill={isFavorite ? "currentColor" : "none"} />
    </button>
);
