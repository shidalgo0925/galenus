// PWA deshabilitada: limpiar caches y desregistrar el Service Worker

self.addEventListener('install', (event) => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    try {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((name) => caches.delete(name)));
      const clientsList = await self.clients.matchAll({ includeUncontrolled: true });
      for (const client of clientsList) {
        client.navigate(client.url);
      }
      await self.registration.unregister();
    } catch (e) {
      // no-op
    }
  })());
});

self.addEventListener('fetch', () => {});

