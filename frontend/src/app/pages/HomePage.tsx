import { logoutUseCase } from "@/core/di/container";
import { useAuthState } from "../hooks/useAuthState"


export const HomePage = () => {
    const authState = useAuthState();

    const handleLogout = () => {
        void logoutUseCase.execute();
    };

    if (authState.kind !== "AuthenticatedAuthState") {
        return null;
    }

    return (
        <main className="mx-auto mt-16 flex max-w-sm flex-col gap-4 p-8">
            <h1 className="text-2xl font-bold">Hola, {authState.user.username}</h1>
            <p className="text-sm">Email: {authState.user.email}</p>
            <p className="text-sm">Rol: {authState.user.role}</p>
            <p className="text-sm break-all">
                Token: {authState.session.accessToken.slice(0, 30)}...
            </p>
            <p className="text-sm">
                Caduca: {new Date(authState.session.expiresAt).toLocaleString()}
            </p>
            <button
                type="button"
                onClick={handleLogout}
                className="rounded bg-gray-800 px-4 py-2 text-white"
            >
                Salir
            </button>
        </main>
    );
};