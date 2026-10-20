// MIDNIGHT LAB.. - fitur tambahan v2 (dimuat setelah tentang.js, sebelum pwa.js)
// Isi: rekap hasil, rekor & statistik (localStorage), leaderboard online (Code.gs), pengaturan grafis/kontrol/tampilan,
// stamina lari, mode latihan, petunjuk dekat hantu (detak jantung + getar), cutscene tertangkap/ending, gyro, chat emoji.
// Fungsi di game.js memanggil modul ini lewat window.RK (selalu dicek dulu: window.RK&&RK.xxx).
(function(){
const EMO=['😁','😂','😱','🫣','😵‍💫','👍','👏','👻'];
const DNAMA={mudah:'Mudah',sedang:'Sedang',sulit:'Sulit',latihan:'Latihan'};
const ENAMA={normal:'Normal',jelek:'Ending Jelek: Remedial Lagi',rahasia:'Ending Rahasia: Penjaga Lab',latihan:'Latihan'};
const el=(t,c,x)=>{const e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e};
const jget=(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}};
const jset=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
const fmt=s=>{s=Math.max(0,Math.round(s));return Math.floor(s/60)+':'+String(s%60).padStart(2,'0')};

// ===== Pengaturan: nilai bawaan tambahan (CFG dibuat di mp2.js) =====
const DEF={gfx:tc?'sedang':'tinggi',menu3d:true,hb:true,vib:true,gyro:false,gs:1,ginv:false,big:false,hc:false,cs:1,bo:0,lefty:false,fixj:false};
for(const q in DEF)if(CFG[q]===undefined)CFG[q]=DEF[q];
CFG.cs=Math.max(0.7,Math.min(1.6,+CFG.cs||1));CFG.bo=Math.max(0,Math.min(120,+CFG.bo||0));CFG.gs=Math.max(0.5,Math.min(2.5,+CFG.gs||1));
if(!['rendah','sedang','tinggi'].includes(CFG.gfx))CFG.gfx=DEF.gfx;

// ===== Rekap, rekor, statistik =====
let G={t:0,hides:0,map:{},done:false,mapel:'rpl',diff:'sedang',mp:false,lat:false,end:'normal'};
const loadSt=()=>jget('mlab_stats',{});
function begin(){
 STAM=100;EXH=false;stamD=0;
 G={t:0,hides:0,map:{},done:false,mapel:(typeof CUR_MAPEL!=='undefined'?CUR_MAPEL:'rpl'),diff:curD,mp:MP,lat:!!(DIFF[curD]&&DIFF[curD].lat),end:'normal'};
 if(G.lat&&!MP)setTimeout(()=>banner('MODE LATIHAN<br>Tanpa hantu dan tanpa batas salah. Santai dan belajar!',5000),400)}
function ans(sl,ord,i,ok){
 const e=G.map[sl.q]||(G.map[sl.q]={q:sl.q,right:sl.o[sl.b],picks:[],solved:false});
 if(ok)e.solved=true;else e.picks.push(sl.o[ord[i]])}
function endType(){ // dipanggil saat pintu dibuka (menang)
 G.done=true;if(G.lat)return G.end='normal';
 const lim=Math.ceil(FAIL_AT*0.6);
 return G.end=(wrong===0&&G.hides===0)?'rahasia':(wrong>=lim?'jelek':'normal')}
function calc(win){
 const mult=G.diff==='mudah'?1:G.diff==='sulit'?1.5:G.diff==='latihan'?1:1.25,benar=found,salah=wrong,sec=Math.round(G.t);
 let s=benar*100-salah*30;
 if(win){s+=500+Math.min(600,Math.max(0,Math.round((TOTAL*45-sec)*1.5)));if(G.end==='rahasia')s+=300}
 return{win,benar,salah,total:TOTAL,sec,skor:Math.max(0,Math.round(s*mult)),mapel:G.mapel,diff:G.diff,end:G.lat?'latihan':G.end,hides:G.hides}}
function record(res){
 if(MP)return res;const s=loadSt();
 if(G.lat){s.practice=(s.practice||0)+1;jset('mlab_stats',s);return res}
 s.games=(s.games||0)+1;if(res.win)s.wins=(s.wins||0)+1;else s.fails=(s.fails||0)+1;
 s.benar=(s.benar||0)+res.benar;s.salah=(s.salah||0)+res.salah;
 const key=res.mapel+'|'+res.diff;s.play=s.play||{};s.play[key]=(s.play[key]||0)+1;
 if(res.win){s.best=s.best||{};const b=s.best[key];
  res.recT=!b||res.sec<b.t;res.recS=!b||res.skor>b.s;res.prev=b||null;
  s.best[key]={t:b?Math.min(b.t,res.sec):res.sec,s:b?Math.max(b.s,res.skor):res.skor};
  s.end=s.end||{};s.end[res.end]=(s.end[res.end]||0)+1}
 jset('mlab_stats',s);return res}

function wrongList(box){
 const a=Object.values(G.map).filter(e=>e.picks.length);box.textContent='';
 if(!a.length){box.appendChild(el('div','rrn','Tidak ada soal yang dijawab salah. Mantap!'));return}
 a.forEach(e=>{const d=el('div','rrw'),ql=e.q.split('\n');
  d.appendChild(el('div','',ql[0]));
  if(ql.length>1){const p=el('pre','',ql.slice(1).join('\n'));d.appendChild(p)}
  const b=el('div','bad','Jawabanmu: '+e.picks[0]+(e.picks.length>1?' (salah '+e.picks.length+' kali)':''));d.appendChild(b);
  d.appendChild(el('div','good','Jawaban benar: '+e.right));
  d.appendChild(el('div','',e.solved?'Akhirnya benar setelah mencoba lagi.':'Belum sempat dijawab benar.')).style.opacity='.7';
  box.appendChild(d)})}

let lastRes=null;
function showRecap(res){
 lastRes=res;const $r=id=>document.getElementById(id);
 $r('rr_h').textContent=res.win?(res.end==='latihan'?'LATIHAN SELESAI':'BERHASIL KELUAR!'):(res.g!==undefined&&res.fw?'GAGAL!':'KAMU DICULIK!');
 $r('rr_e').textContent=res.win?(res.end==='latihan'?'Mode latihan tidak dicatat di rekor dan peringkat.':'Ending: '+ENAMA[res.end]):(res.fw?'Kamu menjawab terlalu banyak soal dengan salah.':GHN[res.g]+' menculikmu.');
 const g=$r('rr_g');g.textContent='';
 for(const[v,l]of[[res.skor,'Skor'],[fmt(res.sec),'Waktu'],[res.benar+'/'+res.total,'Benar'],[res.salah,'Salah'],[MAPEL[res.mapel]||res.mapel,'Mapel'],[DNAMA[res.diff]||res.diff,'Level']]){
  const d=el('div');d.appendChild(el('b','',v));d.appendChild(el('small','',l));g.appendChild(d)}
 const n=$r('rr_n');n.textContent='';
 if(res.recT)n.appendChild(el('div','rrn','🏅 Rekor waktu baru!'+(res.prev?' (sebelumnya '+fmt(res.prev.t)+')':'')));
 if(res.recS)n.appendChild(el('div','rrn','⭐ Skor terbaik baru!'+(res.prev?' (sebelumnya '+res.prev.s+')':'')));
 if(res.end==='rahasia')n.appendChild(el('div','rrn','🌟 Ending rahasia terbuka!'));
 wrongList($r('rr_w'));
 const can=res.win&&res.end!=='latihan'&&!MP;$r('rr_sub').style.display=can?'block':'none';
 if(can){const p=jget('mlab_player',{});$r('rr_nm').value=p.n||'';$r('rr_kl').value=p.k||'';$r('rr_ms').textContent='';$r('rr_send').disabled=false}
 $r('rr').style.display='flex';$r('rr').scrollTop=0}

// kegagalan: cutscene tertangkap sesuai hantu, lalu rekap
function failEnd(g,fw){
 const res=record(Object.assign(calc(false),{g,fw}));
 story(caughtScript(g,fw),()=>showRecap(res),null)}
function practiceDone(){
 if(MP||over||ended)return;ended=true;locked=true;G.done=true;stopPlay();
 showRecap(record(calc(true)))}
function winEnd(et){G.end=et;showRecap(record(calc(true)))}

// ===== Online: kirim skor & papan peringkat (Code.gs) =====
const pend=()=>jget('mlab_pending',[]);
function post(o){return fetch(API_URL,{method:'POST',body:JSON.stringify(o)}).then(r=>r.json())}
function flush(){const q=pend();if(!q.length||!navigator.onLine)return;
 const o=q[0];post(o).then(d=>{if(d&&(d.ok||d.err==='Duplikat')){jset('mlab_pending',pend().slice(1));flush()}}).catch(()=>{})}
addEventListener('online',flush);setTimeout(flush,4000);
document.getElementById('rr_send').onclick=()=>{
 const r=lastRes,n=document.getElementById('rr_nm').value.trim(),k=document.getElementById('rr_kl').value.trim(),m=document.getElementById('rr_ms');
 if(!r)return;if(!n||!k){m.style.color='#e66';m.textContent='Isi nama dan kelas dulu.';return}
 jset('mlab_player',{n,k});const o={action:'skor',nama:n,kelas:k,mapel:r.mapel,level:r.diff,skor:r.skor,detik:r.sec,benar:r.benar,salah:r.salah,total:r.total,ending:r.end};
 const b=document.getElementById('rr_send');b.disabled=true;m.style.color='#7d7';m.textContent='Mengirim...';
 post(o).then(d=>{if(!d.ok)throw d.err;m.textContent='Skor terkirim! Lihat di REKOR & PERINGKAT.'}).catch(e=>{
  const q=pend();q.push(o);jset('mlab_pending',q.slice(-20));m.style.color='#fc6';
  m.textContent=(typeof e==='string'?'Ditolak: '+e:'Belum ada koneksi. Skor disimpan dan dikirim otomatis saat online.')})};
document.getElementById('rr_go').onclick=()=>{location.hash='menu';location.reload()};
document.getElementById('rr_rk').onclick=()=>{openRk('lb')};

// ===== Panel REKOR & PERINGKAT =====
const rkb=document.getElementById('rkb'),rkc=document.getElementById('rkc');let tab='me',lbQ={m:'',l:'',k:''};
function rkTab(t){tab=t;for(const b of document.querySelectorAll('#rkt button'))b.classList.toggle('on',b.dataset.t===t);t==='me'?rkMe():rkLb()}
function openRk(t){const fromRecap=document.getElementById('rr').style.display==='flex';rkb.dataset.from=fromRecap?'rr':'ov';
 document.getElementById('ov').style.display='none';rkb.style.display='flex';rkTab(t||'me')}
function closeRk(){rkb.style.display='none';if(rkb.dataset.from==='rr'){document.getElementById('rr').style.display='flex'}else document.getElementById('ov').style.display='flex'}
document.getElementById('rkbtn').onclick=()=>openRk('me');document.getElementById('rkx').onclick=closeRk;
for(const b of document.querySelectorAll('#rkt button'))b.onclick=()=>rkTab(b.dataset.t);
function rkMe(){
 const s=loadSt();rkc.textContent='';
 const box=el('div','abc');
 for(const[l,v]of[['Total permainan',s.games||0],['Berhasil keluar',s.wins||0],['Gagal / diculik',s.fails||0],['Sesi latihan',s.practice||0],['Total jawaban benar',s.benar||0],['Total jawaban salah',s.salah||0],
  ['Ending normal',(s.end&&s.end.normal)||0],['Ending jelek',(s.end&&s.end.jelek)||0],['Ending rahasia',(s.end&&s.end.rahasia)||0]]){
  const r=el('div','rkr');r.appendChild(el('span','',l));r.appendChild(el('b','',v));box.appendChild(r)}
 rkc.appendChild(box);
 rkc.appendChild(el('h2','','REKOR PER MAPEL DAN LEVEL'));
 const keys=Object.keys(s.play||{});
 if(!keys.length)rkc.appendChild(el('div','abc','Belum ada permainan tercatat. Selesaikan satu game dulu!'));
 else{const t=el('table','rkt2'),h=el('tr');['Mapel','Level','Waktu terbaik','Skor terbaik','Main'].forEach(x=>h.appendChild(el('th','',x)));t.appendChild(h);
  keys.sort().forEach(k=>{const[m,d]=k.split('|'),b=(s.best||{})[k],r=el('tr');
   [MAPEL[m]||m,DNAMA[d]||d,b?fmt(b.t):'-',b?b.s:'-',s.play[k]+'x'].forEach(x=>r.appendChild(el('td','',x)));t.appendChild(r)});
  const w=el('div','abc');w.style.overflowX='auto';w.appendChild(t);rkc.appendChild(w)}
 const rs=el('button','sm2','HAPUS STATISTIK');rs.onclick=()=>{if(confirm('Hapus semua rekor dan statistik di perangkat ini?')){localStorage.removeItem('mlab_stats');rkMe()}};
 rkc.appendChild(rs)}
function sel(opts,val,fn){const s=document.createElement('select');opts.forEach(([v,t])=>{const o=el('option','',t);o.value=v;s.appendChild(o)});s.value=val;s.onchange=()=>fn(s.value);return s}
function rkLb(kelasList){
 rkc.textContent='';
 const f=el('div','abc rkf');
 const mp=[['','Semua mapel'],...Object.keys(MAPEL).map(k=>[k,MAPEL[k]])],lv=[['','Semua level'],['mudah','Mudah'],['sedang','Sedang'],['sulit','Sulit']],kl=[['','Semua kelas'],...(kelasList||[]).map(k=>[k,k])];
 f.appendChild(sel(mp,lbQ.m,v=>{lbQ.m=v;rkLb()}));f.appendChild(sel(lv,lbQ.l,v=>{lbQ.l=v;rkLb()}));f.appendChild(sel(kl,lbQ.k,v=>{lbQ.k=v;rkLb(kelasList)}));
 rkc.appendChild(f);const out=el('div','abc','Memuat peringkat...');rkc.appendChild(out);
 const key='mlab_lb_'+lbQ.m+'|'+lbQ.l+'|'+lbQ.k,url=API_URL+'?action=skor&mapel='+encodeURIComponent(lbQ.m)+'&level='+encodeURIComponent(lbQ.l)+'&kelas='+encodeURIComponent(lbQ.k);
 const draw=(d,cached)=>{
  if(!kelasList&&d.kelas&&d.kelas.length&&tab==='lb'){rkLb(d.kelas);return}
  out.textContent='';if(cached)out.appendChild(el('div','rrn','Offline: menampilkan data tersimpan terakhir.')).style.color='#fc6';
  if(!d.skor.length){out.appendChild(document.createTextNode('Belum ada skor untuk filter ini. Jadilah yang pertama!'));return}
  const t=el('table','rkt2'),h=el('tr');['#','Nama','Kelas','Skor','Waktu','Mapel / Level'].forEach(x=>h.appendChild(el('th','',x)));t.appendChild(h);
  d.skor.forEach((r,i)=>{const tr=el('tr');[i+1,r.nama,r.kelas,r.skor,fmt(r.detik),(MAPEL[r.mapel]||r.mapel)+' / '+(DNAMA[r.level]||r.level)].forEach(x=>tr.appendChild(el('td','',x)));t.appendChild(tr)});
  out.style.overflowX='auto';out.appendChild(t)};
 fetch(url).then(r=>r.json()).then(d=>{if(!d.ok||!d.skor)throw 0;jset(key,d);draw(d,false)}).catch(()=>{const c=jget(key,null);if(c)draw(c,true);else out.textContent='Peringkat belum bisa dimuat. Periksa koneksi, atau Code.gs belum diperbarui (lihat README).'})}

// ===== Pengaturan tambahan =====
(function(){
 const ok=document.getElementById('c_ok');
 ok.insertAdjacentHTML('beforebegin',
 '<h3>GRAFIS</h3>'+
 '<label>Kualitas grafis<select id="c_gfx"><option value="rendah">Rendah (HP lemah)</option><option value="sedang">Sedang</option><option value="tinggi">Tinggi</option></select></label>'+
 '<label class="ck"><input type="checkbox" id="c_m3d"> Latar menu 3D</label>'+
 '<h3>PETUNJUK HANTU</h3>'+
 '<label class="ck"><input type="checkbox" id="c_hb"> Detak jantung saat hantu mendekat</label>'+
 '<label class="ck"><input type="checkbox" id="c_vib"> Getar HP saat hantu mendekat (Android)</label>'+
 '<h3>KONTROL HP</h3>'+
 '<label>Ukuran tombol dan joystick <span id="c_csv"></span><input type="range" id="c_cs" min="0.7" max="1.6" step="0.1"></label>'+
 '<label>Tinggi tombol dari bawah <span id="c_bov"></span><input type="range" id="c_bo" min="0" max="120" step="10"></label>'+
 '<label class="ck"><input type="checkbox" id="c_lefty"> Mode kidal (tombol di kiri, joystick di kanan)</label>'+
 '<label class="ck"><input type="checkbox" id="c_fixj"> Joystick tetap di satu posisi</label>'+
 '<label class="ck"><input type="checkbox" id="c_gyro"> Gyro: gerakkan HP untuk melihat sekeliling</label>'+
 '<label>Sensitivitas gyro <span id="c_gsv"></span><input type="range" id="c_gs" min="0.5" max="2.5" step="0.1"></label>'+
 '<label class="ck"><input type="checkbox" id="c_ginv"> Balik arah gyro</label><div id="c_gnote"></div>'+
 '<h3>TAMPILAN</h3>'+
 '<label class="ck"><input type="checkbox" id="c_big"> Teks soal lebih besar</label>'+
 '<label class="ck"><input type="checkbox" id="c_hc"> Kontras tinggi</label>');
 const g=id=>document.getElementById(id);
 function sync(){g('c_gfx').value=CFG.gfx;g('c_m3d').checked=CFG.menu3d!==false;g('c_hb').checked=!!CFG.hb;g('c_vib').checked=!!CFG.vib;
  g('c_cs').value=CFG.cs;g('c_csv').textContent=CFG.cs.toFixed(1)+'x';g('c_bo').value=CFG.bo;g('c_bov').textContent=CFG.bo+' px';
  g('c_lefty').checked=!!CFG.lefty;g('c_fixj').checked=!!CFG.fixj;g('c_gyro').checked=!!CFG.gyro;g('c_gs').value=CFG.gs;g('c_gsv').textContent=CFG.gs.toFixed(1)+'x';
  g('c_ginv').checked=!!CFG.ginv;g('c_big').checked=!!CFG.big;g('c_hc').checked=!!CFG.hc}
 const chk=(id,key)=>{g(id).onchange=e=>{CFG[key]=e.target.checked;saveCfg();applyAll()}};
 const rng=(id,key,lab,f)=>{g(id).oninput=e=>{CFG[key]=+e.target.value;saveCfg();applyAll();g(lab).textContent=f(CFG[key])}};
 g('c_gfx').onchange=e=>{CFG.gfx=e.target.value;saveCfg();applyAll()};
 chk('c_m3d','menu3d');chk('c_hb','hb');chk('c_vib','vib');chk('c_lefty','lefty');chk('c_fixj','fixj');chk('c_ginv','ginv');chk('c_big','big');chk('c_hc','hc');
 rng('c_cs','cs','c_csv',v=>v.toFixed(1)+'x');rng('c_bo','bo','c_bov',v=>v+' px');rng('c_gs','gs','c_gsv',v=>v.toFixed(1)+'x');
 g('c_vib').parentNode.style.display=(navigator.vibrate&&tc)?'':'none';
 g('c_gyro').onchange=e=>{const on=e.target.checked,n=g('c_gnote');n.textContent='';
  if(!on){CFG.gyro=false;saveCfg();applyAll();return}
  const D=window.DeviceMotionEvent;if(!D){e.target.checked=false;n.textContent='Perangkat ini tidak mendukung sensor gerak.';return}
  (typeof D.requestPermission==='function'?D.requestPermission().then(r=>r==='granted'):Promise.resolve(true)).then(okp=>{
   if(!okp){e.target.checked=false;CFG.gyro=false;n.textContent='Izin sensor gerak ditolak.';saveCfg();return}
   CFG.gyro=true;saveCfg();applyAll();gSeen=false;setTimeout(()=>{if(CFG.gyro&&!gSeen)n.textContent='Sensor gyro tidak terdeteksi di perangkat ini.'},1800)
  }).catch(()=>{e.target.checked=false;CFG.gyro=false;saveCfg()})};
 document.getElementById('cfgb').addEventListener('click',sync);sync()})();

let gyOn=false,gyT=0,gSeen=false;
function onMotion(e){
 const now=performance.now(),dt=Math.min(0.05,(now-gyT)/1000);gyT=now;gSeen=true;
 if(!CFG.gyro||!started||locked||hid||reading||over||fl2)return;
 const rr=e.rotationRate,a=e.accelerationIncludingGravity;if(!rr||rr.alpha==null||!a||a.x==null)return;
 const D=Math.PI/180,ox=(rr.beta||0)*D,oy=(rr.gamma||0)*D,oz=(rr.alpha||0)*D,IOS=/iP(hone|ad|od)/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
 let ux=a.x,uy=a.y,uz=a.z;if(IOS){ux=-ux;uy=-uy;uz=-uz}
 const n=Math.hypot(ux,uy,uz)||1;ux/=n;uy/=n;uz/=n;
 const yawR=ox*ux+oy*uy+oz*uz; // laju putar terhadap sumbu vertikal dunia (+ = menoleh kiri)
 const ang=((screen.orientation&&screen.orientation.angle!=null?screen.orientation.angle:(window.orientation||0))%360+360)%360,q=(ang/90)|0;
 const pitchR=ox*[1,0,-1,0][q]+oy*[0,-1,0,1][q];
 const sg=(CFG.ginv?-1:1)*CFG.gs*1.5*dt;
 yaw+=yawR*sg;pitch=Math.max(-1.35,Math.min(1.2,pitch+pitchR*sg))}

function applyAll(){
 const dpr=window.devicePixelRatio||1,rp={rendah:0.7,sedang:Math.min(dpr,1.25),tinggi:Math.min(dpr,2)}[CFG.gfx]||1;
 R.setPixelRatio(rp);R.setSize(innerWidth,innerHeight);
 const lo=CFG.gfx==='rendah';ls.forEach(l=>l.visible=!lo);GM.forEach(o=>o.gl.visible=!lo);
 const b=document.body.classList;b.toggle('no3d',CFG.menu3d===false);b.toggle('big',!!CFG.big);b.toggle('hc',!!CFG.hc);b.toggle('lefty',!!CFG.lefty);b.toggle('fixj',!!CFG.fixj);
 const rs=document.documentElement.style;rs.setProperty('--cs',CFG.cs);rs.setProperty('--bo',CFG.bo+'px');
 const want=!!CFG.gyro&&tc;if(want&&!gyOn){gyOn=true;gyT=performance.now();addEventListener('devicemotion',onMotion)}else if(!want&&gyOn){gyOn=false;removeEventListener('devicemotion',onMotion)}}
applyAll();

// ===== Stamina, timer, petunjuk dekat hantu (dipanggil tiap frame dari loop game.js) =====
const stamEl=document.getElementById('stam'),stamI=stamEl.firstElementChild;let hbT=0,hbCtx=null;
function thump(t,v){const o=hbCtx.createOscillator(),o2=hbCtx.createOscillator(),g=hbCtx.createGain();
 o.type='sine';o.frequency.setValueAtTime(70,t);o.frequency.exponentialRampToValueAtTime(38,t+0.12);
 o2.type='triangle';o2.frequency.setValueAtTime(150,t);o2.frequency.exponentialRampToValueAtTime(80,t+0.1); // harmonik supaya terdengar di speaker HP
 g.gain.setValueAtTime(0.0001,t);g.gain.exponentialRampToValueAtTime(Math.max(0.0002,v),t+0.015);g.gain.exponentialRampToValueAtTime(0.0001,t+0.17);
 o.connect(g);o2.connect(g);g.connect(hbCtx.destination);o.start(t);o2.start(t);o.stop(t+0.19);o2.stop(t+0.19)}
function beat(it){
 if(CFG.hb&&CFG.sfx>0){try{const AC=window.AudioContext||window.webkitAudioContext;if(AC){hbCtx=hbCtx||new AC();if(hbCtx.state==='suspended')hbCtx.resume();
  const t0=hbCtx.currentTime,v=(0.3+0.6*it)*CFG.sfx;thump(t0,v);thump(t0+0.17,v*0.7)}}catch(e){}}
 if(CFG.vib&&tc&&navigator.vibrate&&!document.hidden){try{navigator.vibrate(it>0.6?[45,60,45]:[40])}catch(e){}}}
function heart(dt,act){
 if(!act||(!CFG.hb&&!CFG.vib)){hbT=0;return}
 let dm=99;for(let i=0;i<2;i++){const h=GM[i].GH;if(h.visible)dm=Math.min(dm,Math.hypot(h.position.x-C.position.x,h.position.z-C.position.z))}
 if(dm>=14){hbT=0;return}
 const it=1-Math.max(0,dm-1.5)/12.5;hbT-=dt;if(hbT>0)return;hbT=1.15-0.8*Math.min(1,it);beat(Math.min(1,it))}
function frame(dt){
 const act=started&&!over&&!fl2;
 if(act&&!MP&&!G.done)G.t+=dt;
 if(act){
  const run=isRun()&&walkN!==0;
  if(run){STAM=Math.max(0,STAM-dt*22);stamD=0.9;if(STAM<=0){EXH=true;setRun(false)}}
  else{stamD-=dt;if(stamD<=0)STAM=Math.min(100,STAM+dt*(walkN?10:22))}
  if(EXH&&STAM>=30)EXH=false}
 const show=act&&!hid&&!ended;stamEl.style.display=show?'block':'none';
 if(show){stamI.style.width=STAM+'%';stamEl.classList.toggle('low',STAM<30);stamEl.classList.toggle('exh',EXH);stamEl.style.opacity=(STAM>=99&&!EXH)?.35:1}
 if(tc){const jy=document.getElementById('jy');if(CFG.fixj){if(started&&!over&&!ended)jy.style.display='block';else if(!over)jy.style.display='none'}}
 heart(dt,act)}

// ===== Chat cepat emoji (Multi Player) =====
let emoT=0;
function sendEmoji(e){const n=Date.now();if(n-emoT<800||!window.mpSend)return;emoT=n;mpSend({t:'c',m:e})}
(function(){
 const bar=el('div');bar.id='qe';EMO.forEach((e,i)=>{const b=el('button','',e);b.title='Tombol '+(i+1);b.dataset.n=i+1;b.onclick=ev=>{ev.stopPropagation();sendEmoji(e);qeSet(false)};b.addEventListener('touchstart',ev=>ev.stopPropagation(),{passive:true});bar.appendChild(b)});
 document.body.appendChild(bar);
 const btn=el('button','','😁');btn.id='qeb';btn.title='Chat cepat emoji (V)';btn.onclick=ev=>{ev.stopPropagation();qeSet()};document.body.appendChild(btn);
 const row=el('div');row.id='m_qe';EMO.forEach(e=>{const b=el('button','sm',e);b.onclick=()=>sendEmoji(e);row.appendChild(b)});
 document.getElementById('m_in').insertAdjacentElement('afterend',row);
 window.qeSet=function(o){bar.classList.toggle('open',o===undefined?!bar.classList.contains('open'):!!o)};
 addEventListener('keydown',e=>{
  if(!MP||e.repeat||e.ctrlKey||e.metaKey||e.altKey||(typeof chatOn!=='undefined'&&chatOn))return;
  const open=bar.classList.contains('open');
  if(e.code==='KeyV'&&!reading){e.preventDefault();qeSet();return}
  if(open){if(e.key>='1'&&e.key<='8'){e.preventDefault();e.stopImmediatePropagation();sendEmoji(EMO[+e.key-1]);qeSet(false)}else if(e.code==='Escape')qeSet(false)}},true)})();

// rekap sederhana untuk Multi Player: soal yang kamu jawab salah (ditambahkan ke papan skor akhir)
(function(){const _se=window.showEnd;if(typeof _se!=='function')return;
 window.showEnd=function(){_se.apply(this,arguments);
  const a=Object.values(G.map).filter(e=>e.picks.length);if(!a.length)return;
  const box=document.createElement('div');box.className='rrmp';const h=el('b','','SOAL YANG KAMU JAWAB SALAH');box.appendChild(h);
  const l=el('div');wrongList(l);box.appendChild(l);document.getElementById('rzs').appendChild(box)}})();

window.RK={begin,ans,frame,endType,failEnd,practiceDone,winEnd,hide1:()=>{G.hides++},stopT:()=>{G.done=true}};
})();
