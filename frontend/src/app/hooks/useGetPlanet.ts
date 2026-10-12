import { getPlanetUseCase } from "@/core/di/container";
import { skipToken, useQuery } from "@tanstack/react-query";
import { retryResource } from "./retryResource";

export const useGetPlanet = (id: string | undefined) =>
    useQuery({
        queryKey: ['planets', id],
        queryFn: id ? () => getPlanetUseCase.execute(id) : skipToken,
        retry: retryResource,
    });