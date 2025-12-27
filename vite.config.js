import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/ceremic-admin/',
  build: {
    outDir: 'dist'
  },
  server: {
    port: 5174
  }
})

