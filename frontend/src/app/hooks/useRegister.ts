import { registerUseCase } from "@/core/di/container";
import type { RegisterData } from "@/core/modules/auth";

import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { accountCreatedState } from "../navigation/accountCreatedState";
import { useAuthPaths } from "./useAuthPaths";

// Lo que hacemos es prepara una funcion para que pueda llamar al mutation
export const useRegister = () => {
    const navigate = useNavigate();
    const { loginPath } = useAuthPaths();

    return useMutation({
        mutationFn: (data: RegisterData) =>
            registerUseCase.execute(data),

        // Cuando el register es succes se envia al login conservando la pagina a la que volver
        onSuccess() {
            navigate(loginPath, { state: accountCreatedState });
        }
    });
}
