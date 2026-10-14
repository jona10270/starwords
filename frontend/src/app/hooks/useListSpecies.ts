import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getAllSpeciesUseCase } from "@/core/di/container";
import type { SearchPageRequest } from "@/core/modules/common";
import { retryResource } from "./retryResource";

// Pido una pagina de especies
export const useListSpecies = ({ page, limit, search }: SearchPageRequest) =>
    useQuery({
        queryKey: ["species", { page, limit, search }],
        queryFn: () => getAllSpeciesUseCase.execute({ page, limit, search }),
        placeholderData: keepPreviousData,
        retry: retryResource,
    });
