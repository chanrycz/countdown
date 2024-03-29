const OFFLINE_VERSION = 2,
	CACHE_NAME = 'chanrycz-countdown',
	OFFLINE_URL = 'offline.html',
	PRECACHE_RESOURCES = [
		'offline'
	];

self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME)
		.then(cache => {
			return cache.addAll(PRECACHE_RESOURCES);
		})
	);
});

self.addEventListener('fetch', function(event) {
	event.respondWith(
		// Try the cache
		caches.match(event.request)
		.then(function(response) {
			// Fall back to network
			return response || fetch(event.request);
		}).catch(function() {
			// If both fail, show a generic fallback:
			return caches.match('offline');
		})
	);
});