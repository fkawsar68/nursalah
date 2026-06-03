const CACHE='nursalah-v1';
const ASSETS=[
  '/nursalah/',
  '/nursalah/index.html',
  '/nursalah/onboarding.html',
  '/nursalah/home.html',
  '/nursalah/manifest.json',
  '/nursalah/icons/icon-192.png',
  '/nursalah/icons/icon-512.png'
];

self.addEventListener('install',e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting()));
});

self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});

self.addEventListener('fetch',e=>{
  // Don't cache Quran API calls
  if(e.request.url.includes('alquran.cloud')){
    e.respondWith(fetch(e.request).catch(()=>new Response('{"error":"offline"}',{headers:{'Content-Type':'application/json'}})));
    return;
  }
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{
    if(!e.request.url.startsWith('https://fkawsar68.github.io'))return res;
    return caches.open(CACHE).then(c=>{c.put(e.request,res.clone());return res});
  }).catch(()=>caches.match('/nursalah/home.html'))));
});
