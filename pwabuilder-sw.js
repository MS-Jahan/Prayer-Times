const CACHE = "v1.0.1";

// Import Workbox libraries
importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js');

// Skip waiting and immediately activate the new service worker
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

// Register a route that only caches HTML, CSS, JS, and image files from the specific URL
workbox.routing.registerRoute(
  ({ request, url }) => {
    // Match requests from the specific domain
    return url.origin === 'https://prayer-times.pages.dev' && (
      // Only cache HTML, CSS, JS, and common image formats
      request.destination === 'document' || // HTML
      request.destination === 'style' ||    // CSS
      request.destination === 'script' ||   // JavaScript
      request.destination === 'image'  ||     // Images (jpg, png, webp, gif)
      request.destination === 'font'    // Fonts
    );
  },
  new workbox.strategies.CacheFirst({
    cacheName: CACHE,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 100, // Limit the number of cached files
        maxAgeSeconds: 120 * 24 * 60 * 60, // Cache for 120 days
      }),
    ],
  })
);
