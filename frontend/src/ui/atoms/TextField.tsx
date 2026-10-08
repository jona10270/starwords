import { useId, type ComponentProps, type ReactNode } from "react";

export interface TextFieldProps extends ComponentProps<"input"> {
    label: string;
    error?: string
    // Hueco a la derecha del input para meter un boton u otro elemento
    trailing?: ReactNode;
}

export const TextField = ({ label, error, trailing, ...inputProps }: TextFieldProps) => {
    const id = useId();
    const errorId = `${id}-error`

    return (
        <div className="flex flex-col gap-2">
            <label htmlFor={id} className="font-terminal text-[9px] tracking-[0.26em] text-muted uppercase">
                    {label}
            </label>
                <div className="relative">
                    <input
                        id={id}
                        aria-invalid={error ? true : undefined}
                        aria-describedby={error ? errorId : undefined}
                        className={`w-full border bg-ink px-3 py-2.5 text-white outline-none focus:border-accent focus:shadow-[0_0_16px_rgba(247,217,43,0.18)] ${
                            error ? "border-red-400" : "border-field"
                        } ${trailing ? "pr-24" : ""}`}
                        {...inputProps}
                    />
                    {trailing && (
                        <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                            {trailing}
                        </div>
                    )}
                </div>
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
