// Service worker mínimo: hace la web instalable y muestra una página amable sin conexión.
// No guarda en caché la web ni la API: siempre se ve el contenido más reciente.
const CACHE = 'portfolio-shell-v1'
const SHELL = ['/offline.html', '/icons/icon-192.png']

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)))
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))),
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  // Solo las navegaciones (abrir una página): si no hay red, se muestra offline.html
  if (event.request.mode === 'navigate') {
    event.respondWith(fetch(event.request).catch(() => caches.match('/offline.html')))
  }
})
