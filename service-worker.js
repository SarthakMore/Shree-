const CACHE_NAME = 'shree-express-v17';
const APP_SHELL = [
    './',
    'index.html',
    'admin.html',
    'airport-tours.html',
    'fleet.html',
    'login.html',
    'shared-cabs.html',
    'manifest.webmanifest',
    'styles.css',
    'script.js',
    'images/logo.jpeg',
    'images/home-feature-car.jpg',
    'images/app-icon-192.png',
    'images/app-icon-512.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)));
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => Promise.all(
            cacheNames
                .filter((cacheName) => cacheName.startsWith('shree-express-') && cacheName !== CACHE_NAME)
                .map((cacheName) => caches.delete(cacheName))
        ))
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    const request = event.request;
    const url = new URL(request.url);

    if (request.method !== 'GET' || url.origin !== self.location.origin || url.pathname.startsWith('/api/')) {
        return;
    }

    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request).then((response) => {
                if (response.ok) {
                    const responseCopy = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(request, responseCopy));
                }
                return response;
            }).catch(async () => {
                const cachedPage = await caches.match(request, { ignoreSearch: true });
                return cachedPage || caches.match('index.html');
            })
        );
        return;
    }

    event.respondWith(
        caches.match(request, { ignoreSearch: true }).then((cachedResponse) => {
            if (cachedResponse) return cachedResponse;
            return fetch(request).then((response) => {
                if (response.ok) {
                    const responseCopy = response.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(request, responseCopy));
                }
                return response;
            });
        })
    );
});