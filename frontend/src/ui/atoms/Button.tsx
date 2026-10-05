import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({ type = "submit", className = "", ...props }: ButtonProps) => (
    <button
        type={type}
        className={`bg-accent px-4 py-3 font-terminal text-[11px] font-medium tracking-[0.26em] text-black uppercase transition-shadow hover:shadow-[0_0_26px_rgba(247,217,43,0.5)] disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        {...props}
    />
);
