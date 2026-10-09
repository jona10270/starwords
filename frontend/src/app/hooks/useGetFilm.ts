import { getFilmUseCase } from "@/core/di/container"
import { skipToken, useQuery } from "@tanstack/react-query"

export const useGetFilm = (id: string | undefined) =>
    useQuery({
        queryKey: ['film', id],
        queryFn: id ? () => getFilmUseCase.execute(id) : skipToken,
        retry: 1,
    })
