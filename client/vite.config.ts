import type { ServerResponse } from 'node:http'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const API_TARGET = process.env.VITE_API_PROXY ?? 'http://127.0.0.1:8028'

function sendApiDown(res: ServerResponse) {
  if (res.headersSent) return
  res.writeHead(502, { 'Content-Type': 'application/json' })
  res.end(
    JSON.stringify({
      detail:
        'API is not reachable on port 8028. In the repo root run: npm run dev:api (and npm run dev:client on port 5202).',
    }),
  )
}

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: './',
  server: {
    host: '127.0.0.1',
    port: 5202,
    strictPort: true,
    proxy: {
      '/api': {
        target: API_TARGET,
        changeOrigin: true,
        proxyTimeout: 600_000,
        timeout: 600_000,
        configure(proxy) {
          proxy.on('error', (_err, _req, res) => {
            // http-proxy may pass Socket | ServerResponse; only JSON-ify real responses.
            if (res && 'writeHead' in res) {
              sendApiDown(res as ServerResponse)
            }
          })
        },
      },
    },
  },
  // preview has no proxy by default — refuse silent HTML-for-/api confusion
  preview: {
    host: '127.0.0.1',
    port: 5202,
    strictPort: true,
    proxy: {
      '/api': {
        target: API_TARGET,
        changeOrigin: true,
        configure(proxy) {
          proxy.on('error', (_err, _req, res) => {
            if (res && 'writeHead' in res) {
              sendApiDown(res as ServerResponse)
            }
          })
        },
      },
    },
  },
})
