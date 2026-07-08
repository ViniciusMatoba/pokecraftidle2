import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './',
  // Respeita a porta atribuída pelo ambiente (preview/CI); fallback 5173
  server: {
    port: Number(process.env.PORT) || 5173,
  },
  build: {
    sourcemap: false,
    minify: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/firebase')) return 'vendor-firebase';
          if (id.includes('node_modules')) return 'vendor';
          if (id.includes('data/pokedex')) return 'pokedex';
          if (id.includes('data/moves'))   return 'moves';
          if (id.includes('data/routes'))  return 'routes';
          if (id.includes('data/gyms'))    return 'gyms';
          if (id.includes('data/villains')) return 'villains';
          if (id.includes('components/BattleScreen')) return 'screen-battle';
          if (id.includes('components/CityScreen')) return 'screen-city';
          if (id.includes('components/PokemonManagement')) return 'screen-pokemon';
          if (id.includes('components/MenuScreen')) return 'screen-menu';
        }
      }
    },
    chunkSizeWarningLimit: 1000,
  }
})
