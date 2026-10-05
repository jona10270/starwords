import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "@/app/queryClient";
// import { LoginPage } from "./pages/LoginPage";
// import { RegisterPage } from "./pages/RegisterPage";
import { AppRoutes } from "./AppRoutes";

export const App = () => (
    <QueryClientProvider client={queryClient}>
        <AppRoutes />
        <ReactQueryDevtools />
    </QueryClientProvider>
);