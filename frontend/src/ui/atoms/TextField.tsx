import { useId, type ComponentProps } from "react";

interface TextFieldProps extends ComponentProps<"input"> {
    label: string;
    error?: string
}

export const TextField = ({ label, error, ...inputProps }: TextFieldProps) => {
    const id = useId();
    const errorId = `${id}-error`

    return (
        <div className="flex flex-col gap-2">
            <label htmlFor={id} className="font-terminal text-[9px] tracking-[0.26em] text-muted uppercase">
                    {label}
            </label>
                <input
                    id={id}
                    aria-invalid={error ? true : undefined}
                    aria-describedby={error ? errorId : undefined}
                    className={`border bg-ink px-3 py-2.5 text-white outline-none focus:border-accent focus:shadow-[0_0_16px_rgba(247,217,43,0.18)] ${
                        error ? "border-red-400" : "border-field"
                    }`}
                    {...inputProps}
                />
                {error && (
                    <p
                        id={errorId}
                        role="alert"
                        className="font-terminal text-[10px] tracking-[0.16em] text-red-400 uppercase"
                    >
                        {error}
                    </p>
                )}
        </div>
    );
};
