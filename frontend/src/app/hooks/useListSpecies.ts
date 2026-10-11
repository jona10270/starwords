import { getAllSpeciesUseCase } from "@/core/di/container";
import { useQuery } from "@tanstack/react-query";
import { retryResource } from "./retryResource";

export const useListSpecies = () => 
    useQuery({
        queryKey: ['species'],
        queryFn: () => getAllSpeciesUseCase.execute(),
        retry: retryResource,
    });