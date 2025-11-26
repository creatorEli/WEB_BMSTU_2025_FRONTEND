import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mkcert from 'vite-plugin-mkcert'
import fs from 'fs';
import path from 'path';
import { VitePWA } from 'vite-plugin-pwa'

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
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'cert.key')),
      cert: fs.readFileSync(path.resolve(__dirname, 'cert.crt')),
    },
    port: 3001
  },
  //plugins: [react(), mkcert(),],
  plugins: [
    react(),
    mkcert(),
    VitePWA({
      registerType: 'autoUpdate',
      devOptions: {
        enabled: true,
      },
      manifest: {
        name: "Times amd Armies - github pages + pwa + sw",
        short_name: "Times And Armies",
        scope: '/times_and_armies_front/',
        start_url: '/times_and_armies_front/',
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#B52600",
        orientation: "portrait-primary",
        icons: [
          {
            "src": "/logo192.png",
            "type": "image/png", "sizes": "192x192"
          },
          {
            "src": "/logo512.png",
            "type": "image/png", "sizes": "512x512"
          }
        ],
      }
    })],
  base: '/times_and_armies_front/',
  // compilerOptions: {
  //   "types": [
  //     "vite-plugin-pwa/info.d.ts",
  //     "vite-plugin-pwa/client.d.ts"
  //   ],
  // }
})
