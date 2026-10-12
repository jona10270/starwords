import { getAllPlanetsUseCase } from "@/core/di/container";
import { useQuery } from "@tanstack/react-query";
import { retryResource } from "./retryResource";

export const useListPlanets = () =>
    useQuery({
        queryKey: ['planets'],
        queryFn: () => getAllPlanetsUseCase.execute(),
        retry: retryResource,
    });