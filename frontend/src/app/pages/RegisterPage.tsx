import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useRegister } from "../hooks/useRegister";
import { registerSchema, type RegisterFormValue } from "../schemas/authSchema";
import { useAuthPaths } from "../hooks/useAuthPaths";
import { AuthCard } from "@/ui/organisms/AuthCard";
import { Button, TextField } from "@/ui/atoms";
import { PasswordField } from "@/ui/molecules";

export const RegisterPage = () => {
    const registerUser = useRegister();
    const { loginPath, registerPath } = useAuthPaths();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<RegisterFormValue>({
        resolver: zodResolver(registerSchema),
        // mode: "onSubmit",
        defaultValues: {
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    })

    const onSubmit = (values: RegisterFormValue) => registerUser.mutate(values)

    return (
        <AuthCard
            title="CREAR CUENTA"
            activeTab="register"
            loginPath={loginPath}
            registerPath={registerPath}
        >
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
                <TextField
                    label="NOMBRE DE USUARIO"
                    type="text"
                    autoComplete="nickname"
                    error={errors.username?.message}
                    {...register("username")}
                />
                <TextField
                    label="EMAIL"
                    type="email"
                    autoComplete="username"
                    error={errors.email?.message}
                    {...register("email")}
                />
                <PasswordField
                    label="CONTRASEÑA"
                    autoComplete="new-password"
                    error={errors.password?.message}
                    {...register("password")}
                />
                <PasswordField
                    label="CONFIRMAR CONTRASEÑA"
                    autoComplete="new-password"
                    error={errors.confirmPassword?.message}
                    {...register("confirmPassword")}
                />
                <Button disabled={registerUser.isPending}>
                    {registerUser.isPending ? <span>Creando...</span> : <span>REGISTRARSE ▸</span>}
                </Button>
                {registerUser.error && (
                    <p className="font-terminal text-[10px] tracking-[0.16em] text-red-400 uppercase">
                        {registerUser.error.message}
                    </p>
                )}
            </form>
        </AuthCard>
    );
};
