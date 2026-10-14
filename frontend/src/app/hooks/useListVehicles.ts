import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getAllVehiclesUseCase } from "@/core/di/container";
import type { SearchPageRequest } from "@/core/modules/common";
import { retryResource } from "./retryResource";

// Pido una pagina de vehiculos
export const useListVehicles = ({ page, limit, search }: SearchPageRequest) =>
    useQuery({
        queryKey: ["vehicles", { page, limit, search }],
        queryFn: () => getAllVehiclesUseCase.execute({ page, limit, search }),
        placeholderData: keepPreviousData,
        retry: retryResource,
    });
