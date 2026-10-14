import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getAllPlanetsUseCase } from "@/core/di/container";
import type { SearchPageRequest } from "@/core/modules/common";
import { retryResource } from "./retryResource";

// Pido una pagina de planetas
export const useListPlanets = ({ page, limit, search }: SearchPageRequest) =>
    useQuery({
        queryKey: ["planets", { page, limit, search }],
        queryFn: () => getAllPlanetsUseCase.execute({ page, limit, search }),
        placeholderData: keepPreviousData,
        retry: retryResource,
    });
