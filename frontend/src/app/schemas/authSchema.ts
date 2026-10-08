import { z } from "zod";

// Los mismos limites que valida el backend
const EMAIL_MAX_LENGTH = 254;
// Bcrypt solo usa los primeros 72 bytes asi que cuento bytes y no letras
const PASSWORD_MAX_BYTES = 72;

const fitsPasswordBytes = (value: string) => new TextEncoder().encode(value).length <= PASSWORD_MAX_BYTES;

export const loginSchema = z.object({
    email: z.email("Introduce un email válido").max(EMAIL_MAX_LENGTH, "Email demasiado largo"),
    password: z
        .string()
        .min(1, "Escribe tu contraseña")
        .refine(fitsPasswordBytes, "Contraseña demasiado larga"),
})

export type LoginFormValues = z.infer<typeof loginSchema>;

export const registerSchema = z
    .object({
        username: z
        .string()
        .trim()
        .min(4, "Mínimo 4 caracteres")
        .max(15, "Máximo 15 caracteres")
        .regex(
            /^[a-z0-9_]+$/,
            "Solo se permiten letras minúsculas, números y _"
        ),
        email: z.email("Introduce un email válido").max(EMAIL_MAX_LENGTH, "Email demasiado largo"),
        password: z
            .string()
            .min(4, "Minimo 4 caracteres")
            .refine(fitsPasswordBytes, "Contraseña demasiado larga"),
        confirmPassword: z.string(),
    })

    .refine((values) => values.password === values.confirmPassword, {
        error: "Las contraseñas no coinciden",
        path: ["confirmPassword"],
    });

    export type RegisterFormValue = z.infer<typeof registerSchema>;