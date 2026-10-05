import { registerUseCase } from "@/core/di/container";
import type { RegisterData } from "@/core/modules/auth";

import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { accountCreatedState } from "../navigation/accountCreatedState";

// Lo que hacemos es prepara una funcion para que pueda llamar al mutation 
export const useRegister = () => {
    const navigate = useNavigate();

    return useMutation({
        mutationFn: (data: RegisterData) => 
            registerUseCase.execute(data),

        // Cuando el register es succes se envia al login
        onSuccess() {
            navigate('/login' ,{state: accountCreatedState});
        }
    });
}