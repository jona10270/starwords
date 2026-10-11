import { getSpecieUseCase } from "@/core/di/container";
import { skipToken, useQuery } from "@tanstack/react-query";
import { retryResource } from "./retryResource";

export const useGetSpecie = (id: string | undefined) => 
    useQuery({
        queryKey: ['species', id],
        queryFn: id ? () => getSpecieUseCase.execute(id) : skipToken,
        retry: retryResource,
    });