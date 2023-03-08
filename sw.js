const VERSION = 1;
const CACHE_NAME = "musicplayer";
const cachedAssets = [
  "/index.html",
  "/app_logo.svg",
  "/manifest.json",
  "/images/icons-192.png",
  "/images/icons-512.png",
  "/images/icons-vector.svg",
  "/images/maskable_icon.png",
  "/images/screenshot1.png",
  "/images/screenshot2.png",
];

self.addEventListener("install", (installEvent) => {
  console.log("install sw");
  const response = async () => {
    const cache = await caches.open(CACHE_NAME);
    cache.addAll(cachedAssets);
  };
  installEvent.waitUntil(response);
});

self.addEventListener("activate", (event) => {
  console.log("activate sw");
  const response = async () => {
    if ("navigationPreload" in self.registration) {
      await self.registration.navigationPreload.enable();
    }
  };
  event.waitUntil(response);
  self.clients.claim();
});
self.addEventListener("fetch", (event) => {
  console.log("fetch sw");
  const response = (async () => {
    try {
      const cachedResponse = await caches.match(event.request);
      return cachedResponse || fetch(event.request);
    } catch (error) {
      console.log("error fetching", error);
    }
  })();
  event.respondWith(response);
});
