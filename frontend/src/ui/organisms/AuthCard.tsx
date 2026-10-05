import type { ReactNode } from "react";
import { Link } from "react-router-dom";

interface AuthCardProps {
    title: string;
    activeTab: "login" | "register";
    // Recibo las rutas de fuera para que la ui no dependa del router de la app
    loginPath: string;
    registerPath: string;
    children: ReactNode;
}

export const AuthCard = ({ title, activeTab, loginPath, registerPath, children }: AuthCardProps) => {
    const isLogin = activeTab === "login";

    return (
        <main className="flex min-h-screen items-center justify-center px-4">
            <div className="w-full max-w-[440px] border border-line bg-[linear-gradient(#080808,#030303)] p-8">
                <h1 className="mb-6 font-display text-3xl font-bold tracking-[0.12em] text-accent uppercase">
                    {title}
                </h1>

                <div className="mb-6 flex gap-2">
                    <Link
                        to={loginPath}
                        className={`flex-1 border px-3 py-2 text-center font-terminal text-[10px] tracking-[0.2em] uppercase ${
                            isLogin
                                ? "border-accent bg-[#131109] text-accent"
                                : "border-field text-dim"
                        }`}
                    >
                        INICIAR SESIÓN
                    </Link>
                    <Link
                        to={registerPath}
                        className={`flex-1 border px-3 py-2 text-center font-terminal text-[10px] tracking-[0.2em] uppercase ${
                            !isLogin
                                ? "border-accent bg-[#131109] text-accent"
                                : "border-field text-dim"
                        }`}
                    >
                        CREAR CUENTA
                    </Link>
                </div>

                {children}
            </div>
        </main>
    );
};