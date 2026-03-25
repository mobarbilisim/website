// Offline service worker for PWA
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('mobar-offline').then((cache) => {
      // Offline iken gösterilecek fallback sayfası ya da sadece root
      return cache.addAll(['/']);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    }).catch(() => {
      // Eğer kullanıcı tamamen internetsizse sadece root sayfasını (veya offline html) ver.
      return caches.match('/');
    })
  );
});
