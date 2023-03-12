//Current version
const VERSION = "1.0.0";

//Name for our app cache
const CACHE_NAME = "musicplayer";

//Assets to be cached
const cachedAssets = [
  "/etic_mobile/",
  "/etic_mobile/index.html",
  "/etic_mobile/app_logo.svg",
  "/etic_mobile/manifest.json",
  "/etic_mobile/images/icons-192.png",
  "/etic_mobile/images/icons-512.png",
  "/etic_mobile/images/icons-vector.svg",
  "/etic_mobile/images/maskable_icon.png",
  "/etic_mobile/images/screenshot1.png",
  "/etic_mobile/images/screenshot2.png",
];

const cachedAssetsDEV = [
  "/",
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

self.addEventListener("install", async (event) => {
  const cache = await caches.open(CACHE_NAME);
  await cache.addAll(cachedAssets);
  await self.skipWaiting();

  // Store the current version number in the cache
  await cache.put("version", new Response(VERSION));
});

self.addEventListener("activate", async (event) => {
  //Clean old cached versions still in memory.
  const oldCache = await caches.open(CACHE_NAME);
  if (oldCache) await oldCache.delete(CACHE_NAME);

  // Check the version number stored in the cache
  const cache = await caches.open(CACHE_NAME);
  const cachedVersion = await cache.match("version");
  const currentVersion = new Response(VERSION);

  console.log("activate", currentVersion);

  if (cachedVersion !== currentVersion) {
    // If the version numbers don't match it means there is an update, send update warning to clients
    await clients.claim();
    const clis = await self.clients.matchAll({ type: "window" });
    clis.forEach((client) => {
      client.postMessage({
        type: "update",
        message: "Update available!",
      });
    });
  }
});
self.addEventListener("fetch", async (event) => {
  const responsePromise = (async () => {
    const cachedResponse = await caches.match(event.request);
    return cachedResponse || fetch(event.request);
  })();

  event.respondWith(responsePromise);
});
