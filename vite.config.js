import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    minify: true, // REATIVADO - BUG ENCONTRADO E CORRIGIDO
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('data/pokedex')) return 'pokedex';
          if (id.includes('data/moves'))   return 'moves';
        }
      }
    },
    chunkSizeWarningLimit: 1000,
  }
})
