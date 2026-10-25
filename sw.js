const CACHE_NAME = "motor-competicion-v10";
const APP_SHELL = ["./", "./index.html", "./styles.css", "./app.js", "./live-events.html", "./live-events.js", "./live-dashboard.html", "./live-dashboard.js", "./race-schedule.html", "./race-schedule.js", "./manifest.webmanifest", "./language.js", "./logo/mc-motor-competicion.svg", "./logo/mc-motor-competicion.svg", "./icons/icon-192.svg", "./icons/icon-512.svg"];
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) return;
  if (new URL(request.url).pathname.endsWith("/data/site-data.json")) {
    const cacheKey = new Request(new URL("./data/site-data.json", self.registration.scope).toString());
    event.respondWith(fetch(request).then(response => {
      if (response.ok) caches.open(CACHE_NAME).then(cache => cache.put(cacheKey, response.clone()));
      return response;
    }).catch(() => caches.match(cacheKey)));
    return;
  }
  // HTML y recursos de interfaz: priorizar la versión publicada para evitar contenido antiguo persistente.
  if (request.mode === "navigate" || /\.(?:html|css|js|webmanifest|svg)(?:\?|$)/i.test(new URL(request.url).pathname + new URL(request.url).search)) {
    event.respondWith(fetch(request).then(response => {
      if (response.ok) caches.open(CACHE_NAME).then(cache => cache.put(request, response.clone()));
      return response;
    }).catch(() => caches.match(request)));
    return;
  }
  event.respondWith(caches.match(request).then(cached => cached || fetch(request).then(response => {
    if (response.ok) caches.open(CACHE_NAME).then(cache => cache.put(request, response.clone()));
    return response;
  })));
});