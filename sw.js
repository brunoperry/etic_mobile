const VERSION = "1.0.0";
const CACHE_NAME = "musicplayer-cache";

// Define an array of files to cache
const urlsToCache = [
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

// Install event listener
self.addEventListener("install", async (event) => {
  try {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(urlsToCache);
    await self.skipWaiting();

    // Store the current version number in the cache
    await cache.put("version", new Response(VERSION));
  } catch (error) {
    console.log("error", error);
  }
});

// Activate event listener
self.addEventListener("activate", async (event) => {
  // // Check the version number stored in the cache
  const cache = await caches.open(CACHE_NAME);
  const cachedVersion = await cache.match("version");
  const currentVersion = new Response(VERSION);

  if (!cachedVersion || cachedVersion !== currentVersion) {
    // If the version numbers don't match, reload the page
    await clients.claim();
    // const clis = await self.clients.matchAll({ type: "window" }).then((clients) => {
    //   clients.forEach((client) => client.navigate(client.url));
    // });
    const clis = await self.clients.matchAll({ type: "window" });
    clis.forEach((cli) => cli.navigate(cli.url));
  }
});

// Fetch event listener
self.addEventListener("fetch", async (event) => {
  const responsePromise = (async () => {
    try {
      const cachedResponse = await caches.match(event.request);
      return cachedResponse || fetch(event.request);
    } catch (error) {
      console.log("error fetching", error);
    }
  })();
  event.respondWith(responsePromise);
});
