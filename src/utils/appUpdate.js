const basePath = () => import.meta.env.BASE_URL || '/';

const freshUrl = (reason = 'update') => {
  const url = new URL(window.location.href);
  url.searchParams.set('v', String(Date.now()));
  url.searchParams.set('refresh', reason);
  return `${url.pathname}${url.search}${url.hash}`;
};

export const checkRemoteVersion = async () => {
  const versionUrl = `${basePath()}version.json?t=${Date.now()}`;
  const response = await fetch(versionUrl, {
    cache: 'no-store',
    headers: { 'Cache-Control': 'no-cache' },
  });
  if (!response.ok) throw new Error(`Version check failed: ${response.status}`);
  return response.json();
};

export const clearAppCaches = async () => {
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registrations.map(async (registration) => {
      registration.waiting?.postMessage({ type: 'SKIP_WAITING' });
      registration.active?.postMessage({ type: 'SKIP_WAITING' });
      await registration.unregister();
    }));
  }

  if ('caches' in window) {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map(cacheName => caches.delete(cacheName)));
  }
};

export const forceAppRefresh = async ({ reason = 'manual-update', delay = 150 } = {}) => {
  localStorage.setItem('pokecraft_last_reload', String(Date.now()));
  await clearAppCaches();

  window.setTimeout(() => {
    window.location.replace(freshUrl(reason));
  }, delay);
};
