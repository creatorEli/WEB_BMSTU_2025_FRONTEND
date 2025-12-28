import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs';
import path from 'path';

export default defineConfig({
  //server: { port: 3000 },
  server: {
    cors: {
      origin: [
        'tauri://localhost',
        'http://localhost:4000',
        'http://localhost:5173',
        'tauri://192.168.1.187',
        'http://192.168.1.187:4000',
        'http://192.168.1.187:5173'
      ],
      credentials: true
    },
    proxy: {
      // Только API запросы проксируем на бэкенд
      '/api': {
        target: 'http://localhost:8084',
        changeOrigin: true,
        secure: false,
        // configure: (proxy, _options) => {
        //   proxy.on('error', (err, _req, _res) => {
        //     console.log('Proxy error:', err);
        //   });
        //   proxy.on('proxyReq', (proxyReq, req, _res) => {
        //     console.log('Sending Request to Backend:', req.method, req.url);
        //   });
        // },
      }
    },
    host: '0.0.0.0',
    port: 4000,
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'cert.key')),
      cert: fs.readFileSync(path.resolve(__dirname, 'cert.crt')),
    },
  },
  plugins: [react()],
  build: {
    target: 'es2020',
    // Убедитесь, что билд совместим с Tauri
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
})
