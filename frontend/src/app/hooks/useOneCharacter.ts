import { skipToken, useQuery } from "@tanstack/react-query";

import { getOneCharacterUseCase } from "@/core/di/container";

// Funcion para pedir un solo character
export const useOneGetCharacter = (id: string | undefined) =>
    useQuery({
        queryKey: ['characters', id],
        queryFn: id ? () => getOneCharacterUseCase.execute(id) : skipToken,
        retry: 1
    });