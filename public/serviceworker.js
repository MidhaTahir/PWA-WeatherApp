const CACHE_NAME = "version-1";
const urlsToCache = ["index.html", "offline.html"];

// Install service worker

// self means service worker itself
const self = this; //this is service worker
self.addEventListener("install", (event) => {
  // open cache and add index.html offline.html in it
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Opened cache");
        return cache.addAll(urlsToCache);
      })
      .catch(console.log)
  );
});

// Listen for request
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then(() => {
      // whenever something is there to fetch we simply fetch it
      // fetch is also a promise
      return fetch(event.request).catch(() => caches.match("offline.html")); //if error occures in offline mode then return offline.html
    })
  );
});
// Activate service worker
// remove previous caches and create new one
self.addEventListener("activate", (event) => {
  const cacheWhiteList = [];
  cacheWhiteList.push(CACHE_NAME); //keep new created cache
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhiteList.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
});
