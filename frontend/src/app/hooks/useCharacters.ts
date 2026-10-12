import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getCharacterUseCase } from "@/core/di/container";
import type { PageRequest } from "@/core/modules/common";
import { retryResource } from "./retryResource";

// Pido una pagina de personajes
export const useGetCharacter = ({ page, limit }: PageRequest) =>
    useQuery({
        queryKey: ["characters", { page, limit }],
        queryFn: () => getCharacterUseCase.execute({ page, limit }),
        placeholderData: keepPreviousData,
        retry: retryResource,
    });