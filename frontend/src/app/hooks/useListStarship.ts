import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getAllStarshipUseCase } from "@/core/di/container";
import type { PageRequest } from "@/core/modules/common";
import { retryResource } from "./retryResource";

// Pido una pagina de naves
export const useListStarship = ({ page, limit }: PageRequest) =>
    useQuery({
        queryKey: ["starships", { page, limit }],
        queryFn: () => getAllStarshipUseCase.execute({ page, limit }),
        placeholderData: keepPreviousData,
        retry: retryResource,
    });
