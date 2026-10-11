import { getStarshipUseCase } from "@/core/di/container";
import { skipToken, useQuery } from "@tanstack/react-query";
import { retryResource } from "./retryResource";

export const useGetStarship = (id: string | undefined) => 
    useQuery({
        queryKey: ['starships', id],
        queryFn: id ? () => getStarshipUseCase.execute(id) : skipToken,
        retry: retryResource
    })