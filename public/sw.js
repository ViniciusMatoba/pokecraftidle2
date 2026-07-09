// Service Worker — versão sincronizada com version.json
// IMPORTANTE: esta linha DEVE ser atualizada a cada bump de versão
// para que o browser detecte o novo SW e invalide o cache antigo.
let CACHE_NAME = 'pokecraft-cache-v2.11.59';

// Busca versão atual para manter cache sincronizado
async function getCacheName() {
  try {
    const res = await fetch('./version.json?_sw=' + Date.now(), { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      return `pokecraft-cache-v${data.version}`;
    }
  } catch {}
  return CACHE_NAME;
}

const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './favicon.svg',
  './version.json',
];

const isCacheableExternalSprite = (url) => {
  if (url.hostname === 'raw.githubusercontent.com') {
    return (
      url.pathname.startsWith('/PokeAPI/sprites/') ||
      url.pathname.startsWith('/duiker101/pokemon-type-svg-icons/')
    );
  }

  return (
    url.hostname.includes('pokemonshowdown.com') &&
    (
      url.pathname.startsWith('/sprites/') ||
      url.pathname.endsWith('.png') ||
      url.pathname.endsWith('.gif')
    )
  );
};

const cacheFirst = async (request) => {
  const cached = await caches.match(request);
  if (cached) return cached;

  const networkResponse = await fetch(request);
  if (
    networkResponse &&
    (networkResponse.status === 200 || networkResponse.type === 'opaque')
  ) {
    const clone = networkResponse.clone();
    caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
  }
  return networkResponse;
};

// Instalação: usa getCacheName() para garantir cache com versão correta desde o início
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    getCacheName().then((cacheName) => {
      CACHE_NAME = cacheName;
      return caches.open(cacheName).then((cache) => {
        return cache.addAll(STATIC_ASSETS).catch(() => {});
      });
    })
  );
});

// Ativação: limpa TODOS os caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    getCacheName().then((currentCache) => {
      CACHE_NAME = currentCache;
      return caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name.startsWith('pokecraft-cache-') && name !== currentCache)
            .map((name) => caches.delete(name))
        );
      });
    }).then(() => self.clients.claim())
  );
});

// Estratégia de Fetch
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 1. Ignorar localhost completamente
  if (url.hostname === 'localhost' || url.hostname === '127.0.0.1') return;

  // 2. Cache-First para sprites externos estaveis (Pokemon, itens, treinadores e tipos)
  if (event.request.method === 'GET' && isCacheableExternalSprite(url)) {
    event.respondWith(
      cacheFirst(event.request).catch(async () => {
        const cached = await caches.match(event.request);
        return cached || new Response('Not found', { status: 404 });
      })
    );
    return;
  }

  // 2. Ignorar Firebase / Google APIs
  if (
    url.hostname.includes('firestore.googleapis.com') ||
    url.hostname.includes('firebase') ||
    url.hostname.includes('googleapis.com') ||
    url.hostname.includes('fonts.googleapis.com') ||
    url.hostname.includes('fonts.gstatic.com')
  ) {
    return;
  }

  // 3. Network-First para index.html e version.json (sempre atualizado)
  if (
    url.pathname.endsWith('/') ||
    url.pathname.endsWith('index.html') ||
    url.pathname.endsWith('version.json')
  ) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200) {
            return caches.match(event.request).then((cached) => cached || networkResponse);
          }
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return networkResponse;
        })
        .catch(async () => {
          const cached = await caches.match(event.request);
          return cached || new Response('Offline', { status: 503 });
        })
    );
    return;
  }

  // 4. Cache-First para assets com hash (JS/CSS de build — imutáveis)
  if (url.origin === self.location.origin && url.pathname.includes('/assets/')) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200) return networkResponse;
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return networkResponse;
        }).catch(() => new Response('Offline', { status: 503 }));
      })
    );
    return;
  }

  // 5. Cache-First para imagens locais (backgrounds, icons — mudam raramente)
  if (
    url.origin === self.location.origin &&
    (url.pathname.endsWith('.webp') ||
      url.pathname.endsWith('.png') ||
      url.pathname.endsWith('.svg') ||
      url.pathname.endsWith('.mp3'))
  ) {
    event.respondWith(
      caches.match(event.request).then((cached) => {
        if (cached) return cached;
        return fetch(event.request).then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200) return networkResponse;
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          return networkResponse;
        }).catch(() => new Response('Not found', { status: 404 }));
      })
    );
    return;
  }

  // 6. Network-First para o resto
  event.respondWith(
    fetch(event.request).catch(async () => {
      const cached = await caches.match(event.request);
      return cached || new Response('Offline', { status: 404 });
    })
  );
});
