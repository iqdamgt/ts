// MIDNIGHT LAB.. - cerita tambahan (dimuat setelah cerita.js)
// 1) CAUGHT_KALLA / CAUGHT_ONI : cutscene saat tertangkap, berbeda untuk tiap hantu (dipakai fitur.js lewat caughtScript)
// 2) END_JELEK    : ending jelek (lolos tapi hampir gagal: salah banyak)
// 3) END_RAHASIA  : ending rahasia (semua benar, tidak pernah bersembunyi)
// Format sama seperti OPEN/CALL/END di cerita.js. Adegan tanpa 'stage' memakai gambar SVG (sv) sebagai latar.

const CAUGHT_KALLA=[
{snd:'hantu.mp3',sv:'hukuman',fx:'shake',e:'🩸',t:'',bg:['#4a0d0d','#0a0202'],x:'Langkah itu berhenti tepat di belakang Wandih. Lampu neon padam satu per satu.'},
{snd:'',sv:'hukuman',e:'🩸',t:'',bg:['#4a0d0d','#0a0202'],x:'Sebuah tangan dingin mencengkeram bahunya. El Kalla tidak berteriak dan tidak mengejar. Ia hanya menunggu Wandih berhenti berlari.'},
{snd:'',sv:'lab',e:'👁️',t:'',bg:['#3a0a0a','#080101'],x:'Wandih diseret menjauh dari meja komputer, melewati lorong yang terasa makin panjang. Mata merah El Kalla tidak pernah berkedip.'},
{snd:'kunci.mp3',sv:'hukuman',fx:'flash',e:'🔒',t:'',bg:['#4a0d0d','#0a0202'],x:'Pintu lab menutup dari dalam. Terakhir terdengar suara kunci diputar pelan, persis seperti suara kunci guru tadi sore.'},
{snd:'',sv:'hukuman',e:'📄',t:'',bg:['#2a0606','#050000'],x:'Wandih hilang di balik gelap. Di atas meja, selembar soal masih menunggu untuk dijawab.',ok:true}];

const CAUGHT_ONI=[
{snd:'oni.mp3',sv:'teman',fx:'flash',e:'🌫️',t:'',bg:['#10204a','#02040d'],x:'Udara mendadak dingin. Layar-layar komputer menyala sendiri, satu per satu, menampilkan wajah yang sama: Oni.'},
{snd:'',sv:'teman',e:'🌫️',t:'',bg:['#10204a','#02040d'],x:'Oni tidak menyentuh Wandih. Ia hanya berdiri di depan layar dan berbisik, lalu kaki Wandih berhenti bergerak dengan sendirinya.'},
{snd:'',sv:'lab',e:'👂',t:'',bg:['#0c1838','#01030a'],x:'Bisikan itu mengulang pilihan jawaban Wandih satu per satu, yang benar dan yang salah, tanpa terlewat satu pun.'},
{snd:'',sv:'teman',fx:'shake',e:'🖥️',t:'',bg:['#10204a','#02040d'],x:'Cahaya layar memudar. Wandih ikut padam bersama monitor terakhir. Hanya bayangannya yang masih tampak di kaca.'},
{snd:'',sv:'lab',e:'📄',t:'',bg:['#081028','#010206'],x:'Tidak ada yang tersisa selain dengung kipas komputer dan selembar soal yang belum selesai.',ok:true}];

// g = 0 (El Kalla) atau 1 (Oni); wrongFail = tertangkap karena salah jawab melewati batas
function caughtScript(g,wrongFail){
 const src=g?CAUGHT_ONI:CAUGHT_KALLA,a=src.map(s=>Object.assign({},s));
 if(wrongFail)a[0].x=g?'Terlalu banyak jawaban salah. Layar-layar komputer menyala sendiri, seolah menghitung setiap kesalahan Wandih.'
  :'Terlalu banyak jawaban salah. Lembar-lembar soal itu seperti memanggil sesuatu dari sudut gelap lab.';
 return a}

const END_JELEK=[
{snd:'ringtone.mp3',sv:'telepon',who:'GURU',e:'📱',t:'GURU',bg:['#1a1426','#04020a'],x:'“Wandih, bapak sudah periksa lembar jawabanmu. Hampir semuanya salah. Kamu cuma beruntung bisa keluar.”'},
{snd:'',sv:'telepon',who:'WANDIH',e:'😰',t:'WANDIH',bg:['#0e1a2e','#02050a'],x:'“Tapi, Pak... saya sudah berusaha...”'},
{snd:'gurumarah.mp3',sv:'hukuman',who:'GURU',fx:'shake',e:'😡',t:'GURU',bg:['#4a1111','#120303'],x:'“Berusaha saja tidak cukup. Besok remedial lagi, dan malam ini lab bapak kunci lagi. Belajar yang benar!”'},
{snd:'',sv:'lab',e:'🔒',t:'',bg:['#050510','#000000'],x:'Wandih berdiri lama di depan pintu lab yang kembali terkunci. Di dalam, lampu neon berkedip pelan, seolah menyambutnya pulang.'},
{snd:'',sv:'lab',e:'👻',t:'',bg:['#050510','#000000'],x:'Dari balik kaca pintu, dua sosok berdiri berdampingan dan melambaikan tangan. El Kalla dan Oni sudah menunggu giliran berikutnya.'},
{snd:'',sv:'rumah',e:'📝',t:'',bg:['#2f2f1a','#0a0a05'],x:'ENDING JELEK: REMEDIAL LAGI. Jawaban yang salah tidak akan hilang sendiri. Pelajari lagi, lalu coba dengan lebih sedikit kesalahan.',ok:true}];

const END_RAHASIA=[
{snd:'',sv:'pintu',e:'🚪',t:'',bg:['#16301f','#030a05'],x:'Pintu lab terbuka. Tidak ada satu pun jawaban yang salah, dan Wandih tidak pernah bersembunyi sekali pun.'},
{snd:'',sv:'lab',fx:'flash',e:'👁️',t:'',bg:['#050510','#000000'],x:'Di ambang pintu, El Kalla dan Oni berdiri menghalangi jalan. Wandih membeku. Tapi kali ini mereka tidak mengejar.'},
{snd:'hantu.mp3',sv:'lab',e:'🩸',t:'EL KALLA',bg:['#3a0a0a','#080101'],x:'“Bertahun-tahun, tidak ada yang menyelesaikan semua soal tanpa salah dan tanpa lari bersembunyi.”'},
{snd:'oni.mp3',sv:'teman',e:'🌫️',t:'ONI',bg:['#10204a','#02040d'],x:'“Dulu kami juga siswa yang dikunci di lab ini. Kami menunggu seseorang yang benar-benar mau belajar.”'},
{snd:'',sv:'pintu',e:'📄',t:'',bg:['#16301f','#030a05'],x:'El Kalla menyerahkan secarik kertas bertuliskan nilai 100. Oni tersenyum untuk pertama kalinya, lalu keduanya memudar bersama cahaya lampu.'},
{snd:'',sv:'rumah',e:'🏆',t:'',bg:['#1f2a4a','#05070f'],x:'Keesokan harinya, nama Wandih tidak lagi di urutan paling bawah. Setiap malam, lampu lab menyala sendiri: dua penjaga kini punya satu murid terbaik.'},
{snd:'',sv:'rumah',e:'🌟',t:'',bg:['#1f2a4a','#05070f'],x:'ENDING RAHASIA: PENJAGA LAB. Semua soal benar tanpa pernah bersembunyi. Luar biasa!',ok:true}];
