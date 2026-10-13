import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getAllVehiclesUseCase } from "@/core/di/container";
import type { PageRequest } from "@/core/modules/common";
import { retryResource } from "./retryResource";

// Pido una pagina de vehiculos
export const useListVehicles = ({ page, limit }: PageRequest) =>
    useQuery({
        queryKey: ["vehicles", { page, limit }],
        queryFn: () => getAllVehiclesUseCase.execute({ page, limit }),
        placeholderData: keepPreviousData,
        retry: retryResource,
    });
