// Barra fina arriba del todo mientras cargo datos
export const LoadingBar = () => (
    <div
        role="progressbar"
        aria-label="Cargando"
        className="fixed inset-x-0 top-0 z-40 h-0.5 overflow-hidden bg-[#0d0d0d]"
    >
        <div className="h-full w-1/4 animate-sweep bg-accent shadow-[0_0_14px_#f7d92b] motion-reduce:animate-none" />
    </div>
);
