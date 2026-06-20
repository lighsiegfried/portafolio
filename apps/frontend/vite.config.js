import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath, URL } from 'node:url'

// https://vitejs.dev/config/
export default defineConfig({
  base: './', //cambio, para que lo pueda leer aws s3 static website hosting
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [
    react(),
    {
      name: 'absolute-favicon',
      enforce: 'post',
      transformIndexHtml(html) {
        return html.replace('href="./logo.svg"', 'href="/logo.svg"')
      },
    },
  ],
})
