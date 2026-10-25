// BON! CASINO party：ホーム画面のアプリ用（オフラインでも開けるようにする）
// ページ本体と設定ファイルは「いつもネットの最新版」。つながらないときだけ保存した版を使う
const CACHE = 'bon-v3';
const CORE = ['./', './index.html', './icon-192.png', './icon-512.png', './apple-touch-icon.png'];

self.addEventListener('install', e => {
  // 1つ読めなくてもインストールは続ける
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(CORE.map(u => c.add(u).catch(() => {})))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;                 // Firebase・フォントなどはそのまま
  if (url.pathname.endsWith('.mp3')) return;                  // BGMはブラウザに任せる
  if (url.pathname.endsWith('.webmanifest') || url.pathname.endsWith('sw.js')) return;   // アプリの設定は必ず最新を読む
  // ネット優先。取れたら保存し、つながらないときは保存した版
  e.respondWith(fetch(req).then(res => {
    if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req.mode === 'navigate' ? './index.html' : req, copy)); }
    return res;
  }).catch(() => caches.match(req.mode === 'navigate' ? './index.html' : req).then(r => r || caches.match('./index.html'))));
});
