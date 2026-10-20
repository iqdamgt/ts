// MIDNIGHT LAB - service worker (offline + pemasangan sebagai aplikasi)
// PENTING: setiap kali mengganti file audio/gambar, naikkan angka versi V di bawah (mlab-v2, mlab-v3, ...).
// Kode (html/js/css) selalu diambil dari jaringan dulu, jadi pembaruan kode otomatis terpakai.
const V='mlab-v9';
const CORE=["./", "apple-touch-icon.png", "aset.js", "cerita.js", "cerita2.js", "cutscene3d.js", "cutscene_akhir.js", "cutscene_awal.js", "fitur.js", "game.js", "icon-192.png", "icon-512.png", "icon-maskable-512.png", "index.html", "mobile.css", "mobile.js", "manifest.webmanifest", "mp.js", "mp2.js", "pwa.js", "soal.js", "style.css", "tentang.js", "thumbnail.jpg", "title.png"];
const MEDIA=["ambil.mp3", "backsound.mp3", "badan_full.png", "berhasil.mp3", "bukapintu.mp3", "cihuy.mp3", "con.mp3", "fah1.mp3", "fah2.mp3", "finish.mp3", "gagal.mp3", "glitch.mp3", "gurumarah.mp3", "hantu.mp3", "hantu.png", "jumpscare.mp3", "kaki-kanan_full.png", "kaki-kiri_full.png", "kepala_full.png", "kunci.mp3", "l.mp3", "langkah.mp3", "lemaribuka.mp3", "lemaritutup.mp3", "motor.wav", "night.mp3", "oke.mp3", "oni.mp3", "oni.png", "pintu-guru.mp3", "poster1.png", "poster10.png", "poster11.png", "poster12.png", "poster13.png", "poster14.png", "poster15.png", "poster2.png", "poster3.png", "poster4.png", "poster5.png", "poster6.png", "poster7.png", "poster8.png", "poster9.png", "ringtone.mp3", "selimut.png", "senter.mp3", "shock.mp3", "sleeping.mp3", "takotnyee.mp3", "tangan-kanan_full.png", "tangan-kiri_full.png", "teriak.mp3", "tindeck.mp3", "yeay.mp3"];
const LIBS=['https://cdnjs.cloudflare.com/ajax/libs/peerjs/1.5.4/peerjs.min.js','https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'];
async function pool(c,list,n){let i=0;await Promise.all(Array.from({length:n},async()=>{while(i<list.length){const u=list[i++];try{await c.add(new Request(u,{cache:'reload'}))}catch(e){}}}))}
self.addEventListener('install',e=>{e.waitUntil((async()=>{const c=await caches.open(V);
 await pool(c,CORE,4);
 for(const u of LIBS){try{const r=await fetch(u,{mode:'cors'});if(r.ok)await c.put(u,r)}catch(e){}}
 await pool(c,MEDIA,4);self.skipWaiting()})())});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{for(const k of await caches.keys())if(k!==V&&k.startsWith('mlab-'))await caches.delete(k);await self.clients.claim()})())});
async function netFirst(r){const c=await caches.open(V);try{const n=await fetch(r);if(n&&n.ok)c.put(r,n.clone());return n}catch(e){const h=await c.match(r,{ignoreSearch:true});if(h)return h;if(r.mode==='navigate'){const i=await c.match('index.html',{ignoreSearch:true})||await c.match('./',{ignoreSearch:true});if(i)return i}throw e}}
async function cacheFirst(r){const c=await caches.open(V);const h=await c.match(r,{ignoreSearch:true});if(h)return h;const n=await fetch(r);if(n&&n.ok&&n.status===200)c.put(r,n.clone());return n}
// <audio>/<video> meminta potongan (Range). Jika file sudah ada di cache, jawab dengan 206 dari cache.
async function rangeRes(r){const c=await caches.open(V);const h=await c.match(r.url,{ignoreSearch:true});if(!h)return fetch(r);
 const b=await h.blob(),m=/bytes=(\d*)-(\d*)/.exec(r.headers.get('range')||'');if(!m)return h;
 let s=m[1]===''?0:+m[1],e2=m[2]===''?b.size-1:Math.min(+m[2],b.size-1);if(m[1]===''&&m[2]!==''){s=Math.max(0,b.size-+m[2]);e2=b.size-1}
 return new Response(b.slice(s,e2+1),{status:206,statusText:'Partial Content',headers:{'Content-Type':h.headers.get('Content-Type')||'application/octet-stream','Content-Range':'bytes '+s+'-'+e2+'/'+b.size,'Content-Length':String(e2-s+1),'Accept-Ranges':'bytes'}})}
self.addEventListener('fetch',e=>{const r=e.request;if(r.method!=='GET')return;const u=new URL(r.url);
 if(u.origin!==location.origin&&!LIBS.includes(r.url))return; // Apps Script, server PeerJS, dll tidak disentuh
 if(r.headers.has('range')&&u.origin===location.origin){e.respondWith(rangeRes(r));return}
 const code=r.mode==='navigate'||/\.(html|js|css|webmanifest)$/.test(u.pathname)||u.pathname.endsWith('/');
 e.respondWith(code?netFirst(r):cacheFirst(r))});
