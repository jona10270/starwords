import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getAllSpeciesUseCase } from "@/core/di/container";
import type { PageRequest } from "@/core/modules/common";
import { retryResource } from "./retryResource";

// Pido una pagina de especies
export const useListSpecies = ({ page, limit }: PageRequest) =>
    useQuery({
        queryKey: ["species", { page, limit }],
        queryFn: () => getAllSpeciesUseCase.execute({ page, limit }),
        placeholderData: keepPreviousData,
        retry: retryResource,
    });
