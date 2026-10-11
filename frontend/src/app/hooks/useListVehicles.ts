import { getAllVehiclesUseCase } from "@/core/di/container";
import { useQuery } from "@tanstack/react-query";
import { retryResource } from "./retryResource";

export const useListVehicles = () => 
    useQuery({
        queryKey: ['vehicles'],
        queryFn: () => getAllVehiclesUseCase.execute(),
        retry: retryResource
    })