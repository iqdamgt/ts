// MIDNIGHT LAB - tampilan minimalis untuk HP. Dimuat setelah pwa.js.
// Aktif otomatis di layar sentuh; bisa dimatikan di Pengaturan (disimpan di localStorage 'mlab_mn').
(()=>{
const $=id=>document.getElementById(id);
const coarse=matchMedia('(pointer:coarse)').matches||matchMedia('(any-pointer:coarse)').matches||navigator.maxTouchPoints>0||Math.min(innerWidth,innerHeight)<600;
let on=coarse;try{const v=localStorage.getItem('mlab_mn');if(v!==null)on=v==='1'}catch(_){}

// 1) Kartu kesulitan: tampilkan baris pertama saja (rincian lengkap ada di Panduan)
function cards(){document.querySelectorAll('#mc button span').forEach(s=>{
 if(s.dataset.full===undefined)s.dataset.full=s.innerHTML;
 s.innerHTML=on?s.dataset.full.split('<br>')[0]:s.dataset.full})}

// 2) Cara Bermain: tiga kartu pendek (id gt dan gf tetap ada karena diisi oleh game.js)
function guide(){const g=document.querySelector('#gd .gb');if(!g)return;
 if(g.dataset.full===undefined)g.dataset.full=g.innerHTML;
 if(!on){g.innerHTML=g.dataset.full;return}
 const gt=($('gt')||{}).textContent||'10',gf=($('gf')||{}).textContent||'5';
 g.innerHTML=
  '<div class="mc"><h3>KONTROL</h3>Geser kiri: jalan<br>Geser kanan: melihat<br>Kanan bawah: LARI dan senter<br>Ketuk tulisan untuk interaksi</div>'+
  '<div class="mc"><h3>TUJUAN</h3>1. Jawab <b id="gt">'+gt+'</b> soal dengan benar<br>2. Ambil kunci di meja guru (ruang biru)<br>3. Buka pintu dan keluar</div>'+
  '<div class="mc"><h3>AWAS</h3>Salah <b id="gf">'+gf+'</b> kali = gagal<br>Disentuh hantu = diculik<br>Hantu muncul: sembunyi di lemari (E)</div>'}

function apply(){document.body.classList.toggle('mn',on);cards();guide()}

// 3) Saklar di Pengaturan
const ok=$('c_ok');
if(ok&&!$('c_mn')){const r=document.createElement('label');r.className='ck';r.id='c_mn_row';
 r.innerHTML='<input type="checkbox" id="c_mn"> Tampilan minimalis (HP)';
 ok.parentNode.insertBefore(r,ok);
 const c=r.querySelector('input');c.checked=on;
 c.onchange=()=>{on=c.checked;try{localStorage.setItem('mlab_mn',on?'1':'0')}catch(_){}apply()}}

// 4) Pengaturan: bungkus isi supaya judul dan tombol TUTUP selalu terlihat, isi di-scroll sendiri
function wrapCfg(){const bx=document.querySelector('#cfg .bx');if(!bx||bx.querySelector('.cfgw'))return;
 const h2=bx.querySelector('h2'),ok=$('c_ok');if(!h2||!ok)return;
 const w=document.createElement('div');w.className='cfgw';
 let n=h2.nextSibling;while(n&&n!==ok){const nx=n.nextSibling;w.appendChild(n);n=nx}
 bx.insertBefore(w,ok)}
const gear=$('cfgb');if(gear)gear.addEventListener('click',wrapCfg);
wrapCfg();

// 5) Lobi multiplayer: dua kolom (kiri: kode, mode, mapel; kanan: nama, pemain, chat, tombol)
function wrapLby(){const l=$('lby'),r=$('m_row');if(!l||!r||l.querySelector('.lbw'))return;
 const kids=[...l.children].slice(1),i=kids.indexOf(r);if(i<0)return;
 const w=document.createElement('div'),a=document.createElement('div'),b=document.createElement('div');
 w.className='lbw';a.className='lbl';b.className='lbr';
 kids.slice(0,i).forEach(n=>a.appendChild(n));kids.slice(i).forEach(n=>b.appendChild(n));
 w.appendChild(a);w.appendChild(b);l.appendChild(w)}
wrapLby();

apply();
})();
