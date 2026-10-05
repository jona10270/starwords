import { Route, Routes } from "react-router-dom";

import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { HomePage } from "./pages/HomePage";
import { AuthRoute, GuestRoute } from "./ProtectedRoutes";

export const AppRoutes = () => (
    <Routes>
        <Route
            path="/"
            element={
                <AuthRoute>
                    <HomePage />
                </AuthRoute>
            } 
        />
        <Route
            path="/login"
            element={
                <GuestRoute>
                    <LoginPage />
                </GuestRoute>
            } 
        />
        <Route
            path="/register"
            element={
                <GuestRoute>
                    <RegisterPage />
                </GuestRoute>
            } 
        />
    </Routes>
)