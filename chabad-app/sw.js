/* Offline cache. Bump VERSION when files change. */
const VERSION = "cp-v7";
const FILES = ["./", "index.html", "css/style.css", "js/app.js", "data/content.js", "data/reference.js", "data/modules/m1.js", "data/modules/m4.js", "data/modules/m3.js", "data/modules/m5.js", "data/modules/m9.js", "data/modules/m2.js", "data/modules/m7.js", "data/modules/m8.js", "data/modules/m6.js", "data/modules/m11.js", "data/modules/m10.js", "data/modules/m13.js", "data/modules/m12.js", "manifest.webmanifest", "icons/icon.svg"];
self.addEventListener("install", e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
/* Network first, cache fallback: edits show up right away when online. */
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request).then(r => {
      if (r.ok && new URL(e.request.url).origin === location.origin) { const cp = r.clone(); caches.open(VERSION).then(c => c.put(e.request, cp)); }
      return r;
    }).catch(() => caches.match(e.request, { ignoreSearch: true }))
  );
});
