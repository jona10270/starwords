import { Route, Routes } from "react-router-dom";

import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { HomePage } from "./pages/HomePage";
import { AuthRoute, GuestRoute } from "./ProtectedRoutes";
import { ROUTES } from "./navigation/routes";

export const AppRoutes = () => (
    <Routes>
        <Route
            path={ROUTES.home}
            element={
                <AuthRoute>
                    <HomePage />
                </AuthRoute>
            } 
        />
        <Route
            path={ROUTES.login}
            element={
                <GuestRoute>
                    <LoginPage />
                </GuestRoute>
            } 
        />
        <Route
            path={ROUTES.register}
            element={
                <GuestRoute>
                    <RegisterPage />
                </GuestRoute>
            } 
        />
    </Routes>
)