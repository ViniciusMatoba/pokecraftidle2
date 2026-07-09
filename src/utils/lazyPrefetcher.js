const STORAGE_KEY = 'pokecraft_lazy_prefetch_progress';
const CACHE_NAME_PREFIX = 'pokecraft-cache-v';

// Músicas e sons do jogo
const SOUNDS = [
  '/sounds/derrota.mp3',
  '/sounds/nivel.mp3',
  '/sounds/POKE CENTER.mp3',
  '/sounds/gym.mp3',
  '/sounds/51383504-feora-lucas-cooper-pokemon-league-night-pokemon-diamond-410587.mp3',
  '/sounds/51383504-feora-vgm-yume-littleroot-town-pokemon-ruby-amp-sapphire-lofi-410588.mp3',
  '/sounds/51383504-feora-vgm-yume-new-bark-town-pokemon-gold-amp-silver-lofi-410593.mp3',
  '/sounds/51383504-feora-vgm-yume-route-101-pokeon-ruby-amp-sapphire-lofi-410589.mp3',
  '/sounds/51383504-feora-vgm-yume-surf-theme-pokemon-ruby-amp-sapphire-lofi-410586.mp3',
  '/sounds/51383504-pallet-town-pokemon-red-amp-blue-lofi-410591.mp3'
];

// Ícones de itens locais e da PokeAPI mais frequentes
const ITEMS = [
  'poke-ball', 'great-ball', 'ultra-ball', 'master-ball',
  'potion', 'super-potion', 'hyper-potion', 'max-potion',
  'revive', 'max-revive', 'full-restore',
  'nugget', 'star-piece', 'rare-candy',
  'oran-berry', 'sitrus-berry', 'pecha-berry', 'cheri-berry',
  'x-attack', 'x-defense', 'x-speed', 'dire-hit'
];

const loadProgress = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    soundsDone: false,
    backgroundsDone: false,
    itemsDone: false,
    lastPokemonId: 0,
    lastFormKeyIndex: 0
  };
};

const saveProgress = (progress) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {}
};

// Verifica se um asset já está no cache local do Service Worker
const isCached = async (url) => {
  if (!('caches' in window)) return false;
  try {
    const cacheKeys = await caches.keys();
    // Procura no cache ativo do pokecraft
    const activeCacheName = cacheKeys.find(name => name.startsWith(CACHE_NAME_PREFIX));
    if (activeCacheName) {
      const cache = await caches.open(activeCacheName);
      const match = await cache.match(url);
      return !!match;
    }
  } catch {}
  return false;
};

// Faz download e armazena o asset no cache através do Service Worker
const fetchAndCache = async (url) => {
  try {
    const cached = await isCached(url);
    if (cached) return true; // Já está no cache

    // Executa a requisição. O service worker intercepta e faz o cache
    const response = await fetch(url, { mode: 'no-cors' });
    return response.ok || response.type === 'opaque';
  } catch {
    return false;
  }
};

/**
 * Inicializa o baixador silencioso em segundo plano.
 * Executa de forma totalmente assíncrona usando intervalos lentos para não impactar performance do jogo.
 */
export const startLazyPrefetcher = (processedRoutes, fixPath = (p) => p, pokemonFormSpriteIds = {}) => {
  // Executa após 15 segundos para dar tempo do render do jogo inicializar e estabilizar
  setTimeout(async () => {
    const progress = loadProgress();
    
    // ── 1. PREFETCH DE SONS (Efeitos e Músicas) ──
    if (!progress.soundsDone) {
      for (const sound of SOUNDS) {
        await fetchAndCache(fixPath(sound));
        // Intervalo de 1s entre downloads de som
        await new Promise(r => setTimeout(r, 1000));
      }
      progress.soundsDone = true;
      saveProgress(progress);
    }

    // ── 2. PREFETCH DE BACKGROUNDS DAS ROTAS ──
    if (!progress.backgroundsDone && processedRoutes) {
      const bgs = new Set();
      Object.values(processedRoutes).forEach(route => {
        if (route.background) bgs.add(route.background);
      });
      
      for (const bg of bgs) {
        await fetchAndCache(fixPath(bg));
        // Intervalo de 2s para backgrounds (WebP costumam ser maiores)
        await new Promise(r => setTimeout(r, 2000));
      }
      progress.backgroundsDone = true;
      saveProgress(progress);
    }

    // ── 3. PREFETCH DE ITENS (PokeAPI) ──
    if (!progress.itemsDone) {
      const itemBaseUrl = 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/items';
      for (const item of ITEMS) {
        await fetchAndCache(`${itemBaseUrl}/${item}.png`);
        await new Promise(r => setTimeout(r, 500));
      }
      progress.itemsDone = true;
      saveProgress(progress);
    }

    // ── 4. PREFETCH DE POKÉMONS (1 a 1025) ──
    const pokemonBaseUrl = 'https://cdn.jsdelivr.net/gh/PokeAPI/sprites@master/sprites/pokemon';
    let currentId = progress.lastPokemonId + 1;

    const downloadPokemonBatch = async () => {
      if (currentId > 1025) {
        // Se terminou Pokémon normais, passa para as formas regionais
        await downloadRegionalForms();
        return;
      }

      // Baixa lote de 5 Pokémons por vez (frente e costas)
      const batchLimit = Math.min(1025, currentId + 4);
      for (let id = currentId; id <= batchLimit; id++) {
        // Sprite frontal
        await fetchAndCache(`${pokemonBaseUrl}/${id}.png`);
        // Sprite de costas (para batalhas)
        await fetchAndCache(`${pokemonBaseUrl}/back/${id}.png`);
      }

      currentId = batchLimit + 1;
      progress.lastPokemonId = batchLimit;
      saveProgress(progress);

      // Agenda o próximo lote para daqui a 6 segundos (para não sobrecarregar)
      setTimeout(downloadPokemonBatch, 6000);
    };

    // ── 5. PREFETCH DE FORMAS REGIONAIS ──
    const downloadRegionalForms = async () => {
      const formKeys = Object.keys(pokemonFormSpriteIds);
      let formIdx = progress.lastFormKeyIndex;

      const downloadFormBatch = async () => {
        if (formIdx >= formKeys.length) {
          console.log('[Prefetcher] Download de todos os assets concluído com sucesso!');
          return;
        }

        const batchLimit = Math.min(formKeys.length, formIdx + 3);
        for (let i = formIdx; i < batchLimit; i++) {
          const spriteId = pokemonFormSpriteIds[formKeys[i]];
          if (spriteId) {
            await fetchAndCache(`${pokemonBaseUrl}/${spriteId}.png`);
            await fetchAndCache(`${pokemonBaseUrl}/back/${spriteId}.png`);
          }
        }

        formIdx = batchLimit;
        progress.lastFormKeyIndex = batchLimit;
        saveProgress(progress);

        setTimeout(downloadFormBatch, 6000);
      };

      downloadFormBatch();
    };

    // Inicia o prefetch de Pokémons
    downloadPokemonBatch();

  }, 15000); // 15 segundos iniciais de delay
};
