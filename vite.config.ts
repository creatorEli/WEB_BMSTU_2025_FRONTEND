import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mkcert from 'vite-plugin-mkcert'
import fs from 'fs';
import path from 'path';

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
    // https: {
    //   key: fs.readFileSync(path.resolve(__dirname, 'cert.key')),
    //   cert: fs.readFileSync(path.resolve(__dirname, 'cert.crt')),
    // },
    port: 3001
  },
  //plugins: [react(), mkcert(),],
  plugins: [react()],
})
