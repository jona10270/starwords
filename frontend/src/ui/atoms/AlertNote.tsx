import type { ReactNode } from "react";

interface AlertNoteProps {
    children: ReactNode;
    className?: string;
}

// Aviso corto en rojo para fallos que no tapan la pagina
export const AlertNote = ({ children, className = "" }: AlertNoteProps) => (
    <p role="alert" className={`text-center font-terminal text-[10px] tracking-[0.3em] text-danger uppercase ${className}`}>
        {children}
    </p>
);
