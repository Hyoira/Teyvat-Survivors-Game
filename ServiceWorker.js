const cacheName = "Hyoira-Teyvat-Survivors-1.0.2"; // ← バージョンを更新！

const contentToCache = [
  "index.html",
  "Build/bb0d9ecdb05db3e84da20bd14a4f84dc.loader.js",
  "Build/fe83b67b59f07f2ea0a473848c3a344c.framework.js",
  "Build/6c27430e37b5b8bed623a064a56ef24f.data",
  "Build/e835965485a021a460b1e01f36734554.wasm",
  "TemplateData/style.css"
];

// インストール時：リソースをキャッシュ
self.addEventListener('install', function (event) {
  console.log('[Service Worker] Install');
  event.waitUntil(
    caches.open(cacheName)
      .then((cache) => {
        console.log('[Service Worker] Caching content');
        return cache.addAll(contentToCache);
      })
  );
});

// アクティベート時：古いキャッシュを削除
self.addEventListener('activate', function (event) {
  console.log('[Service Worker] Activate');
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== cacheName) {
          console.log('[Service Worker] Removing old cache:', key);
          return caches.delete(key);
        }
      }));
    })
  );
});

// フェッチ時：キャッシュ優先、なければネットワーク
self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});
