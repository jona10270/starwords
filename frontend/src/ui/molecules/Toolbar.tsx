import type { ReactNode } from "react";

interface ToolbarProps {
    children: ReactNode;
}

// Franja de controles encima del listado donde ira tambien el buscador
export const Toolbar = ({ children }: ToolbarProps) => (
    <div className="mt-[18px] flex flex-wrap items-center justify-end gap-3.5 border border-line bg-toolbar px-4 py-3.5">
        {children}
    </div>
);
