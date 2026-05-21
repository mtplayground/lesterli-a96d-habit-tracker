/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE?: string
  readonly VITE_COLOR_INK?: string
  readonly VITE_COLOR_INK_MUTED?: string
  readonly VITE_COLOR_INK_SOFT?: string
  readonly VITE_COLOR_SURFACE?: string
  readonly VITE_COLOR_SURFACE_RAISED?: string
  readonly VITE_COLOR_SURFACE_MUTED?: string
  readonly VITE_COLOR_BRAND?: string
  readonly VITE_COLOR_BRAND_DARK?: string
  readonly VITE_COLOR_BRAND_LIGHT?: string
  readonly VITE_COLOR_LINE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
