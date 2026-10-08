import { useState } from "react";

import { TextField, type TextFieldProps } from "../atoms";

// El tipo y el hueco de la derecha los controlo yo
type PasswordFieldProps = Omit<TextFieldProps, "type" | "trailing">;

// Campo de contraseña con un boton para mostrarla u ocultarla
export const PasswordField = (props: PasswordFieldProps) => {
    const [isVisible, setIsVisible] = useState(false);

    return (
        <TextField
            {...props}
            type={isVisible ? "text" : "password"}
            trailing={
                <button
                    // Pongo type button para que no envie el formulario
                    type="button"
                    onClick={() => setIsVisible((visible) => !visible)}
                    aria-label={isVisible ? "Ocultar contraseña" : "Mostrar contraseña"}
                    aria-pressed={isVisible}
                    className="px-2 py-1 font-terminal text-[9px] tracking-[0.2em] text-dim uppercase hover:text-accent focus-visible:text-accent focus-visible:outline-none"
                >
                    {isVisible ? "OCULTAR" : "VER"}
                </button>
            }
        />
    );
};
