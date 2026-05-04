const CACHE_NAME = 'pokecraft-cache-v1.51.4';
const RUNTIME_CACHE = 'pokecraft-runtime-v1.51.4';
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './favicon.svg'
];

const SPRITE_HOSTS = new Set([
  'raw.githubusercontent.com',
  'play.pokemonshowdown.com'
]);

const putInRuntimeCache = async (request, response) => {
  if (!response || (response.status !== 200 && response.type !== 'opaque')) return;
  const cache = await caches.open(RUNTIME_CACHE);
  await cache.put(request, response.clone());
};

const cacheFirst = async (request) => {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  putInRuntimeCache(request, response);
  return response;
};

const staleWhileRevalidate = async (request) => {
  const cached = await caches.match(request);
  const network = fetch(request)
    .then((response) => {
      putInRuntimeCache(request, response);
      return response;
    })
    .catch(() => null);
  return cached || network || fetch(request);
};

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => Promise.all(
      cacheNames.map((cacheName) => {
        if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
          return caches.delete(cacheName);
        }
        return null;
      })
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  if (url.hostname.includes('firestore.googleapis.com') || url.hostname.includes('firebase')) {
    return;
  }

  if (SPRITE_HOSTS.has(url.hostname) && /\.(png|gif|webp|svg)$/i.test(url.pathname)) {
    event.respondWith(cacheFirst(event.request));
    return;
  }

  const isOwnStaticAsset =
    url.origin === self.location.origin && (
      url.pathname.includes('/assets/') ||
      /\.(png|jpg|jpeg|webp|svg|js|css|mp3|woff2?)$/i.test(url.pathname)
    );

  if (isOwnStaticAsset) {
    event.respondWith(cacheFirst(event.request));
    return;
  }

  if (event.request.mode === 'navigate' || url.pathname.endsWith('/index.html') || url.pathname.endsWith('/version.json')) {
    event.respondWith(staleWhileRevalidate(event.request));
    return;
  }

  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
