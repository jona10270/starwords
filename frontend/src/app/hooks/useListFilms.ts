import { getAllFilmsUseCase } from "@/core/di/container"
import { useQuery } from "@tanstack/react-query"

export const useListFilms = () => 
    useQuery({
        queryKey: ['films'],
        queryFn: () => getAllFilmsUseCase.execute(),
        retry: 1,
    })
