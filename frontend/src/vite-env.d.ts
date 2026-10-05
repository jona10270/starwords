// Un archvio d.s solo contiene tipos no genero js no tengo ni imports ni exports
interface ImportMetaEnv {
    readonly VITE_API_URL: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}