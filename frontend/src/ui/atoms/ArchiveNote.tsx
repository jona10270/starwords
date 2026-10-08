import type { ReactNode } from "react";

interface ArchiveNoteProps {
    children: ReactNode;
    className?: string;
}

// Texto pequeño de terminal centrado para avisos y pies del archivo
export const ArchiveNote = ({ children, className = "" }: ArchiveNoteProps) => (
    <p className={`text-center font-terminal text-[10px] tracking-[0.3em] text-faint uppercase ${className}`}>
        {children}
    </p>
);
