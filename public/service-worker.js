self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open("app-cache").then((cache) => {
      return cache.addAll(["/", "/index.html", "/style.css", "/script.js", "/icon.svg"]);
    })
  );
});
