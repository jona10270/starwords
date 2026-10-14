import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getAllStarshipUseCase } from "@/core/di/container";
import type { SearchPageRequest } from "@/core/modules/common";
import { retryResource } from "./retryResource";

// Pido una pagina de naves
export const useListStarship = ({ page, limit, search }: SearchPageRequest) =>
    useQuery({
        queryKey: ["starships", { page, limit, search }],
        queryFn: () => getAllStarshipUseCase.execute({ page, limit, search }),
        placeholderData: keepPreviousData,
        retry: retryResource,
    });
