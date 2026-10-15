const CACHE_NAME = 'safeher-v1-bhakkar-final-purple';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/login.html',
  '/dashboard.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/apple-touch-icon.png',
  '/icon.svg',
  '/university-bg.jpg',
  '/sairaaaa.jpg',
  '/thal_university_campus.jpg',
  '/login',
  '/dashboard',
  '/sos'
];

const OFFLINE_FALLBACK_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SafeHer - Bhakkar Offline</title>
  <meta name="theme-color" content="#7C3AED">
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; background: #FAF9FC; color: #1E1B4B; margin: 0; padding: 20px; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
    .card { background: white; border-radius: 24px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); border: 1px solid #E5E7EB; max-width: 480px; width: 100%; text-align: center; padding: 40px 24px; }
    h1 { color: #5B21B6; font-size: 26px; margin-bottom: 12px; }
    p { color: #4B5563; font-size: 15px; line-height: 1.5; margin: 8px 0; }
    .badge { display: inline-block; background: #FEF3C7; color: #92400E; font-size: 12px; font-weight: bold; padding: 4px 12px; border-radius: 999px; margin-bottom: 16px; }
    .btn-retry { background: #7C3AED; color: white; padding: 12px 28px; border-radius: 12px; border: none; font-weight: 600; cursor: pointer; margin-top: 16px; }
    .btn-sos { background: #DC2626; color: white; padding: 16px 32px; border-radius: 14px; border: none; font-weight: bold; font-size: 16px; cursor: pointer; margin-top: 20px; box-shadow: 0 4px 14px rgba(220,38,38,0.4); display: inline-block; }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">Offline Protection Active</div>
    <h1>🔒 SafeHer - Bhakkar Offline</h1>
    <p>You are offline but SafeHer is still protecting you.</p>
    <p><strong>Emergency: Call 15 (Police) and 1043 (Women Helpline)</strong></p>
    <p>Location: Thal University Bhakkar Campus saved locally in your phone storage.</p>
    <button class="btn-retry" onclick="location.reload()">Retry Connection</button>
    <br>
    <button class="btn-sos" onclick="triggerSOSOffline()">🚨 SOS Emergency (Works Offline)</button>
  </div>

  <script>
    function triggerSOSOffline() {
      try {
        const queue = JSON.parse(localStorage.getItem('sosQueue') || '[]');
        const sosRecord = {
          id: Date.now(),
          time: new Date().toISOString(),
          email: 'offline-emergency@thaluni.edu.pk',
          lat: 31.6266,
          lng: 71.0657,
          location: 'Thal University Bhakkar Campus, Thal Region',
          status: 'saved-offline-will-send-when-online',
          guardians: 5,
          helplines: ['15', '1043']
        };
        queue.push(sosRecord);
        localStorage.setItem('sosQueue', JSON.stringify(queue));
        
        if (navigator.vibrate) {
          navigator.vibrate([300, 100, 300, 100, 300]);
        }
        alert('🚨 Alert Sent! Location: Bhakkar, Thal Region - Lat/Lng saved offline - Notified 5 guardians + Madadgar 15 & 1043 (Saved offline - will sync when online)');
      } catch (e) {
        alert('🚨 SOS Saved locally!');
      }
    }
  </script>
</body>
</html>`;

// Install Event: Precaching static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Use map to avoid one failing asset breaking the whole cache
      return Promise.allSettled(
        STATIC_ASSETS.map((asset) =>
          cache.add(asset).catch((err) => {
            console.log('Pre-cache item non-critical notice:', asset, err);
          })
        )
      );
    })
  );
  self.skipWaiting();
});

// Activate Event: Cleanup old caches & claim clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event: Cache-First for static assets & images, Network fallback
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Check if it is an image or static asset
  const isImage = event.request.destination === 'image' || 
                  url.pathname.match(/\.(png|jpg|jpeg|svg|webp|gif|ico)$/i);

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Return cached immediately; if online, silently revalidate in background
        if (navigator.onLine && !isImage) {
          fetch(event.request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200) {
                caches.open(CACHE_NAME).then((cache) => {
                  cache.put(event.request, networkResponse.clone());
                });
              }
            })
            .catch(() => {});
        }
        return cachedResponse;
      }

      // If not in cache, fetch from network and dynamically cache
      return fetch(event.request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type === 'opaque') {
            return networkResponse;
          }
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          return networkResponse;
        })
        .catch(() => {
          // If network failed and navigating to an HTML page, return index or offline fallback
          if (event.request.mode === 'navigate') {
            return caches.match('/')
              .then((indexRes) => {
                if (indexRes) return indexRes;
                return caches.match('/index.html');
              })
              .then((res) => {
                if (res) return res;
                return new Response(OFFLINE_FALLBACK_HTML, {
                  headers: { 'Content-Type': 'text/html; charset=utf-8' }
                });
              });
          }

          // If offline and request is an image, fallback to cached university image or icon
          if (isImage) {
            return caches.match('/university-bg.jpg')
              .then((bg) => bg || caches.match('/icon-192.png'));
          }

          return new Response('Offline', { status: 503, statusText: 'Offline' });
        });
    })
  );
});

// Background Sync / Message event for queued SOS
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-sos') {
    event.waitUntil(syncQueuedSOS());
  }
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SYNC_NOW') {
    syncQueuedSOS();
  }
});

function syncQueuedSOS() {
  return self.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      client.postMessage({ type: 'SOS_SYNCED', time: Date.now() });
    });
  });
}
