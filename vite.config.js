import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: process.env.NODE_ENV === 'production' ? '/ceremic-admin/' : '/',
  build: {
    outDir: 'dist'
  },
  server: {
    port: 5174
  }
})

