const CACHE_NAME = 'video-cache-v1';
const VIDEO_URL = 'media/logo.mp4'; // Update to your video path

// Install event: caching the video file
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.add(VIDEO_URL);
        })
    );
});

// Fetch event: serving the video from the cache
self.addEventListener('fetch', event => {
    if (event.request.url.endsWith(VIDEO_URL)) {
        event.respondWith(
            caches.match(event.request).then(response => {
                return response || fetch(event.request);
            })
        );
    }
});
