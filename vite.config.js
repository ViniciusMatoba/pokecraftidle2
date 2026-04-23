import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/',
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('src/data/pokedex.js')) {
            return 'pokedex';
          }
          if (id.includes('src/data/moves.js')) {
            return 'moves';
          }
        }
      }
    },
    chunkSizeWarningLimit: 1000,
  }
})
