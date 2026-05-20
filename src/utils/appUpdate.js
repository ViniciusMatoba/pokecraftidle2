/**
 * forceAppRefresh
 * Limpa completamente o cache do browser (Service Worker + Cache API) e
 * recarrega a página com um query-string único para burlar qualquer CDN ou
 * cache de disco. Use sempre que o jogador clicar em "Atualizar".
 *
 * window.location.reload(true) NÃO funciona em browsers modernos — o
 * parâmetro `true` foi depreciado e é silenciosamente ignorado.
 */
export const forceAppRefresh = async () => {
  // 1. Desregistra todos os Service Workers e envia SKIP_WAITING
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations();
    await Promise.all(
      registrations.map(reg => {
        reg.waiting?.postMessage({ type: 'SKIP_WAITING' });
        reg.active?.postMessage({ type: 'SKIP_WAITING' });
        return reg.unregister();
      })
    );
  }

  // 2. Apaga todos os caches da Cache API
  if ('caches' in window) {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map(name => caches.delete(name)));
  }

  // 3. Recarrega com cache-busting na URL (ignora cache de CDN e disco)
  window.location.replace(`${window.location.pathname}?v=${Date.now()}`);
};
