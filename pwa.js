// MIDNIGHT LAB - perilaku aplikasi (PWA). Dimuat paling akhir di index.html.
(()=>{
const $=id=>document.getElementById(id),coarse=matchMedia('(pointer:coarse)').matches;
const standalone=matchMedia('(display-mode: fullscreen)').matches||matchMedia('(display-mode: standalone)').matches||navigator.standalone===true;

// 1) Service worker: hanya di HTTPS (GitHub Pages) atau localhost
if('serviceWorker' in navigator&&(location.protocol==='https:'||location.hostname==='localhost'))
 addEventListener('load',()=>navigator.serviceWorker.register('sw.js').catch(()=>{}));

// 2) Tombol "PASANG APLIKASI" (Chrome Android). Di iPhone: Bagikan > Tambah ke Layar Utama.
let dp=null;const pwi=$('pwi');
addEventListener('beforeinstallprompt',e=>{e.preventDefault();dp=e;if(pwi&&!standalone)pwi.hidden=false});
if(pwi)pwi.onclick=async()=>{if(!dp)return;dp.prompt();try{await dp.userChoice}catch(_){}dp=null;pwi.hidden=true};
addEventListener('appinstalled',()=>{if(pwi)pwi.hidden=true});

// 3) Layar penuh + kunci landscape saat menekan MULAI (HP, saat dibuka lewat browser)
const go=$('go');
if(go&&coarse&&!standalone)go.addEventListener('click',()=>{try{const d=document.documentElement;
 if(d.requestFullscreen)d.requestFullscreen({navigationUI:'hide'}).then(()=>screen.orientation&&screen.orientation.lock&&screen.orientation.lock('landscape')).catch(()=>{})}catch(_){}});

// 3b) Layar penuh juga pada ketukan pertama di mana saja (HP, lewat browser), supaya bar alamat tidak memotong layar
if(coarse&&!standalone)document.addEventListener('pointerup',()=>{try{const d=document.documentElement;
 if(d.requestFullscreen&&!document.fullscreenElement)d.requestFullscreen({navigationUI:'hide'}).then(()=>screen.orientation&&screen.orientation.lock&&screen.orientation.lock('landscape')).catch(()=>{})}catch(_){}},{once:true});

// 4) Jeda otomatis (Single Player) saat aplikasi pindah ke latar belakang / ada telepon masuk
function autoPause(){try{
 if(started&&!over&&!ended&&!MP&&!fl2){started=false;stopMalam();ghStop();
  for(const c in k)k[c]=0;mv.x=mv.y=0;$('ps').style.display='flex'}}catch(_){}}
document.addEventListener('visibilitychange',()=>{if(document.hidden)autoPause()});
addEventListener('pagehide',autoPause);

// 5) Anti gangguan sentuhan: menu tahan-lama, zoom cubit (iOS)
document.addEventListener('contextmenu',e=>{if(coarse&&!/^(INPUT|TEXTAREA)$/.test(e.target.tagName))e.preventDefault()});
document.addEventListener('gesturestart',e=>e.preventDefault());
})();
