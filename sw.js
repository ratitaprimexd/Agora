/* Service worker de Ágora: guarda la app para usarla sin conexión */
const CACHE = 'agora-v9';
const ARCHIVOS = ['./', './index.html', './styles.css', './data.js', './app.js', './manifest.webmanifest',
  './logo.webp', './icon-192.png', './icon-512.png', './icon-maskable-512.png', './apple-touch-icon.png',
  './inicio.webp', './elysia.webp', './provincias.webp', './esfera.webp', './fondo.webp'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARCHIVOS))); self.skipWaiting(); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(res => {
    const copia = res.clone();
    if (res.ok && new URL(e.request.url).origin === location.origin) caches.open(CACHE).then(c => c.put(e.request, copia));
    return res;
  }).catch(() => caches.match('./index.html'))));
});
