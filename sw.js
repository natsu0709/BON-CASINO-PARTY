// BON! CASINO party：ホーム画面のアプリ用（オフラインでも開けるようにする）
// ページ本体は「まずネットから最新版」、BGMやアイコンは一度読んだら保存して使う
const CACHE = 'bon-v1';
const CORE = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;   // Firebase・フォントなどはそのまま
  if (url.pathname.endsWith('.mp3')) return;     // BGMはブラウザに任せる（少しずつ読み込むため）
  // ページ本体：ネット優先（更新がすぐ反映される）。つながらないときは保存した版
  if (req.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname.endsWith('/')) {
    e.respondWith(fetch(req).then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put('./index.html', copy)); return res; })
      .catch(() => caches.match('./index.html')));
    return;
  }
  // BGM・アイコンなど：保存してあればそれを使う
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => {
    if (res.ok && !req.headers.get('range')) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
    return res;
  })));
});
