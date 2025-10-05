/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_API_TIMEOUT: string;
  readonly VITE_USE_REAL_API: string;
  readonly VITE_USE_LOCAL_AUTH: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
