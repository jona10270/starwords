import { getAllStarshipUseCase } from "@/core/di/container"
import { useQuery } from "@tanstack/react-query"
import { retryResource } from "./retryResource"

export const useListStarship = () => 
    useQuery({
        queryKey: ["starships"],
        queryFn: () => getAllStarshipUseCase.execute(),
        retry: retryResource
    })
