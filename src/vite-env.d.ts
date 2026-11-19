/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Gốc URL của server. Rỗng = gọi `/api` tương đối (qua proxy Vite). Không đặt = production. */
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
