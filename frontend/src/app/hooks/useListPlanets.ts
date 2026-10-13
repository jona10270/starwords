import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getAllPlanetsUseCase } from "@/core/di/container";
import type { PageRequest } from "@/core/modules/common";
import { retryResource } from "./retryResource";

// Pido una pagina de planetas
export const useListPlanets = ({ page, limit }: PageRequest) =>
    useQuery({
        queryKey: ["planets", { page, limit }],
        queryFn: () => getAllPlanetsUseCase.execute({ page, limit }),
        placeholderData: keepPreviousData,
        retry: retryResource,
    });
