import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getAllFilmsUseCase } from "@/core/di/container";
import type { SearchPageRequest } from "@/core/modules/common";
import { retryResource } from "./retryResource";

// Pido una pagina de peliculas
export const useListFilms = ({ page, limit, search }: SearchPageRequest) =>
    useQuery({
        queryKey: ['films', { page, limit, search }],
        queryFn: () => getAllFilmsUseCase.execute({ page, limit, search }),
        placeholderData: keepPreviousData,
        retry: retryResource,
    });
