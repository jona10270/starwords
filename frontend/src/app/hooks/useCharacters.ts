import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getCharacterUseCase } from "@/core/di/container";
import type { SearchPageRequest } from "@/core/modules/common";
import { retryResource } from "./retryResource";

// Pido una pagina de personajes
export const useGetCharacter = ({ page, limit, search }: SearchPageRequest) =>
    useQuery({
        queryKey: ["characters", { page, limit, search }],
        queryFn: () => getCharacterUseCase.execute({ page, limit, search }),
        placeholderData: keepPreviousData,
        retry: retryResource,
    });