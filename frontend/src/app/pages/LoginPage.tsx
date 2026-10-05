import { useForm } from "react-hook-form"
import { useLocation, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

import { useLogin } from "../hooks/useLogin";
import { loginSchema, type LoginFormValues } from "../schemas/authSchema";
import { AuthCard } from "@/ui/organisms/AuthCard";
import { Button, TextField } from "@/ui/atoms";
import { useEffect, useState } from "react";
import { isAccountCreatedState } from "../navigation/accountCreatedState";
import { useAuthPaths } from "../hooks/useAuthPaths";

export const LoginPage = () => {
    // Funcion para hacer el login
    const login = useLogin();
    const { loginPath, registerPath } = useAuthPaths();
    const location = useLocation();
    const navigate = useNavigate();

    const [accountCreated] = useState(() => isAccountCreatedState(location.state));

    useEffect(() => {
        if (isAccountCreatedState(location.state)) {
            // Borro el aviso del historial pero conservo la query para no perder el redirectTo
            navigate(
                { pathname: location.pathname, search: location.search, hash: location.hash },
                { replace: true, state: null },
            );
        }
    }, [location.state, location.pathname, location.search, location.hash, navigate])

    // Creo el formulario con rhf
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: "", password: ""}
    })

    const onSubmit = (values: LoginFormValues) => login.mutate(values)

    return (
        <AuthCard
            title="INICIAR SESIÓN"
            activeTab="login"
            loginPath={loginPath}
            registerPath={registerPath}
        >
            <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
                {accountCreated && (
                    <p role="status" className="font-terminal text-[10px] tracking-[0.16em] text-green-400 uppercase">
                        Cuenta creada, ya puedes iniciar sesión
                    </p>
                )}
                <TextField
                    label="EMAIL"
                    type="email"
                    error={errors.email?.message}
                    {...register("email")}
                />
                <TextField
                    label="CONTRASEÑA"
                    type="password"
                    error={errors.password?.message}
                    {...register("password")}
                />
                <Button disabled={login.isPending}>
                    {login.isPending ? "Entrando..." : "ACCEDER ▸"}
                </Button>
                {login.error && (
                    <p className="font-terminal text-[10px] tracking-[0.16em] text-red-400 uppercase">
                        {login.error.message}
                    </p>
                )}
            </form>
        </AuthCard>
    );
};
