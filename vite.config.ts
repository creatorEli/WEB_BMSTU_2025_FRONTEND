import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  //server: { port: 3000 },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:8084",
        changeOrigin: true,
        secure: false,
        //rewrite: (path) => path.replace(/^\/api/, "/"),
      },
    },
    port: 3000
  },
  plugins: [react()],
})
