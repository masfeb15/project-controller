// Service worker: cache hanya kerangka aplikasi. Data Google Sheet selalu diambil baru.
const VER='pc-v1';
const SHELL=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VER).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==VER).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=='GET'||u.origin!==location.origin) return; // Google Sheet, font, dll: langsung ke jaringan
  // Network-first: selalu coba versi terbaru, cache hanya dipakai saat offline
  e.respondWith(fetch(r).then(res=>{if(res.ok){const cp=res.clone();caches.open(VER).then(c=>c.put(r,cp))}return res}).catch(()=>caches.match(r).then(m=>m||caches.match('./index.html'))));
});
