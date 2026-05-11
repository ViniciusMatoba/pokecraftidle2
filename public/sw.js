const CACHE_NAME = 'pokecraft-cache-v1.56.1';
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
      return cache.addAll(STATIC_ASSETS).catch(err => {
        console.warn('PWA: Falha ao cachear assets iniciais:', err);
      });
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

  // 1. Ignorar requisições do Firebase/Firestore e Vite Dev Server
  if (
    url.hostname.includes('firestore.googleapis.com') || 
    url.hostname.includes('firebase') ||
    url.pathname.includes('/@vite/') ||
    url.pathname.includes('/@react-refresh') ||
    url.pathname.includes('/node_modules/')
  ) {
    return;
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
        }).catch(() => {
          // Se falhar o fetch e não tiver cache, retorna nada (deixa o erro de rede padrão)
          // Mas respondWith EXIGE uma Response ou Promise<Response>.
          // Para evitar o TypeError, podemos retornar uma resposta genérica ou não chamar respondWith.
          return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
        });
      })
    );
  } else {
    // Network-First para o resto (incluindo index.html para garantir atualizações)
    event.respondWith(
      fetch(event.request).catch(async () => {
        const cached = await caches.match(event.request);
        if (cached) return cached;
        // Retorna uma resposta válida para evitar erro de conversão
        return new Response('Network Error', { status: 404 });
      })
    );
  }
});
