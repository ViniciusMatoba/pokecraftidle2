import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
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
