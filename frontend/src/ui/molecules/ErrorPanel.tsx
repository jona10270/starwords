import { Button } from "../atoms";

interface ErrorPanelProps {
    message: string;
    // Si no me pasan onRetry no pinto el boton
    onRetry?: () => void;
    isRetrying?: boolean;
}

// Aviso de error del archivo con boton opcional para volver a intentarlo
export const ErrorPanel = ({ message, onRetry, isRetrying = false }: ErrorPanelProps) => (
    <div
        role="alert"
        className="mt-[22px] flex flex-col items-center gap-4 border border-danger/30 bg-danger/5 px-6 py-10 text-center"
    >
        <p className="font-terminal text-[10px] tracking-[0.3em] text-danger uppercase">Transmisión interrumpida</p>
        <p className="max-w-[48ch] font-terminal text-sm tracking-[0.06em] text-[#e8eaee]">{message}</p>
        {onRetry && (
            <Button type="button" onClick={onRetry} disabled={isRetrying}>
                {isRetrying ? "Reintentando..." : "Reintentar"}
            </Button>
        )}
    </div>
);
