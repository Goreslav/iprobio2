/// <reference types="vite/client" />
interface ImportMetaEnv {
    readonly VITE_HMR_HOST: string
    readonly VITE_HMR_PORT: string
    readonly VITE_HMR_PROTOCOL: string
    readonly MEDUSA_BACKEND_URL: string
    readonly ADMIN_PATH: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}