const CACHE_NAME = 'pokecraft-cache-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  // Os arquivos principais de CSS/JS serão cacheados pelo Vite automaticamente se usarmos um plugin PWA,
  // mas aqui faremos um interceptor genérico para assets em /public/
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Cache-first strategy for images and sounds
  if (
    url.pathname.endsWith('.png') || 
    url.pathname.endsWith('.jpg') || 
    url.pathname.endsWith('.webp') || 
    url.pathname.endsWith('.mp3') || 
    url.pathname.endsWith('.ogg') ||
    url.pathname.includes('/sounds/')
  ) {
    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) {
          return response;
        }
        return fetch(event.request).then((fetchResponse) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        });
      })
    );
  }
});
