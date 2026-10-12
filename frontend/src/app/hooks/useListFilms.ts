import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getAllFilmsUseCase } from "@/core/di/container";
import type { PageRequest } from "@/core/modules/common";
import { retryResource } from "./retryResource";

// Pido una pagina de peliculas
export const useListFilms = ({ page, limit }: PageRequest) =>
    useQuery({
        queryKey: ['films', { page, limit }],
        queryFn: () => getAllFilmsUseCase.execute({ page, limit }),
        placeholderData: keepPreviousData,
        retry: retryResource,
    });
