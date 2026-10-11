import { getVehicleUseCase } from "@/core/di/container";
import { skipToken, useQuery } from "@tanstack/react-query";
import { retryResource } from "./retryResource";

export const useGetVehicle = (id: string | undefined) => 
    useQuery({
        queryKey: ['vehicles', id],
        queryFn: id ? () => getVehicleUseCase.execute(id) : skipToken,
        retry: retryResource,
    })