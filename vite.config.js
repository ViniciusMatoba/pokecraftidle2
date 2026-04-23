import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    rollupOptions: {
      output: {
        // Desativando manualChunks temporariamente para depurar ReferenceError
      }
    },
    chunkSizeWarningLimit: 2000,
  }
})
