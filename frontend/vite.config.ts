import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // .env 는 저장소 루트 하나만 쓴다. VITE_ 로 시작하는 값만 브라우저에 노출된다
  envDir: '..',
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    // Windows 폴더(C:\...)에 저장소를 둔 경우처럼 파일 변경 감지가 안 될 때만 WATCH_POLLING=1
    watch: process.env.WATCH_POLLING === '1' ? { usePolling: true, interval: 300 } : undefined,
  },
  test: {
    environment: 'jsdom',
  },
})
