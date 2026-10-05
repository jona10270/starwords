import { QueryClient } from "@tanstack/react-query";

// Creo una sola vez la caché de React Query para toda la app
export const queryClient = new QueryClient();