import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: './', //cambio, para que lo pueda leer aws s3 static website hosting
  plugins: [react()],
})
