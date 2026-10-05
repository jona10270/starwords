// Creo la interficie para saber que valores quiero cojer del enviroment y que valores quiero exportar a mi aplicacion
interface AppConfig {
    apiUrl: string;
}

// Cojo los valores del enviroment y los guardo en una constante para poder exportarlos a mi aplicacion
const apiUrl = import.meta.env.VITE_API_URL;

// Exporto los valores del enviroment a mi aplicacion para poder usarlos en cualquier parte de mi aplicacion
export const config: AppConfig = {
    apiUrl: apiUrl,
}