import { z } from "zod";

export const loginSchema = z.object({
    email: z.email("Introduce un email válido"),
    password: z.string().min(1, "Escribe tu contraseña")
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
        email: z.email("Introduce un email válido"),
        password: z.string().min(4, "Minimo 4 caracteres"),
        confirmPassword: z.string(),
    })

    .refine((values) => values.password === values.confirmPassword, {
        error: "Las contraseñas no coinciden",
        path: ["confirmPassword"],
    });

    export type RegisterFormValue = z.infer<typeof registerSchema>;