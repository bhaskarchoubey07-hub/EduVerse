// EduVerse AI Progressive Web App Service Worker (Safe Caching Strategy)
const CACHE_NAME = "eduverse-ai-v2-appshell";

// Safe essential assets to cache (Do NOT cache huge 3D assets or server APIs)
const PRECACHE_ASSETS = [
  "/",
  "/dashboard",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png"
];

// Install: cache essential app shell assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn("Pre-caching warning:", err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate: clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Safe Network-First with Cache Fallback for navigation, Stale-while-revalidate for static assets
self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Skip cross-origin requests
  if (url.origin !== self.origin) return;

  // NEVER cache API requests (AI tutor, answer evaluation) or heavy 3D files
  if (
    url.pathname.startsWith("/api/") ||
    url.pathname.endsWith(".glb") ||
    url.pathname.endsWith(".gltf") ||
    url.pathname.endsWith(".bin")
  ) {
    return;
  }

  // HTML page navigation: Network-first, fallback to cache
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(async () => {
          const cachedResponse = await caches.match(request);
          if (cachedResponse) return cachedResponse;
          // Fallback to dashboard or root if available
          const fallback = await caches.match("/dashboard");
          return fallback || new Response(
            `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Offline - EduVerse AI</title><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="background:#070a14;color:#f8fafc;font-family:sans-serif;padding:2rem;text-align:center;"><h1 style="color:#22d3ee">EduVerse AI</h1><p>You are currently offline. Check your network connection to explore live 3D labs and AI tutoring.</p><a href="/dashboard" style="display:inline-block;margin-top:1rem;padding:0.75rem 1.5rem;background:#8b5cf6;color:white;border-radius:0.75rem;text-decoration:none;">Go to Cached Dashboard</a></body></html>`,
            { headers: { "Content-Type": "text/html" } }
          );
        })
    );
    return;
  }

  // Static images, scripts, CSS: Cache first, update in background
  if (
    request.destination === "style" ||
    request.destination === "script" ||
    request.destination === "image" ||
    request.destination === "font"
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request)
          .then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              const clone = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
            }
            return networkResponse;
          })
          .catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
  }
});
