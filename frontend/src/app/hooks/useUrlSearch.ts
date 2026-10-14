import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { PAGE_PARAM } from "../navigation/pagination";
import { SEARCH_DELAY_MS, SEARCH_PARAM } from "../navigation/search";

// Texto del buscador que se pinta al momento y llega a la url cuando deja de escribir
export const useUrlSearch = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const search = searchParams.get(SEARCH_PARAM) ?? "";

    const [searchText, setSearchText] = useState(search);
    const [syncedSearch, setSyncedSearch] = useState(search);
    const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

    // Si la url cambia desde fuera como al volver atras pongo su texto en la caja
    if (search !== syncedSearch) {
        setSyncedSearch(search);
        if (search !== searchText.trim()) setSearchText(search);
    }

    // Cancelo la escritura pendiente si se sale de la pagina
    useEffect(() => () => clearTimeout(timerRef.current), []);

    // Pinto la letra ya y espero a que pare de escribir para tocar la url y volver a la primera pagina
    const changeSearch = (nextText: string) => {
        setSearchText(nextText);
        clearTimeout(timerRef.current);

        timerRef.current = setTimeout(() => {
            setSearchParams(
                (params) => {
                    const value = nextText.trim();
                    if (value === (params.get(SEARCH_PARAM) ?? "")) return params;

                    if (value) params.set(SEARCH_PARAM, value);
                    else params.delete(SEARCH_PARAM);
                    params.delete(PAGE_PARAM);
                    return params;
                },
                { replace: true },
            );
        }, SEARCH_DELAY_MS);
    };

    return { searchText, search, changeSearch };
};
