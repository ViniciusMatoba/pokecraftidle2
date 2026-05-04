const CACHE_NAME = 'pokecraft-cache-v1.50.5';
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './favicon.svg'
];

// Instalação: Cacheia ativos estáticos iniciais
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('PWA: Instalando Service Worker e cacheando assets estáticos');
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// Ativação: Limpa caches antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('PWA: Removendo cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Estratégia de Fetch
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Ignorar requisições do Firebase/Firestore (Network-First implicito ou deixe o SDK lidar)
  if (url.hostname.includes('firestore.googleapis.com') || url.hostname.includes('firebase')) {
    return; // Deixa o navegador lidar normalmente
  }

  // Estratégia Cache-First para Ativos Estáticos (Imagens, JS, CSS do próprio domínio)
  const isStaticAsset = 
    url.origin === self.location.origin && (
    url.pathname.includes('/assets/') || 
    url.pathname.endsWith('.png') || 
    url.pathname.endsWith('.jpg') || 
    url.pathname.endsWith('.webp') || 
    url.pathname.endsWith('.svg') || 
    url.pathname.endsWith('.js') || 
    url.pathname.endsWith('.css') ||
    (url.pathname.endsWith('.json') && !url.pathname.endsWith('/version.json'))
  );

  if (isStaticAsset) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(event.request).then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200) {
            return networkResponse;
          }

          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return networkResponse;
        });
      })
    );
  } else {
    // Network-First para o resto (incluindo index.html para garantir atualizações)
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(event.request);
      })
    );
  }
});
