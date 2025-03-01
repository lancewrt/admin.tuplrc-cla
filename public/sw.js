const CACHE_NAME = 'my-app-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/tuplogo.png',
  '/robots.txt',
  '/manifest.json',
  '/logo512.png',
  '/logo192.png',
  '/favicon.ico',
  '/clalogo.png',
  '/attendance-bg.png',
  '/asset-manifest.json',
  '/static/css/main.da0c1b62.css',
  '/static/css/main.da0c1b62.css.map',
  '/static/js/453.8ab44547.chunk.js',
  '/static/js/453.8ab44547.chunk.js.map',
  '/static/js/main.956adc38.js',
  '/static/js/main.956adc38.js.LICENSE.txt',
  '/static/js/main.956adc38.js.map',
  '/static/media/attendance-bg.aa1357bf47b94bd86243.png',
  '/static/media/clalogo.db3811bdf57666054c4a.png',
  '/static/media/edit-patron.1a20a027e34f472841d4ccaa519b113f.svg',
  '/static/media/fa-brands-400.1815e00441357e01619e.ttf',
  '/static/media/fa-brands-400.c210719e60948b211a12.woff2',
  '/static/media/fa-regular-400.89999bdf5d835c012025.woff2',
  '/static/media/fa-regular-400.914997e1bdfc990d0897.ttf',
  '/static/media/fa-solid-900.2463b90d9a316e4e5294.woff2',
  '/static/media/fa-solid-900.2582b0e4bcf85eceead0.ttf',
  '/static/media/fa-v4compatibility.da94ef451f4969af06e6.ttf',
  '/static/media/fa-v4compatibility.ea8f94e1d22e0d35ccd4.woff2',
  '/static/media/Inter_24pt-Regular.fcd4310affaf30346b67.ttf',
  '/static/media/tuplogo.bf503865e05a1b3a6263.png',
  

  // Add any other assets you need
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('caching assets');
      return cache.addAll(urlsToCache);
    })
  );
});




self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      console.log("Fetch event", response)
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('Service Worker Activated');
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
 