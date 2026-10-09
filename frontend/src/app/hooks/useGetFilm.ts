import { retryResource } from "./retryResource"
import { getFilmUseCase } from "@/core/di/container"
import { skipToken, useQuery } from "@tanstack/react-query"

export const useGetFilm = (id: string | undefined) =>
    useQuery({
        queryKey: ['films', id],
        queryFn: id ? () => getFilmUseCase.execute(id) : skipToken,
        retry: retryResource,
    })
