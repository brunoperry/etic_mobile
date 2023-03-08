const VERSION = 1;
const CACHE_NAME = "musicplayer";
const cachedAssets = [
  "index.html",
  "app_logo.svg",
  "manifest.json",
  "images/icons-192.png",
  "images/icons-512.png",
  "images/icons-vector.svg",
  "images/maskable_icon.png",
  "images/screenshot1.png",
  "images/screenshot2.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      cache.addAll(cachedAssets);
    })
  );
});

self.addEventListener("activate", (event) => {
  console.log("activate sw");
  event.waitUntil(
    (async () => {
      if ("navigationPreload" in self.registration) {
        await self.registration.navigationPreload.enable();
      }
    })()
  );
  self.clients.claim();
});
self.addEventListener("fetch", (event) => {
  console.log("fetch sw");
  event.respondWith(
    (async () => {
      try {
        const preloadResponse = await event.preloadResponse;
        if (preloadResponse) {
          return preloadResponse;
        }

        const networkResponse = await fetch(event.request);
        return networkResponse;
      } catch (error) {
        console.error("Fetch failed", error);
      }
    })()
  );
});
