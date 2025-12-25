const CACHE_NAME = 'pwa-cache-v1';
const urlsToCache = [
    '/',
    '/css/style.css',
    '/javascripts/app.js',
    '/manifest.json'
    // Add other static assets like images or fallback pages here
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});

