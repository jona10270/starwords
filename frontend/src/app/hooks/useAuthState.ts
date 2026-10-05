import { authStore } from "@/core/di/container";
import { useStore } from "zustand";

// Leo la caja store y veo el estado de la session y cambio el componente cuando cambia
export const useAuthState = () => useStore(authStore, (state) => state.auth);
