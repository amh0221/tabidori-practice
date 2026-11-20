/// <reference types="vite/client" />

// 프론트에서 읽는 환경변수. 새로 추가하면 .env.example 에도 추가한다
interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_GOOGLE_MAPS_BROWSER_KEY: string
  readonly VITE_GOOGLE_MAPS_MAP_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
