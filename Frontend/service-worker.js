const CACHE_NAME = 'stool-analysis-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/main.css',
  '/app.js',
  '/fallback-analyzer.html'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
      .catch(() => caches.match('/fallback-analyzer.html'))
  );
});