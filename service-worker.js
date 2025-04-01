const CACHE_NAME = 'my-site-cache-v1';
const urlsToCache = [
    '/',
    '/styles.css',
    '/script.js',
    '/images/logo.png'
];

// Install the service worker and cache the specified assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                //return cache.addAll(urlsToCache);
                return cache.addAll(urlsToCache).catch(error => {
                    console.error('Failed to cache one or more resources:', error);
                });
            })
    );
});

// Fetch assets from the cache or network
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - return the response from the cached version
                if (response) {
                    return response;
                }
                return fetch(event.request); // Fall back to network
            })
    );
});

// Activate the service worker and clean up old caches
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
