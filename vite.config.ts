import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  //server: { port: 3000 },
  server: {
    proxy: {
      // Только API запросы проксируем на бэкенд
      '/api': {
        target: 'http://localhost:8084',
        changeOrigin: true,
        secure: false,
      }
    },
    port: 4000
  },
  plugins: [react()],
})
