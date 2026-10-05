import { useMutation } from "@tanstack/react-query";

import { loginUseCase } from "@/core/di/container";
import type { LoginCredentials } from "@/core/modules/auth";

// Lanzo el login de react query me dice si esta cargando si ha fallado o si ha ido bien
export const useLogin = () => 
    useMutation({
        mutationFn: (credentials: LoginCredentials) => 
            loginUseCase.execute(credentials),
    });