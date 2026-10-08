import { useQuery } from "@tanstack/react-query";

import { getCharacterUseCase } from "@/core/di/container";

// Pido la lista de personajes al abrir la pagina
export const useGetCharacter = () =>
    useQuery({
        queryKey: ["characters"],
        queryFn: () => getCharacterUseCase.execute(),
        retry: 1
    });