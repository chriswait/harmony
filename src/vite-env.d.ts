/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DATABASE_URL: string
  readonly VITE_DATABASE_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}