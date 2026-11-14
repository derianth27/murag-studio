/* MURAG Studio — aplikasi penulisan. Mode lokal: data di data/murag.json (lewat server.py).
   Mode online: halaman ini di GitHub Pages, data di Google Drive (lewat gas/Code.gs). */
'use strict';

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const uid = (p) => p + '-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
const countWords = (t) => (String(t || '').trim().match(/\S+/g) || []).length;
const fmtNum = (n) => Number(n || 0).toLocaleString('id-ID');
const isPhone = () => matchMedia('(max-width: 760px)').matches;
const finePointer = () => matchMedia('(pointer: fine)').matches;

/* ---------------------------------------------------------------- Ikon (SVG garis, satu keluarga) */
const ICONS = {
  home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
  book: '<path d="M2 4h6a4 4 0 0 1 4 4v13a3 3 0 0 0-3-3H2z"/><path d="M22 4h-6a4 4 0 0 0-4 4v13a3 3 0 0 1 3-3h7z"/>',
  compass: '<circle cx="12" cy="12" r="9.5"/><path d="m15.8 8.2-2 5.6-5.6 2 2-5.6z"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  skull: '<path d="M12 3a8 8 0 0 0-8 8c0 2.6 1.3 4.6 3 6v3h10v-3c1.7-1.4 3-3.4 3-6a8 8 0 0 0-8-8z"/><circle cx="9" cy="11" r="1.4"/><circle cx="15" cy="11" r="1.4"/><path d="M10.5 20v-2.5M13.5 20v-2.5"/>',
  sword: '<path d="M14.5 17.5 3 6V3h3l11.5 11.5"/><path d="m13 19 6-6M16 16l4 4M19 21l2-2"/>',
  pin: '<path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12z"/><circle cx="12" cy="9" r="2.5"/>',
  flame: '<path d="M12 2.5c1 4 5 6 5 10.5a5 5 0 0 1-10 0c0-2.5 1.5-4 2.5-5 0 2 1 3 2 3.5C11 9 11 5.5 12 2.5z"/>',
  scroll: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h5"/>',
  help: '<circle cx="12" cy="12" r="9.5"/><path d="M9.2 9a2.9 2.9 0 0 1 5.6 1c0 2-2.8 2.6-2.8 4"/><path d="M12 17.5h.01"/>',
  bulb: '<path d="M9 18h6M10 21.5h4"/><path d="M12 2.5a6.5 6.5 0 0 0-3.8 11.8c.5.4.8 1 .8 1.7V16h6v-.1c0-.6.3-1.2.8-1.6A6.5 6.5 0 0 0 12 2.5z"/>',
  check: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="m8 12 3 3 5-6"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  more: '<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  theme: '<circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 0 0 18z" fill="currentColor"/>',
  download: '<path d="M12 3v12m0 0-4-4m4 4 4-4"/><path d="M4 17v3h16v-3"/>',
  copy: '<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3"/>',
  phone: '<rect x="6" y="2.5" width="12" height="19" rx="2.5"/><path d="M11 18.5h2"/>',
  pen: '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/>',
  list: '<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
  eye: '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
  layers: '<path d="m12 3 9 5-9 5-9-5z"/><path d="m3 13 9 5 9-5"/>',
  focus: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
  trash: '<path d="M4 7h16M10 11v6M14 11v6"/><path d="M6 7l1 13h10l1-13M9 7V4h6v3"/>',
  file: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/>',
  back: '<path d="M19 12H5m6-6-6 6 6 6"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
};
const ico = (name, cls = '') => `<svg class="i ${cls}" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${ICONS[name] || ''}</svg>`;
function hydrateIcons(root = document) {
  $$('[data-ico]', root).forEach((el) => { if (!el.querySelector('svg')) el.insertAdjacentHTML('afterbegin', ico(el.dataset.ico)); });
}

let DB = null;
let VERSION = '';
let saveTimer = null;
let dirty = false;
let saving = false;
let showArsip = false;

/* ---------------------------------------------------------------- Sambungan data
   Mode lokal  : halaman dibuka dari server.py (config.js buatan server berisi { lokal: true }).
   Mode online : halaman dibuka dari GitHub Pages, data diambil dari web app Google Apps Script.
                 Alamat web app + kunci akses disimpan di perangkat ini (localStorage). */
const CFG = window.MURAG_CONFIG || {};
const ONLINE = !CFG.lokal;
const simpanan = {
  get(k) { try { return localStorage.getItem(k) || ''; } catch (e) { return ''; } },
  set(k, v) { try { if (v) localStorage.setItem(k, v); else localStorage.removeItem(k); } catch (e) { /* abaikan */ } },
};
const GAS_OK = /^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$|^http:\/\/(127\.0\.0\.1|localhost)(:\d+)?\//;
let GAS_URL = GAS_OK.test(CFG.gas || '') ? CFG.gas : simpanan.get('murag-gas');
let GAS_KEY = simpanan.get('murag-kunci');
let SNAP = null; // potret data yang terakhir tersimpan di server (mode online), untuk mengirim selisihnya saja

// Tautan dari "Buka di HP": …/#sambung&k=KUNCI[&gas=ALAMAT]. Kunci hanya dipakai untuk alamat yang datang bersamanya.
if (ONLINE && /^#sambung\b/.test(location.hash)) {
  const q = new URLSearchParams(location.hash.slice(1));
  const g = q.get('gas') || '';
  if (!CFG.gas && GAS_OK.test(g) && g !== GAS_URL) { GAS_URL = g; GAS_KEY = ''; simpanan.set('murag-gas', g); }
  if (q.get('k')) GAS_KEY = q.get('k');
  simpanan.set('murag-kunci', GAS_KEY);
  history.replaceState(null, '', location.pathname + location.search + '#/beranda');
}

async function gas(aksi, extra) {
  const r = await fetch(GAS_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // "simple request": Apps Script tidak melayani preflight CORS
    body: JSON.stringify({ aksi, kunci: GAS_KEY, ...extra }),
  });
  const res = await r.json();
  return { status: res.ok ? 200 : (res.status || 500), res };
}
async function lokal(path, opt) {
  const r = await fetch(path, opt);
  return { status: r.status, res: await r.json().catch(() => ({})) };
}
function potret(db) {
  const s = {};
  for (const k of Object.keys(db)) s[k] = k === 'bab' ? JSON.stringify(db.bab.map(({ isi, ...b }) => b)) : JSON.stringify(db[k]);
  for (const b of db.bab) s['isi:' + b.id] = b.isi || '';
  return s;
}
const api = {
  data: () => (ONLINE ? gas('data') : lokal('/api/data')),
  versi: () => (ONLINE ? gas('versi') : lokal('/api/version')),
  async simpan(db, versi) {
    if (!ONLINE) {
      return lokal('/api/data', { method: 'PUT', headers: { 'Content-Type': 'application/json', 'X-Version': versi }, body: JSON.stringify(db) });
    }
    const baru = potret(db);
    const ids = db.bab.map((b) => b.id);
    let out;
    if (!SNAP || ids.some((id) => !id) || new Set(ids).size !== ids.length) {
      out = await gas('simpan', { versi, data: db });
    } else {
      const ubah = {}; const isi = {};
      for (const k of Object.keys(baru)) {
        if (baru[k] === SNAP[k]) continue;
        if (k.startsWith('isi:')) isi[k.slice(4)] = baru[k]; else ubah[k] = JSON.parse(baru[k]);
      }
      out = await gas('simpan', { versi, ubah, isi });
    }
    if (out.status === 200) SNAP = baru;
    return out;
  },
};

/* ---------------------------------------------------------------- Skema koleksi */
const STATUS_BAB = ['publish', 'draf', 'rencana'];
// Field versi lama (Wattpad): disimpan sebagai arsip tertutup, tidak dipakai di Ingatan.
const ARSIP_LAMA = (extra = []) => [
  { sec: '🗄 Arsip versi lama (Wattpad)', arsip: true },
  { k: 'munculPertamaLama', l: 'Muncul pertama (versi lama)' },
  ...extra.map((f) => ({ type: 'area', wide: true, ...f })),
];
// Klasifikasi FUSE (lore "Entitas & Ras"): Entitas → Ras → Jenis → Individu, plus Kondisi (tidak mengubah ras).
const ENTITAS_OPT = ['', 'Humanoid', 'Bestial', 'Aberrant', 'Amorphous'];
const daftarRas = () => [...new Set(DB.entitas.filter((x) => x.kategori === 'Ras' && x.ras).map((x) => x.ras))];
const KONDISI_OPT = () => ['Resonair/Dukun', 'Partner', 'Kuyang'];
const F_ENTITAS = { k: 'entitas', l: 'Entitas', type: 'select', opt: ENTITAS_OPT };
const F_RAS = { k: 'ras', l: 'Ras', type: 'suggest', opt: daftarRas, hint: 'Ras (Jenis), mis. Spiritkin (Kuntilanak)' };
const F_KONDISI = { k: 'kondisi', l: 'Kondisi', type: 'suggest', opt: KONDISI_OPT, hint: 'tidak mengubah ras' };
const SKEMA = {
  karakter: {
    label: 'Karakter', ikon: 'user', grup: 'grup', judul: 'nama',
    sub: (d) => [d.peran, d.ras].filter(Boolean).join(' · '),
    grupUrut: ['Utama', 'FUSE', 'Markas', 'Pendukung', 'Antagonis', 'Mimpi Indra', 'Disebut', 'Rahasia', 'Lainnya'],
    fields: [
      { sec: 'Identitas' },
      { k: 'nama', l: 'Nama' }, { k: 'namaLengkap', l: 'Nama lengkap' },
      { k: 'grup', l: 'Kelompok', type: 'select', opt: ['Utama', 'FUSE', 'Markas', 'Pendukung', 'Antagonis', 'Mimpi Indra', 'Disebut', 'Rahasia', 'Lainnya'] },
      { k: 'alias', l: 'Alias / sebutan', hint: 'pisahkan koma — dipakai deteksi otomatis di editor', wide: true },
      { k: 'peran', l: 'Peran dalam cerita' }, { k: 'status', l: 'Status' }, { k: 'gender', l: 'Gender' },
      { k: 'lahir', l: 'Tanggal lahir' }, { k: 'umur', l: 'Umur' }, { k: 'munculPertama', l: 'Muncul pertama' },
      { sec: 'Dunia Bawah' },
      F_ENTITAS, F_RAS, F_KONDISI, { k: 'kelas', l: 'Kelas' }, { k: 'level', l: 'Level' }, { k: 'faksi', l: 'Faksi' },
      { k: 'kekuatan', l: 'Kekuatan / kemampuan', type: 'area', wide: true },
      { k: 'statusWindow', l: 'Status window / notifikasi', type: 'area', wide: true },
      { sec: 'Karakterisasi' },
      { k: 'penampilan', l: 'Penampilan & pakaian', type: 'area', wide: true },
      { k: 'sifat', l: 'Sifat & kebiasaan', type: 'area', wide: true },
      { k: 'konflik', l: 'Konflik internal', type: 'area', wide: true },
      { k: 'latarBelakang', l: 'Latar belakang', type: 'area', wide: true },
      { k: 'tujuan', l: 'Tujuan', type: 'area', wide: true },
      { k: 'panggilan', l: 'Cara memanggil / dipanggil', type: 'area', wide: true },
      { sec: 'Ingatan & rencana' },
      { k: 'faktaReboot', l: 'Fakta di cerita', hint: 'yang sudah terjadi/terungkap di naskah reboot', type: 'area', wide: true },
      { k: 'rencana', l: 'Rencana / belum muncul di cerita', type: 'area', wide: true },
      { k: 'promptIlustrasi', l: 'Prompt ilustrasi', type: 'area', wide: true },
      ...ARSIP_LAMA([{ k: 'catatanLama', l: 'Fakta versi lama' }]),
    ],
    ingatan: ['peran', 'ras', 'kondisi', 'kelas', 'penampilan', 'sifat', 'panggilan', 'kekuatan', 'faktaReboot'],
  },
  entitas: {
    label: 'Entitas & Ras', ikon: 'skull', judul: 'nama', grup: 'kategori',
    sub: (d) => [d.entitas, d.ras, d.kondisi].filter(Boolean).join(' · '),
    grupUrut: ['Entitas', 'Ras', 'Makhluk'],
    fields: [
      { k: 'nama', l: 'Nama' }, { k: 'namaIlmiah', l: 'Nama ilmiah' }, { k: 'arti', l: 'Arti' },
      { k: 'kategori', l: 'Kelompok daftar', type: 'select', opt: ['Makhluk', 'Ras', 'Entitas'], hint: 'Makhluk = jenis makhluk' },
      F_ENTITAS, F_RAS, F_KONDISI, { k: 'asal', l: 'Asal' }, { k: 'munculPertama', l: 'Muncul pertama' },
      { k: 'alias', l: 'Alias', hint: 'pisahkan koma', wide: true },
      { k: 'fisik', l: 'Ciri fisik', type: 'area', wide: true },
      { k: 'sifat', l: 'Sifat umum', type: 'area', wide: true },
      { k: 'kekuatan', l: 'Kekuatan', type: 'area' }, { k: 'kelemahan', l: 'Kelemahan', type: 'area' },
      { k: 'catatan', l: 'Catatan / lore', type: 'area', wide: true },
      ...ARSIP_LAMA(),
    ],
    ingatan: ['entitas', 'ras', 'kondisi', 'fisik', 'kekuatan', 'kelemahan', 'catatan'],
  },
  benda: {
    label: 'Benda & Artefak', ikon: 'sword', judul: 'nama', grup: 'grade',
    sub: (d) => [d.grade, d.munculPertama].filter(Boolean).join(' · '),
    grupUrut: ['Mythic', 'Legendary', 'Epic', 'Rare', 'Uncommon', 'Common', 'Poor', 'Evolving', 'Belum ditentukan'],
    fields: [
      { k: 'nama', l: 'Nama' },
      { k: 'grade', l: 'Grade', type: 'select', opt: ['Belum ditentukan', 'Poor', 'Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythic', 'Evolving'] },
      { k: 'munculPertama', l: 'Muncul pertama' }, { k: 'pemilik', l: 'Pemilik / pengguna' },
      { k: 'alias', l: 'Alias', hint: 'pisahkan koma', wide: true },
      { k: 'efek', l: 'Efek / fungsi', type: 'area', wide: true },
      { k: 'asal', l: 'Asal-usul', type: 'area', wide: true },
      { k: 'catatan', l: 'Catatan', type: 'area', wide: true },
      ...ARSIP_LAMA(),
    ],
    ingatan: ['grade', 'pemilik', 'efek', 'catatan'],
  },
  latar: {
    label: 'Latar / Lokasi', ikon: 'pin', judul: 'nama', grup: 'dunia',
    sub: (d) => d.munculPertama || '',
    fields: [
      { k: 'nama', l: 'Nama' }, { k: 'dunia', l: 'Dunia', type: 'select', opt: ['Dunia Atas', 'Dunia Bawah', 'Mimpi / Visi'] },
      { k: 'munculPertama', l: 'Muncul pertama' },
      { k: 'alias', l: 'Alias', hint: 'pisahkan koma', wide: true },
      { k: 'deskripsi', l: 'Deskripsi', type: 'area', wide: true },
      { k: 'catatan', l: 'Catatan', type: 'area', wide: true },
      ...ARSIP_LAMA(),
    ],
    ingatan: ['dunia', 'deskripsi', 'catatan'],
  },
  faksi: {
    label: 'Faksi & Organisasi', ikon: 'flame', judul: 'nama',
    sub: (d) => d.munculPertama || '',
    fields: [
      { k: 'nama', l: 'Nama' }, { k: 'munculPertama', l: 'Muncul / disebut pertama' },
      { k: 'alias', l: 'Alias', hint: 'pisahkan koma', wide: true },
      { k: 'deskripsi', l: 'Yang sudah diketahui di cerita', type: 'area', wide: true },
      { k: 'rencana', l: 'Rencana / lore belum muncul', type: 'area', wide: true },
      { k: 'anggota', l: 'Anggota yang diketahui', type: 'area', wide: true },
      ...ARSIP_LAMA(),
    ],
    ingatan: ['deskripsi', 'anggota'],
  },
  lore: {
    label: 'Lore & Sistem', ikon: 'scroll', judul: 'judul', grup: 'kategori',
    sub: (d) => d.kategori || '',
    fields: [
      { k: 'judul', l: 'Judul' }, { k: 'kategori', l: 'Kategori', type: 'select', opt: ['Dunia', 'Kekuatan', 'Sistem', 'Klasifikasi', 'Ritual', 'Gaya Penulisan'] },
      { k: 'sumber', l: 'Sumber / bab' },
      { k: 'isi', l: 'Isi', type: 'area', wide: true, rows: 10 },
    ],
  },
  misteri: {
    label: 'Misteri & Benang Merah', ikon: 'help', judul: 'judul', grup: 'status',
    sub: (d) => [d.jenis === 'Detail kecil' ? 'detail kecil' : '', d.munculPertama].filter(Boolean).join(' · '),
    grupUrut: ['Terbuka', 'Petunjuk ditanam', 'Terjawab'],
    fields: [
      { k: 'judul', l: 'Misteri' },
      { k: 'status', l: 'Status', type: 'select', opt: ['Terbuka', 'Petunjuk ditanam', 'Terjawab'] },
      { k: 'jenis', l: 'Jenis', type: 'select', opt: ['Benang utama', 'Detail kecil'], hint: 'detail kecil = hal aneh yang belum dijelaskan' },
      { k: 'munculPertama', l: 'Muncul pertama' },
      { k: 'pertanyaan', l: 'Yang belum terjelaskan', hint: 'pertanyaan pembaca', type: 'area', wide: true },
      { k: 'petunjukReboot', l: 'Petunjuk di cerita', hint: 'tulis per bab: "Bab N: ..." supaya masuk Rekap Misteri', type: 'area', wide: true },
      { k: 'saran', l: 'Saran: itu apa?', hint: 'dugaan/usulan Claude, BUKAN kanon sampai dipindah ke Rencana', type: 'area', wide: true },
      { k: 'rencana', l: 'Rencana jawaban (rahasia penulis)', type: 'area', wide: true },
      { k: 'catatan', l: 'Catatan', type: 'area', wide: true },
      ...ARSIP_LAMA([{ k: 'petunjukLama', l: 'Petunjuk versi lama' }, { k: 'catatanLama', l: 'Catatan versi lama' }]),
    ],
  },
  ide: {
    label: 'Ide', ikon: 'bulb', judul: 'judul', grup: 'status',
    sub: (d) => d.status || '',
    fields: [
      { k: 'judul', l: 'Ide untuk' }, { k: 'status', l: 'Status', type: 'select', opt: ['Belum terpakai', 'Sedang dipakai', 'Sudah terpakai', 'Dibuang'] },
      { k: 'isi', l: 'Detail', type: 'area', wide: true, rows: 8 },
    ],
  },
};
const KOLEKSI_DETEKSI = ['karakter', 'entitas', 'benda', 'latar', 'faksi'];

/* ---------------------------------------------------------------- Simpan / muat */
function setSave(text, err) {
  const el = $('#saveStatus');
  el.textContent = text;
  el.classList.toggle('err', !!err);
  const dot = $('#saveDot');
  if (dot) {
    dot.dataset.state = err ? 'err' : /Menyimpan/.test(text) ? 'busy' : 'ok';
    dot.setAttribute('aria-label', text);
    dot.title = text;
  }
}
function markDirty() {
  dirty = true;
  setSave('Menyimpan…');
  clearTimeout(saveTimer);
  saveTimer = setTimeout(save, ONLINE ? 2500 : 700);
}
async function save() {
  clearTimeout(saveTimer);
  if (!DB || saving) { if (saving) saveTimer = setTimeout(save, 400); return; }
  saving = true;
  DB.meta.diperbarui = new Date().toISOString();
  try {
    const sebelum = JSON.stringify(DB);
    const { status, res } = await api.simpan(DB, VERSION);
    if (status === 409) {
      dirty = false;
      await reloadFromServer();
      setSave('Konflik — dimuat ulang', true);
      const tempat = ONLINE ? 'folder <code>cadangan</code> di Google Drive, file ' : '<code>data/backups/</code>';
      notice(`Data sudah diubah dari luar aplikasi (perangkat lain, atau Claude), jadi perubahan terakhirmu tidak ditimpakan. Perubahanmu tetap aman di ${tempat}<code>${esc(res.saved_as || 'konflik-*.json')}</code>. Tampilan sudah dimuat ulang.`);
      return;
    }
    if (status === 401) { setSave('Kunci akses ditolak', true); pageSambung('Kunci akses ditolak server. Masukkan kunci yang benar; tulisanmu di layar ini belum tersimpan.'); return; }
    if (status !== 200) throw new Error(res.error || status);
    VERSION = res.version;
    // kalau ada ketikan baru selama menunggu server, biarkan tetap "belum tersimpan" supaya dikirim lagi
    if (JSON.stringify(DB) === sebelum) {
      dirty = false;
      setSave('Tersimpan ' + new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }));
    } else {
      markDirty();
    }
  } catch (e) {
    setSave(ONLINE ? 'Gagal menyimpan — cek koneksi internet' : 'Gagal menyimpan — apakah server masih jalan?', true);
    if (ONLINE) { clearTimeout(saveTimer); saveTimer = setTimeout(save, 15000); } // coba lagi sendiri
  } finally {
    saving = false;
  }
}
function notice(html) {
  let el = $('#notice');
  if (!el) { el = document.createElement('div'); el.id = 'notice'; el.className = 'notice'; document.body.appendChild(el); }
  el.innerHTML = `<div>${html}</div><button class="btn small" onclick="this.parentElement.remove()">Tutup</button>`;
}
function terima(res) {
  DB = res.data; VERSION = res.version;
  SNAP = ONLINE ? potret(DB) : null;
  normalize();
}
async function reloadFromServer() {
  const { status, res } = await api.data();
  if (status !== 200) throw new Error(res.error);
  terima(res);
  route(true);
}
// Pantau perubahan dari luar (mis. Claude menulis bab ke naskah/*.md, atau perangkat lain menyimpan)
let sedangCek = false;
async function cekPerubahan() {
  if (!DB || dirty || saving || sedangCek || document.hidden) return;
  sedangCek = true;
  try {
    const { status, res } = await api.versi();
    if (status !== 200 || res.version === VERSION) return;
    if (dirty || saving) return;
    const ae = document.activeElement;
    if (ae && /INPUT|TEXTAREA|SELECT/.test(ae.tagName) && ae.id !== 'globalSearch') return; // tunggu sampai berhenti mengetik
    await reloadFromServer();
    setSave('Dimuat ulang — ada perubahan dari luar');
  } catch (e) { /* server mati / tidak ada internet: abaikan */ } finally { sedangCek = false; }
}
// Online: tiap panggilan ke Apps Script makan kuota, jadi cek lebih jarang + saat aplikasi dibuka lagi
setInterval(cekPerubahan, ONLINE ? 45000 : 3000);
document.addEventListener('visibilitychange', () => { if (ONLINE && !document.hidden) cekPerubahan(); });
window.addEventListener('beforeunload', (e) => { if (dirty) { save(); e.preventDefault(); e.returnValue = ''; } });
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') { e.preventDefault(); save(); }
  if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)) { e.preventDefault(); $('#globalSearch').focus(); }
  if (e.key === 'Escape' && document.body.classList.contains('focus')) document.body.classList.remove('focus');
  if (e.key === 'Escape' && $('#sidebar').classList.contains('open')) setDrawer(false);
});

function normalize() {
  for (const k of [...Object.keys(SKEMA), 'bab', 'checklist']) DB[k] = DB[k] || [];
  for (const b of DB.bab) b.versi = b.versi || 'reboot';
}
async function load() {
  if (ONLINE && (!GAS_URL || !GAS_KEY)) return pageSambung();
  try {
    const { status, res } = await api.data();
    if (ONLINE && status === 401) return pageSambung('Kunci akses salah. Cek lagi kuncinya (lihat Execution log fungsi <code>siapkan</code> di Apps Script).');
    if (status !== 200) throw new Error(res.error || status);
    terima(res);
  } catch (e) {
    $('#main').innerHTML = ONLINE
      ? `<div class="empty-state">Tidak bisa memuat data dari server online.<br><small>${esc(e.message || '')}</small>
          <div class="row mt" style="justify-content:center"><button class="btn primary" id="cobaLagi">Coba lagi</button><button class="btn" id="aturSambung">Atur ulang sambungan</button></div></div>`
      : `<div class="empty-state">Tidak bisa memuat data. Jalankan aplikasi lewat <b>Jalankan MURAG Studio.bat</b>.<br><small>${esc(e.message || '')}</small></div>`;
    if (ONLINE) { $('#cobaLagi').onclick = () => { $('#main').innerHTML = '<div class="loading">Memuat ingatan cerita…</div>'; load(); }; $('#aturSambung').onclick = () => pageSambung(); }
    return;
  }
  setSave('Siap');
  route();
}

/* ---------------------------------------------------------------- Sambungkan perangkat (mode online) */
function pageSambung(pesan) {
  const adaAlamat = GAS_OK.test(CFG.gas || '');
  $('#topTitle').textContent = 'Sambungkan';
  $('#main').innerHTML = `
    <div class="page-head"><div class="grow"><h1>Sambungkan perangkat ini</h1>
      <p>Halaman ini cuma tampilan. Naskah dan database tersimpan di Google Drive-mu lewat Apps Script, dan baru bisa dibuka setelah kunci akses dimasukkan.</p></div></div>
    <form class="card card-pad" id="formSambung" style="max-width:560px">
      ${pesan ? `<p style="color:var(--accent)"><b>${pesan}</b></p>` : ''}
      ${adaAlamat ? '' : `<div class="field"><label for="inGas">Alamat web app Apps Script <span class="hint">(berakhiran /exec)</span></label>
        <input id="inGas" type="url" inputmode="url" autocomplete="off" spellcheck="false" placeholder="https://script.google.com/macros/s/…/exec" value="${esc(GAS_URL)}" required></div>`}
      <div class="field mt"><label for="inKunci">Kunci akses</label>
        <input id="inKunci" type="password" autocomplete="off" spellcheck="false" value="${esc(GAS_KEY)}" required></div>
      <p class="small muted" id="galatSambung" role="alert"></p>
      <div class="row mt"><button class="btn primary" type="submit">Sambungkan</button></div>
      <p class="small muted mt">Kunci hanya disimpan di perangkat ini. Sudah tersambung di perangkat lain? Buka <b>Buka di HP</b> di sana lalu scan QR-nya, tidak perlu mengetik.</p>
    </form>`;
  $('#formSambung').onsubmit = (e) => {
    e.preventDefault();
    const g = adaAlamat ? CFG.gas : $('#inGas').value.trim();
    if (!GAS_OK.test(g)) { $('#galatSambung').textContent = 'Alamat harus berbentuk https://script.google.com/macros/s/…/exec'; return; }
    GAS_URL = g; GAS_KEY = $('#inKunci').value.trim();
    if (!adaAlamat) simpanan.set('murag-gas', GAS_URL);
    simpanan.set('murag-kunci', GAS_KEY);
    if (DB && dirty) { $('#notice')?.remove(); route(true); save(); return; } // kunci diganti di tengah menulis: lanjut simpan
    $('#main').innerHTML = '<div class="loading">Memuat ingatan cerita…</div>';
    load();
  };
  ($('#inGas') && !GAS_URL ? $('#inGas') : $('#inKunci')).focus();
}

/* ---------------------------------------------------------------- Util teks */
const isLama = (b) => b && b.versi === 'lama';
function babLabel(b) {
  if (!b) return '';
  const base = b.jenis === 'ekstra' ? b.judul : `Bab ${b.nomor} — ${b.judul}`;
  return isLama(b) ? base + ' (versi lama)' : base;
}
function babUrut(versi) {
  return [...DB.bab].filter((b) => !versi || b.versi === versi).sort((a, b) => (a.urutan ?? 0) - (b.urutan ?? 0));
}
function babBerjalan() {
  const list = babUrut('reboot').filter((b) => b.jenis !== 'ekstra');
  return list.find((b) => b.status === 'draf') || list.find((b) => b.status === 'rencana') || list[list.length - 1];
}
/* ---------------------------------------------------------------- Rekap misteri (per bab) */
// "Bab 13–15" → [13,14,15]; "Bab 18 & 20" → [18,20]
function babAngka(s) {
  const out = new Set();
  String(s || '').replace(/(\d+)\s*[–-]\s*(\d+)|(\d+)/g, (m, a, b, c) => {
    if (c) out.add(+c);
    else for (let i = +a; i <= +b && i - a < 60; i++) out.add(i);
    return m;
  });
  return [...out];
}
// Pecah petunjukReboot jadi potongan {bab:[n...], teks}. Teks tanpa awalan "Bab N:" ikut bab munculPertama.
const RE_KEPALA_BAB = /(^|[\s.;])(Bab\s+\d+(?:\s*(?:[–-]|&|,|dan)\s*\d+)*)(?:\s*\([^)]*\))?\s*:\s*/g;
function potongPetunjuk(m) {
  const t = String(m.petunjukReboot || '');
  const heads = [...t.matchAll(RE_KEPALA_BAB)];
  const out = [];
  const awal = babAngka(String(m.munculPertama || '').split(/[,(]/)[0]).slice(0, 1);
  const pre = (heads.length ? t.slice(0, heads[0].index + heads[0][1].length) : t).trim();
  if (pre && awal.length) out.push({ bab: awal, teks: pre });
  heads.forEach((h, i) => {
    const mulai = h.index + h[0].length;
    const akhir = i + 1 < heads.length ? heads[i + 1].index + heads[i + 1][1].length : t.length;
    const teks = t.slice(mulai, akhir).trim();
    if (teks) out.push({ bab: babAngka(h[2]), label: h[2].replace(/\s+/g, ' '), teks });
  });
  if (!out.length && awal.length) out.push({ bab: awal, teks: '(belum ada petunjuk tertulis)' });
  return out;
}
// Misteri yang punya petunjuk di bab bernomor n
function misteriDiBab(n) {
  const res = [];
  for (const m of DB.misteri) {
    const pot = potongPetunjuk(m).filter((p) => p.bab.includes(n));
    if (pot.length) res.push({ m, pot, baru: babAngka(String(m.munculPertama || '').split(/[,(]/)[0])[0] === n });
  }
  const urutStatus = { Terbuka: 0, 'Petunjuk ditanam': 1, Terjawab: 2 };
  return res.sort((a, b) => (b.baru - a.baru) || ((urutStatus[a.m.status] ?? 1) - (urutStatus[b.m.status] ?? 1)));
}
const chipMisteri = (m) => `<span class="chip ${m.status === 'Terjawab' ? 'terjawab' : m.status === 'Terbuka' ? 'terbuka' : 'ditanam'}">${esc(m.status || '?')}</span>${m.jenis === 'Detail kecil' ? '<span class="chip ekstra">detail</span>' : ''}`;
function kartuMisteri({ m, pot, baru }, opsi = {}) {
  return `<details class="mem-item mis-item" ${opsi.buka ? 'open' : ''}>
    <summary>${ico('help')} <span class="mis-judul">${esc(m.judul)}</span>${baru ? '<span class="chip rencana">baru</span>' : ''}<span class="k">${chipMisteri(m)}</span></summary>
    <div class="mb-body"><dl style="margin:0">
      ${pot.map((p) => `<dt>${esc(p.label || 'Di bab ini')}</dt><dd>${inline(p.teks)}</dd>`).join('')}
      ${m.pertanyaan || m.catatan ? `<dt>Yang belum terjelaskan</dt><dd>${inline(m.pertanyaan || m.catatan)}</dd>` : ''}
      ${m.saran ? `<dt class="saran-dt">💡 Saran: itu apa?</dt><dd class="saran">${inline(m.saran)}</dd>` : '<dt class="saran-dt">💡 Saran</dt><dd class="muted">Belum ada. Minta Claude: "isi saran misteri".</dd>'}
      ${opsi.rencana && m.rencana ? `<dt>Rencana jawaban (rahasia)</dt><dd>${inline(m.rencana)}</dd>` : ''}
    </dl><div style="margin-top:6px"><a href="#/k/misteri/${esc(m.id)}">buka di database →</a></div></div></details>`;
}
let rekapFilter = 'terbuka';
let rekapRencana = false;
function pageRekap() {
  const babs = babUrut('reboot').filter((b) => b.jenis !== 'ekstra').reverse();
  const saring = (list) => list.filter(({ m }) => rekapFilter === 'semua' || (rekapFilter === 'terbuka' ? m.status !== 'Terjawab' : m.jenis === 'Detail kecil'));
  const tanpaSaran = DB.misteri.filter((m) => m.status !== 'Terjawab' && !m.saran).length;
  const blok = babs.map((b) => {
    const n = parseInt(b.nomor, 10);
    const list = saring(misteriDiBab(n));
    if (!list.length) return '';
    return `<section class="card card-pad rekap-bab">
      <div class="row mb"><h2><a href="#/bab/${esc(b.id)}">${esc(babLabel(b))}</a></h2><span class="spacer"></span>
        <span class="small muted">${list.length} misteri · ${list.filter((x) => x.baru).length} baru</span></div>
      ${list.map((x) => kartuMisteri(x, { buka: x.baru, rencana: rekapRencana })).join('')}
    </section>`;
  }).join('');
  const btn = (k, l) => `<button class="btn small ${rekapFilter === k ? 'primary' : 'ghost'}" data-rf="${k}">${l}</button>`;
  $('#main').innerHTML = `
    <div class="page-head"><div class="grow"><h1 class="h-ico">${ico('help')} Rekap Misteri</h1>
      <p>Semua misteri & hal yang belum terjelaskan, dikelompokkan per bab tempat petunjuknya muncul (dari isian <i>Petunjuk di cerita</i>: "Bab N: …").
      <b>Saran</b> = dugaan Claude untuk lo, bukan kanon.</p></div>
      <a class="btn" href="#/k/misteri">${ico('list')}Database misteri</a></div>
    <div class="row mb rekap-tools">${btn('terbuka', 'Belum terjawab')}${btn('detail', 'Detail kecil')}${btn('semua', 'Semua')}
      <span class="spacer"></span><label class="small"><input type="checkbox" id="rekapRencana" ${rekapRencana ? 'checked' : ''}> tampilkan rencana rahasia</label></div>
    ${tanpaSaran ? `<div class="wattpad-note small mb">${tanpaSaran} misteri terbuka belum punya saran.</div>` : ''}
    ${blok || '<div class="card empty-state">Belum ada misteri yang punya petunjuk per bab.</div>'}`;
  $$('[data-rf]').forEach((x) => x.onclick = () => { rekapFilter = x.dataset.rf; pageRekap(); });
  $('#rekapRencana').onchange = (e) => { rekapRencana = e.target.checked; pageRekap(); };
}

function buatBabBaru() {
  const reboot = DB.bab.filter((b) => b.versi === 'reboot' && b.jenis !== 'ekstra');
  const nomor = Math.max(0, ...reboot.map((b) => parseInt(b.nomor, 10) || 0)) + 1;
  const used = new Set(DB.bab.map((b) => b.file).filter(Boolean));
  let file = `naskah/bab-${String(nomor).padStart(2, '0')}.md`;
  for (let i = 2; used.has(file); i++) file = `naskah/bab-${String(nomor).padStart(2, '0')}-${i}.md`;
  const b = {
    id: uid('bab'), versi: 'reboot', nomor: String(nomor), judul: 'Judul bab', jenis: 'bab', status: 'rencana',
    urutan: Math.max(0, ...DB.bab.map((x) => x.urutan || 0)) + 1, file,
    pov: '', waktu: '', latar: '', tokoh: '', arahan: '', ringkasan: '', catatan: '', isi: '', targetKata: 2500,
  };
  DB.bab.push(b); markDirty();
  location.hash = '#/bab/' + b.id;
}
// Ringkasan "- poin" → <ul>
function richText(t) {
  const lines = String(t || '').split('\n');
  if (lines.filter((l) => l.trim()).every((l) => /^\s*[-•]\s/.test(l) || /^\s{2,}/.test(l))) {
    return '<ul class="rich-list">' + lines.filter((l) => l.trim()).map((l) => {
      const sub = /^\s{2,}/.test(l);
      return `<li${sub ? ' style="margin-left:16px;list-style:circle"' : ''}>${inline(l.replace(/^\s*[-•]\s?/, ''))}</li>`;
    }).join('') + '</ul>';
  }
  return `<div class="rich">${inline(t)}</div>`;
}
function inline(t) {
  // \* = bintang literal (mis. nama tersensor G\*\*\*), bukan penanda format
  return esc(String(t ?? '').replace(/\\\*/g, '\u0001'))
    .replace(/\*\*\*(.+?)\*\*\*/g, '<b><i>$1</i></b>').replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
    .replace(/(^|[^*])\*(?!\s)(.+?)\*(?!\*)/g, '$1<i>$2</i>')
    .replace(/\u0001/g, '*');
}
function renderPreview(text) {
  const paras = String(text || '').split(/\n\s*\n|\n/).map((p) => p.trim()).filter(Boolean);
  if (!paras.length) return '<p class="muted">Belum ada tulisan.</p>';
  return paras.map((p) => {
    if (/^(\*\*\*|\[(x|×)\])$/i.test(p)) return '<p class="sep">***</p>';
    if (/^_?bersambung_?$/i.test(p.replace(/\*/g, ''))) return '<p class="bersambung">bersambung</p>';
    return `<p>${inline(p)}</p>`;
  }).join('');
}
/* Format siap tempel ke editor Fizzo (sama dengan tools/fizzo_export.py):
   tiap baris = satu paragraf, *** = pemisah adegan, "- " = butir, tebal/miring ikut. */
function fizzoFormat(text) {
  const LIT = '\u0001';
  const html = [], plain = [];
  // <b>/<i> + gaya inline: paling banyak dikenali editor (Android Html.fromHtml, editor web
  // yang membuang <strong>/<em>, atau yang cuma membaca style).
  const B = '<b style="font-weight:bold">', I = '<i style="font-style:italic">';
  const fmtHtml = (s) => esc(s.replace(/\\\*/g, LIT))
    .replace(/\*\*\*(.+?)\*\*\*/g, `${B}${I}$1</i></b>`)
    .replace(/\*\*(.+?)\*\*/g, `${B}$1</b>`)
    .replace(/\*(.+?)\*/g, `${I}$1</i>`).replace(/\u0001/g, '*');
  const fmtPlain = (s) => s.replace(/\\\*/g, LIT).replace(/\*{1,3}([^*\n]+?)\*{1,3}/g, '$1').replace(/\u0001/g, '*');
  for (let block of String(text || '').trim().split(/\n\s*\n/)) {
    block = block.trim();
    if (!block) continue;
    if (/^(\*\*\*|\[(x|×)\])$/i.test(block)) { html.push('<p>***</p>'); plain.push('***'); continue; }
    for (let line of block.split('\n')) {
      line = line.trim();
      if (!line) continue;
      if (line.startsWith('- ')) line = '• ' + line.slice(2);
      html.push(`<p>${fmtHtml(line)}</p>`);
      plain.push(fmtPlain(line));
    }
  }
  return {
    html: `<html><head><meta charset="utf-8"></head><body>${html.join('')}</body></html>`,
    plain: plain.join('\n\n'),
  };
}
async function copyRich(html, plain) {
  // Cara lama dulu, selagi masih di dalam klik: jalan juga di http biasa (HP lewat Wi-Fi)
  // dan di browser yang menolak izin clipboard. Dua format (html + teks polos) ikut.
  if (copyViaSelection(html, plain)) return true;
  try {
    if (window.ClipboardItem && navigator.clipboard?.write) {
      await navigator.clipboard.write([new ClipboardItem({
        'text/html': new Blob([html], { type: 'text/html' }),
        'text/plain': new Blob([plain], { type: 'text/plain' }),
      })]);
      return true;
    }
  } catch (e) { /* tidak diizinkan */ }
  return false;
}
function copyViaSelection(html, plain) {
  let ok = false;
  const onCopy = (e) => {
    e.clipboardData.setData('text/html', html);
    e.clipboardData.setData('text/plain', plain);
    e.preventDefault();
    ok = true;
  };
  document.addEventListener('copy', onCopy);
  try { if (!document.execCommand('copy')) ok = false; } catch (e) { ok = false; }
  document.removeEventListener('copy', onCopy);
  if (ok) return true;
  // Cadangan terakhir: salin dari elemen tersembunyi
  const div = document.createElement('div');
  div.contentEditable = 'true';
  div.style.cssText = 'position:fixed;left:-9999px;top:0;white-space:normal';
  div.innerHTML = html;
  document.body.appendChild(div);
  const sel = getSelection(), r = document.createRange();
  r.selectNodeContents(div); sel.removeAllRanges(); sel.addRange(r);
  try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
  sel.removeAllRanges(); div.remove();
  return ok;
}
function escRe(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
function termsOf(item, skema) {
  const base = [item[skema.judul], item.namaLengkap, ...(String(item.alias || '').split(','))];
  return [...new Set(base.map((s) => String(s || '').trim()).filter((s) => s.length >= 3))];
}
function detect(text) {
  const found = [];
  for (const key of KOLEKSI_DETEKSI) {
    const sk = SKEMA[key];
    for (const item of DB[key]) {
      const terms = termsOf(item, sk);
      if (!terms.length) continue;
      const re = new RegExp('(?<![\\p{L}\\p{N}])(' + terms.map(escRe).join('|') + ')(?![\\p{L}\\p{N}])', 'giu');
      const m = text.match(re);
      if (m) found.push({ key, item, n: m.length });
    }
  }
  return found.sort((a, b) => b.n - a.n);
}
function snippet(text, q) {
  const t = String(text || '');
  const i = t.toLowerCase().indexOf(q.toLowerCase());
  if (i < 0) return esc(t.slice(0, 140));
  const s = Math.max(0, i - 60);
  const part = t.slice(s, i + q.length + 90);
  return (s > 0 ? '…' : '') + esc(part).replace(new RegExp(escRe(esc(q)), 'gi'), (m) => `<mark>${m}</mark>`) + '…';
}

/* ---------------------------------------------------------------- Navigasi */
function renderNav(active) {
  const c = (k) => DB[k].length;
  const terbuka = DB.misteri.filter((m) => m.status !== 'Terjawab').length;
  const sisa = DB.checklist.filter((t) => !t.selesai).length;
  const link = (href, icon, label, count, key) =>
    `<a href="${href}" class="${active === key ? 'active' : ''}"${active === key ? ' aria-current="page"' : ''}>${ico(icon)}<span class="lbl">${label}</span>${count !== undefined ? `<span class="count">${count}</span>` : ''}</a>`;
  $('#nav').innerHTML = [
    link('#/beranda', 'home', 'Beranda', undefined, 'beranda'),
    link('#/bab', 'book', 'Bab & Tulis', DB.bab.filter((b) => !isLama(b)).length, 'bab'),
    link('#/info', 'compass', 'Info Cerita', undefined, 'info'),
    '<div class="sec">Database</div>',
    ...['karakter', 'entitas', 'benda', 'latar', 'faksi', 'lore'].map((k) => link('#/k/' + k, SKEMA[k].ikon, SKEMA[k].label, c(k), k)),
    '<div class="sec">Ingatan penulis</div>',
    link('#/rekap', 'layers', 'Rekap Misteri', undefined, 'rekap'),
    link('#/k/misteri', SKEMA.misteri.ikon, 'Misteri', terbuka, 'misteri'),
    link('#/k/ide', SKEMA.ide.ikon, 'Ide', c('ide'), 'ide'),
    link('#/checklist', 'check', 'Checklist', sisa, 'checklist'),
  ].join('');

  // Navigasi bawah HP: maksimal 5 tujuan; sisanya lewat "Lainnya" (laci menu)
  const utama = ['beranda', 'bab', 'karakter', 'rekap'];
  const tab = (href, icon, label, key) =>
    `<a href="${href}" class="${active === key ? 'active' : ''}"${active === key ? ' aria-current="page"' : ''}>${ico(icon)}<span>${label}</span></a>`;
  $('#bottomnav').innerHTML = [
    tab('#/beranda', 'home', 'Beranda', 'beranda'),
    tab('#/bab', 'book', 'Bab', 'bab'),
    tab('#/k/karakter', 'user', 'Karakter', 'karakter'),
    tab('#/rekap', 'help', 'Misteri', 'rekap'),
    `<button type="button" id="moreBtn" class="${utama.includes(active) ? '' : 'active'}" aria-controls="sidebar" aria-expanded="false">${ico('more')}<span>Lainnya</span></button>`,
  ].join('');
  $('#moreBtn').onclick = () => setDrawer(true);
}

/* ---------------------------------------------------------------- Laci menu (HP) */
function setDrawer(open) {
  const sb = $('#sidebar');
  sb.classList.toggle('open', open);
  $('#scrim').hidden = !open;
  document.body.classList.toggle('drawer-open', open);
  $('#menuToggle').setAttribute('aria-expanded', String(open));
  $('#moreBtn')?.setAttribute('aria-expanded', String(open));
  if (open) setTimeout(() => $('#menuClose')?.focus(), 50);
}
const TITLES = {
  beranda: 'MURAG', bab: 'Bab & Tulis', info: 'Info Cerita', cari: 'Cari', checklist: 'Checklist', rekap: 'Rekap Misteri',
};

function route(keepScroll) {
  if (!DB) return;
  const y = window.scrollY;
  document.body.classList.remove('focus');
  setDrawer(false);
  const parts = (location.hash.replace(/^#\/?/, '') || 'beranda').split('/').map(decodeURIComponent);
  const [p0, p1, p2] = parts;
  let active = p0;
  let title = TITLES[p0] || 'MURAG';
  if (p0 === 'k' && SKEMA[p1]) title = SKEMA[p1].label;
  if (p0 === 'bab' && p1) { const b = DB.bab.find((x) => x.id === p1); if (b) title = b.jenis === 'ekstra' ? b.judul : `Bab ${b.nomor}`; }
  $('#topTitle').textContent = title;
  document.title = title === 'MURAG' ? 'MURAG Studio' : `${title} · MURAG Studio`;
  if (p0 === 'bab' && p1) pageBab(p1);
  else if (p0 === 'bab') pageBabList();
  else if (p0 === 'k' && SKEMA[p1]) { active = p1; pageKoleksi(p1, p2); }
  else if (p0 === 'cari') pageCari(p1 || '');
  else if (p0 === 'checklist') pageChecklist();
  else if (p0 === 'info') pageInfo();
  else if (p0 === 'rekap') pageRekap();
  else { active = 'beranda'; pageBeranda(); }
  renderNav(active);
  window.scrollTo(0, keepScroll ? y : 0);
}
window.addEventListener('hashchange', route);

/* ---------------------------------------------------------------- Beranda */
function pageBeranda() {
  const m = DB.meta;
  const run = babBerjalan();
  const reboot = babUrut('reboot');
  const lama = babUrut('lama');
  const rebootBab = reboot.filter((b) => b.jenis !== 'ekstra');
  const selesai = rebootBab.filter((b) => b.status === 'publish').length;
  const draf = rebootBab.filter((b) => b.status === 'draf').length;
  const kataReboot = reboot.reduce((s, b) => s + countWords(b.isi), 0);
  const terbuka = DB.misteri.filter((x) => x.status !== 'Terjawab');
  const runWords = run ? countWords(run.isi) : 0;
  const target = run?.targetKata || 2500;
  const antrian = rebootBab.filter((b) => b.status === 'rencana');
  const tlItem = (b) => `
            <div class="tl-item ${esc(b.status)}">
              <details class="card">
                <summary><span class="t">${esc(babLabel(b))}</span>
                  ${b.jenis === 'ekstra' ? '<span class="chip ekstra">ekstra</span>' : ''}
                  <span class="chip ${esc(b.status)}">${esc(b.status)}</span>
                  <span class="spacer"></span><a class="small" href="#/bab/${esc(b.id)}">buka →</a></summary>
                <div class="body">${richText(b.ringkasan || b.arahan || '(belum ada ringkasan)')}</div>
              </details>
            </div>`;

  $('#main').innerHTML = `
    <div class="page-head"><div class="grow">
      <div class="crumb">Proyek oleh ${esc(m.penulis)} · <a href="${esc(m.wattpad)}" target="_blank" rel="noopener">Wattpad ↗</a></div>
      <h1>${esc(m.judul)}</h1>
    </div></div>

    <div class="card hero">
      <div class="premis">
        <h2 class="mb">Premis</h2>
        <p>${esc(m.premis)}</p>
        <div class="small muted">Struktur: ${esc(m.struktur || '-')}</div>
      </div>
      <div class="running">
        <div class="label">MURAG — Reboot · Bab berjalan</div>
        ${run ? `
        <h2>${esc(babLabel(run))}</h2>
        <div class="row"><span class="chip ${esc(run.status)}">${esc(run.status)}</span><span class="small muted">${fmtNum(runWords)} / ${fmtNum(target)} kata</span></div>
        <div class="progress"><i style="width:${Math.min(100, (runWords / target) * 100)}%"></i></div>
        <p class="small muted">${esc(((run.ringkasan || run.arahan || '').split('\n').filter(Boolean).slice(-1)[0] || 'Belum ada ringkasan atau arahan.').replace(/^- /, ''))}</p>
        <div class="row"><a class="btn primary" href="#/bab/${esc(run.id)}">✍ Buka bab</a><button class="btn" data-newbab>＋ Bab baru</button></div>` : `
        <h2>Belum ada bab reboot</h2>
        <p class="small muted">Cerita dimulai ulang dari Bab 1. Versi lama (Bab 1–8 Wattpad) disimpan sebagai arsip & ingatan dunia.</p>
        <button class="btn primary" data-newbab>＋ Mulai Bab 1</button>`}
      </div>
    </div>

    ${m.arahanUmum ? `<div class="card card-pad mt arahan-box"><div class="row"><h2>🧭 Arahan umum untuk Claude</h2><span class="spacer"></span><a class="small" href="#/info">ubah →</a></div><div class="small mt">${richText(m.arahanUmum)}</div></div>` : ''}

    <div class="grid stats mt">
      <div class="card stat"><b>${rebootBab.length}</b><span>Bab reboot</span></div>
      <div class="card stat"><b>${draf}</b><span>Draf</span></div>
      <div class="card stat"><b>${antrian.length}</b><span>Rencana (antrian)</span></div>
      <div class="card stat"><b>${fmtNum(kataReboot)}</b><span>Kata reboot</span></div>
      <div class="card stat"><b>${terbuka.length}</b><span>Misteri terbuka</span></div>
      <div class="card stat"><b>${DB.checklist.filter((t) => !t.selesai).length}</b><span>Checklist tersisa</span></div>
    </div>

    <div class="grid two mt">
      <div>
        <div class="row mb"><h2>Riwayat reboot</h2><span class="spacer"></span><span class="small muted">${selesai} selesai · klik untuk ringkasan</span></div>
        ${reboot.length ? `<div class="timeline">${reboot.map(tlItem).join('')}</div>` : '<div class="card empty-state">Belum ada bab. Mulai dari Bab 1.</div>'}
        <details class="card arsip mt">
          <summary><b>🗄 Arsip versi lama (Wattpad)</b> <span class="muted small">— ${lama.length} bagian, disembunyikan; tetap dipakai sebagai ingatan dunia</span></summary>
          <div class="timeline" style="margin-top:12px">${lama.map(tlItem).join('')}</div>
        </details>
      </div>
      <div>
        <div class="row mb"><h2>Misteri yang masih terbuka</h2><span class="spacer"></span><a class="small" href="#/rekap">rekap per bab + saran →</a></div>
        ${(() => { const r = babUrut('reboot').filter((b) => b.jenis !== 'ekstra' && b.status !== 'rencana').pop(); const l = r ? misteriDiBab(parseInt(r.nomor, 10)).filter((x) => x.m.status !== 'Terjawab') : []; return l.length ? `<div class="card card-pad mb"><div class="small muted mb">Disentuh di ${esc(babLabel(r))}</div>${l.map((x) => kartuMisteri(x)).join('')}</div>` : ''; })()}
        <div class="card">
          ${terbuka.map((x) => `<div class="todo"><span class="chip ${x.status === 'Terbuka' ? 'terbuka' : 'ditanam'}">${esc(x.status)}</span>
            <div><a href="#/k/misteri/${esc(x.id)}"><b>${esc(x.judul)}</b></a><div class="small muted">${esc(x.munculPertama || '')}</div></div></div>`).join('') || '<div class="empty-state">Semua misteri terjawab.</div>'}
        </div>
        <h2 class="mb mt">Catatan gaya penulisan</h2>
        <div class="card card-pad small">${richText(m.gaya || '')}<div class="mt"><a href="#/info">Ubah di Info Cerita →</a></div></div>
      </div>
    </div>`;
  $$('[data-newbab]').forEach((b) => b.onclick = buatBabBaru);
}

/* ---------------------------------------------------------------- Info cerita */
function pageInfo() {
  const m = DB.meta;
  const f = [
    ['judul', 'Judul'], ['penulis', 'Penulis'], ['wattpad', 'Link Wattpad'],
    ['arahanUmum', 'Arahan umum untuk Claude (reboot): apa yang dipertahankan, diubah, nada, target', 'area', 8],
    ['premis', 'Premis singkat', 'area'], ['sinopsis', 'Sinopsis (deskripsi Wattpad)', 'area', 9],
    ['struktur', 'Struktur & babak saat ini', 'area'], ['gaya', 'Catatan gaya penulisan', 'area', 12],
  ];
  $('#main').innerHTML = `
    <div class="page-head"><div class="grow"><h1>Info Cerita</h1><p>Identitas proyek dan aturan gaya. Tersimpan otomatis.</p></div></div>
    <div class="card form"><div class="fields">
      ${f.map(([k, l, t, rows]) => `<div class="field ${t ? 'wide' : ''}"><label>${l}</label>
        ${t ? `<textarea data-k="${k}" rows="${rows || 4}">${esc(m[k])}</textarea>` : `<input data-k="${k}" value="${esc(m[k])}">`}</div>`).join('')}
    </div></div>`;
  $$('#main [data-k]').forEach((el) => el.addEventListener('input', () => { m[el.dataset.k] = el.value; markDirty(); }));
  autoGrow($('#main'));
}

/* ---------------------------------------------------------------- Daftar bab */
function babCards(list, movable) {
  return list.map((b, i) => `
        <div class="card bab-card ${isLama(b) ? 'lama' : ''}">
          <div class="no">${b.jenis === 'ekstra' ? '✦' : esc(b.nomor)}</div>
          <div class="info">
            <h3><a href="#/bab/${esc(b.id)}">${esc(b.judul || '(tanpa judul)')}</a></h3>
            <div class="row small">
              ${b.jenis === 'ekstra' ? '<span class="chip ekstra">ekstra</span>' : ''}
              <span class="chip ${esc(b.status)}">${esc(b.status)}</span>
              ${b.arahan && !isLama(b) ? '<span class="chip rencana">ada arahan</span>' : ''}
              <span class="muted">${b.pov ? 'POV: ' + esc(b.pov) : ''}</span>
              <span class="muted">${countWords(b.isi) ? fmtNum(countWords(b.isi)) + ' kata' : ''}</span>
            </div>
            <div class="excerpt small">${esc((b.ringkasan || b.arahan || '').replace(/^- /gm, '• ').replace(/\n/g, ' '))}</div>
          </div>
          ${movable ? `<div class="acts">
            <button class="btn small ghost" data-move="${i}" data-dir="-1" ${i === 0 ? 'disabled' : ''} title="Naikkan">↑</button>
            <button class="btn small ghost" data-move="${i}" data-dir="1" ${i === list.length - 1 ? 'disabled' : ''} title="Turunkan">↓</button>
          </div>` : ''}
        </div>`).join('');
}
function pageBabList() {
  const list = babUrut('reboot');
  const lama = babUrut('lama');
  $('#main').innerHTML = `
    <div class="page-head"><div class="grow"><h1>Bab & Tulis</h1>
      <p>MURAG versi <b>reboot</b> — dimulai lagi dari Bab 1. Teks tiap bab tersimpan sebagai file di folder <code>naskah/</code>.</p></div>
      <button class="btn primary" id="newBab">＋ ${list.length ? 'Bab baru' : 'Mulai Bab 1'}</button></div>
    <div class="bab-list">
      ${babCards(list, true) || '<div class="card empty-state">Belum ada bab reboot. Klik <b>＋ Mulai Bab 1</b>, isi judul & arahan, lalu minta Claude menulisnya — atau tulis sendiri.</div>'}
    </div>
    <div class="row mt">
      <button class="btn ghost small" id="toggleArsip">${showArsip ? '▾ Sembunyikan' : '▸ Tampilkan'} arsip versi lama (${lama.length})</button>
      <span class="small muted">Bab 1–8 Wattpad: hanya ringkasan, dipakai sebagai ingatan dunia.</span>
    </div>
    ${showArsip ? `<div class="bab-list mt">${babCards(lama, false)}</div>` : ''}`;
  $('#newBab').onclick = buatBabBaru;
  $('#toggleArsip').onclick = () => { showArsip = !showArsip; pageBabList(); };
  $$('[data-move]').forEach((btn) => btn.onclick = () => {
    const i = +btn.dataset.move, j = i + +btn.dataset.dir;
    const a = list[i], c = list[j];
    [a.urutan, c.urutan] = [c.urutan, a.urutan];
    markDirty(); pageBabList();
  });
}

/* ---------------------------------------------------------------- Workspace bab */
let babTab = 'tulis';
function pageBab(id) {
  const b = DB.bab.find((x) => x.id === id);
  if (!b) { $('#main').innerHTML = '<div class="empty-state">Bab tidak ditemukan. <a href="#/bab">Kembali</a></div>'; return; }
  const urut = babUrut(b.versi);
  const idx = urut.indexOf(b);
  const prev = urut.slice(0, idx).reverse().find((x) => x.jenis !== 'ekstra');
  const next = urut[idx + 1];
  const hasText = countWords(b.isi) > 0;
  if (isLama(b) && !hasText && babTab === 'tulis') babTab = 'detail';
  if (babTab === 'ingatan' && !isPhone()) babTab = 'tulis'; // di layar lebar, Ingatan selalu tampil di samping

  $('#main').innerHTML = `
    ${isLama(b) ? '<div class="wattpad-note small">🗄 <b>Arsip versi lama (Wattpad).</b> Disembunyikan dari daftar tulis; dipakai sebagai referensi & ingatan dunia untuk versi reboot.</div>' : ''}
    <div class="crumb"><a href="#/bab">Bab & Tulis</a> ›
      ${prev ? `<a href="#/bab/${esc(prev.id)}">← ${esc(babLabel(prev))}</a>` : ''}
      ${next ? ` · <a href="#/bab/${esc(next.id)}">${esc(babLabel(next))} →</a>` : ''}</div>
    <div class="ws-head">
      <div class="ws-title">
        ${b.jenis === 'ekstra' ? '<span class="chip ekstra">ekstra</span>' : `<input class="no-input" data-f="nomor" value="${esc(b.nomor)}" title="Nomor bab" aria-label="Nomor bab" inputmode="numeric">`}
        <input class="title-input" data-f="judul" value="${esc(b.judul)}" aria-label="Judul bab">
      </div>
      <div class="ws-tools">
        <select data-f="status" aria-label="Status bab">${STATUS_BAB.map((s) => `<option ${s === b.status ? 'selected' : ''}>${s}</option>`).join('')}</select>
        <span class="spacer only-mobile"></span>
        <button class="btn small" id="focusBtn" title="Mode fokus (Esc untuk keluar)">${ico('focus')}<span>Fokus</span></button>
        <button class="btn small" id="fizzoBtn" title="Salin teks bab siap tempel ke editor Fizzo (tebal/miring ikut)">${ico('copy')}<span>Salin untuk Fizzo</span></button>
        <button class="btn small" id="exportBtn" title="Ekspor teks bab ke .txt">${ico('download')}<span>.txt</span></button>
        <button class="btn small danger" id="delBab" title="Hapus bab" aria-label="Hapus bab">${ico('trash')}</button>
      </div>
    </div>
    <div class="ws ${babTab === 'ingatan' ? 'show-mem' : ''}">
      <div>
        <div class="tabs" role="tablist">
          <button role="tab" aria-selected="${babTab === 'tulis'}" data-tab="tulis" class="${babTab === 'tulis' ? 'active' : ''}">${ico('pen')}Tulis</button>
          <button role="tab" aria-selected="${babTab === 'detail'}" data-tab="detail" class="${babTab === 'detail' ? 'active' : ''}">${ico('list')}<span class="hide-xs">Ringkasan &amp; </span>Detail</button>
          <button role="tab" aria-selected="${babTab === 'pratinjau'}" data-tab="pratinjau" class="${babTab === 'pratinjau' ? 'active' : ''}">${ico('eye')}Pratinjau</button>
          <button role="tab" aria-selected="${babTab === 'ingatan'}" data-tab="ingatan" class="only-mobile ${babTab === 'ingatan' ? 'active' : ''}">${ico('layers')}Ingatan</button>
        </div>
        <div id="tabBody"></div>
      </div>
      <aside class="card memory" id="memory"></aside>
    </div>`;

  const body = $('#tabBody');
  if (babTab === 'tulis') {
    body.innerHTML = `
      ${isLama(b) && !hasText ? `<div class="wattpad-note small">Teks lengkap bab lama ada di Wattpad${b.wattpadId ? ` (<a href="https://www.wattpad.com/${esc(b.wattpadId)}" target="_blank" rel="noopener">buka ↗</a>)` : ''}; di sini cukup ringkasannya.</div>` : ''}
      ${!isLama(b) && b.arahan ? `<details class="card arahan-box mb" ${hasText ? '' : 'open'}><summary><b>🧭 Arahan bab ini</b> <span class="small muted">— brief untuk Claude/penulis</span></summary><div class="small" style="margin-top:8px">${richText(b.arahan)}</div></details>` : ''}
      ${!isLama(b) && !b.arahan && !hasText ? `<div class="wattpad-note small">Bab masih kosong. Isi <b>Arahan</b> di tab <i>Ringkasan & detail</i> (apa yang harus terjadi di bab ini), lalu minta Claude menulisnya — atau langsung tulis di bawah.</div>` : ''}
      <div class="editor-wrap">
        <textarea class="editor" id="editor" spellcheck="false" placeholder="Mulai menulis… (Enter dua kali = paragraf baru, *miring*, **tebal**, *** = pemisah adegan)">${esc(b.isi)}</textarea>
        <div class="editor-foot">
          <span id="wc"></span><span class="spacer"></span>
          <label class="target">Target <input data-f="targetKata" type="number" inputmode="numeric" min="0" step="100" value="${esc(b.targetKata || 2000)}"></label>
          <div class="progress"><i id="wcBar"></i></div>
        </div>
      </div>`;
    const ed = $('#editor');
    const upd = () => {
      const w = countWords(ed.value);
      $('#wc').textContent = `${fmtNum(w)} kata · ${fmtNum(ed.value.length)} karakter`;
      $('#wcBar').style.width = Math.min(100, (w / (b.targetKata || 2000)) * 100) + '%';
    };
    upd();
    let memT;
    ed.addEventListener('input', () => { b.isi = ed.value; markDirty(); upd(); clearTimeout(memT); memT = setTimeout(() => renderMemory(b), 700); });
    ed.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') { e.preventDefault(); document.execCommand('insertText', false, '    '); }
    });
    // Di HP, jangan langsung memunculkan keyboard setiap membuka bab
    if (finePointer()) setTimeout(() => { ed.focus(); ed.setSelectionRange(ed.value.length, ed.value.length); }, 30);
  } else if (babTab === 'ingatan') {
    body.innerHTML = '';
  } else if (babTab === 'detail') {
    const F = [
      ...(isLama(b) ? [] : [['arahan', 'Arahan untuk Claude', 'area', 8, 'apa yang harus terjadi, tokoh, suasana, hal yang wajib/dilarang']]),
      ['pov', 'Sudut pandang (POV)'], ['waktu', 'Waktu'], ['latar', 'Latar / lokasi'], ['tokoh', 'Tokoh yang muncul'],
      ...(isLama(b) ? [['wattpadId', 'ID part Wattpad']] : []),
      ['ringkasan', 'Ringkasan kejadian', 'area', 12, '“- ” di awal baris = poin; diisi setelah bab ditulis'],
      ['catatan', 'Catatan penulis untuk bab ini', 'area', 6, 'hook, foreshadowing, hal yang harus diingat'],
    ];
    body.innerHTML = `${b.file ? `<p class="small muted">Teks naskah tersimpan di <code>MURAG Studio/${esc(b.file)}</code></p>` : ''}<div class="card form"><div class="fields">
      ${F.map(([k, l, t, rows, hint]) => `<div class="field ${t ? 'wide' : ''}"><label>${l}${hint ? ` <span class="hint">— ${hint}</span>` : ''}</label>
        ${t ? `<textarea data-f="${k}" rows="${rows}">${esc(b[k])}</textarea>` : `<input data-f="${k}" value="${esc(b[k])}">`}</div>`).join('')}
    </div></div>`;
    autoGrow(body);
  } else {
    body.innerHTML = `<div class="editor-wrap"><div class="preview">
      <p style="font-weight:700;font-size:22px;margin-bottom:1.2em">${esc(babLabel(b))}</p>${renderPreview(b.isi)}</div></div>`;
  }

  $$('[data-tab]').forEach((t) => t.onclick = () => { babTab = t.dataset.tab; pageBab(id); });
  $$('#main [data-f]').forEach((el) => el.addEventListener('input', () => {
    const k = el.dataset.f;
    b[k] = el.type === 'number' ? +el.value : el.value;
    markDirty();
    if (['ringkasan', 'tokoh', 'arahan', 'latar'].includes(k)) { clearTimeout(el._t); el._t = setTimeout(() => renderMemory(b), 700); }
  }));
  $('#main [data-f="status"]').addEventListener('change', () => pageBab(id));
  $('#focusBtn').onclick = () => { if (babTab !== 'tulis') { babTab = 'tulis'; pageBab(id); } document.body.classList.add('focus'); $('#editor')?.focus(); };
  $('#fizzoBtn').onclick = async () => {
    const btn = $('#fizzoBtn'), lbl = btn.querySelector('span');
    const w = countWords(b.isi);
    if (!w) { alert('Bab ini belum ada teksnya.'); return; }
    if (w < 1000 && !confirm(`Bab ini baru ${fmtNum(w)} kata. Fizzo menghitung update harian minimal 1.000 kata. Tetap salin?`)) return;
    const { html, plain } = fizzoFormat(b.isi);
    const ok = await copyRich(html, plain);
    if (!ok) { alert('Gagal menyalin otomatis. Pakai tombol .txt lalu salin manual.'); return; }
    // Di HP labelnya tersembunyi, jadi ikon ikut berubah jadi centang
    lbl.textContent = `Tersalin (${fmtNum(w)} kata)`;
    btn.querySelector('svg')?.replaceWith(document.createRange().createContextualFragment(ico('check')));
    btn.classList.add('primary');
    clearTimeout(btn._t);
    btn._t = setTimeout(() => {
      lbl.textContent = 'Salin untuk Fizzo';
      btn.querySelector('svg')?.replaceWith(document.createRange().createContextualFragment(ico('copy')));
      btn.classList.remove('primary');
    }, 2500);
  };
  $('#exportBtn').onclick = () => download(`${babLabel(b).replace(/[\\/:*?"<>|]/g, '')}.txt`, `${babLabel(b)}\n\n${b.isi || ''}`, 'text/plain');
  $('#delBab').onclick = () => {
    if (!confirm(`Hapus "${babLabel(b)}"? Tindakan ini tidak bisa dibatalkan (tapi cadangan otomatis tetap ada di folder data/backups).`)) return;
    DB.bab.splice(DB.bab.indexOf(b), 1); markDirty(); location.hash = '#/bab';
  };
  renderMemory(b);
}

function memBody(key, item) {
  const sk = SKEMA[key];
  const fields = sk.ingatan || [];
  const dl = fields.filter((k) => item[k]).map((k) => {
    const f = sk.fields.find((x) => x.k === k);
    return `<dt>${esc(f ? f.l : k)}</dt><dd>${esc(item[k])}</dd>`;
  }).join('');
  return `<dl style="margin:0">${dl || '<dd class="muted">Belum ada detail.</dd>'}</dl>
    <div style="margin-top:6px"><a href="#/k/${key}/${esc(item.id)}">buka di database →</a></div>`;
}
function renderMemory(b) {
  const el = $('#memory');
  if (!el) return;
  const text = [b.isi, b.ringkasan, b.tokoh, b.latar, b.arahan].join('\n');
  const found = detect(text);
  const urut = babUrut(b.versi);
  const idx = urut.indexOf(b);
  const prev = urut.slice(0, idx).reverse().find((x) => x.jenis !== 'ekstra' && x.ringkasan);
  const diBab = isLama(b) ? [] : misteriDiBab(parseInt(b.nomor, 10));
  const idDiBab = new Set(diBab.map((x) => x.m.id));
  const terbuka = DB.misteri.filter((m) => m.status !== 'Terjawab' && !idDiBab.has(m.id));
  const kindLabel = { karakter: 'tokoh', entitas: 'entitas', benda: 'benda', latar: 'lokasi', faksi: 'faksi' };
  el.innerHTML = `
    <h3>${ico('layers')} Ingatan</h3>
    <p class="small muted">Otomatis dari nama/alias yang muncul di teks, arahan, ringkasan, tokoh & latar bab ini.</p>
    ${diBab.length ? `<div class="msec"><div class="lbl">Misteri di bab ini (${diBab.length}) · <a href="#/rekap">rekap →</a></div>
      ${diBab.map((x) => kartuMisteri(x, { rencana: true })).join('')}</div>` : ''}
    <div class="msec"><div class="lbl">Terdeteksi di bab ini (${found.length})</div>
      ${found.map(({ key, item, n }) => `<details class="mem-item"><summary>${ico(SKEMA[key].ikon)} ${esc(item[SKEMA[key].judul])}
        <span class="k">${kindLabel[key]} · ${n}×</span></summary><div class="mb-body">${memBody(key, item)}</div></details>`).join('') || '<div class="small muted">Belum ada nama yang dikenali.</div>'}
    </div>
    ${b.catatan ? `<div class="msec"><div class="lbl">Catatan bab ini</div><div class="small">${richText(b.catatan)}</div></div>` : ''}
    ${prev ? `<div class="msec"><div class="lbl">Sebelumnya: ${esc(babLabel(prev))}</div>
      <details class="mem-item"><summary>Ringkasan bab sebelumnya</summary><div class="mb-body">${richText(prev.ringkasan)}</div></details></div>` : ''}
    <div class="msec"><div class="lbl">Misteri terbuka lainnya (${terbuka.length})</div>
      ${terbuka.map((m) => `<details class="mem-item"><summary>${ico('help')} ${esc(m.judul)}</summary><div class="mb-body">
        <dl style="margin:0"><dt>Petunjuk</dt><dd>${esc(m.petunjukReboot || '-')}</dd>
        ${m.saran ? `<dt>💡 Saran: itu apa?</dt><dd>${esc(m.saran)}</dd>` : ''}
        ${m.rencana ? `<dt>Rencana jawaban</dt><dd>${esc(m.rencana)}</dd>` : ''}</dl>
        <div style="margin-top:6px"><a href="#/k/misteri/${esc(m.id)}">buka →</a></div></div></details>`).join('')}
    </div>
    <div class="msec"><div class="lbl">Gaya penulisan</div><details class="mem-item"><summary>Pengingat gaya</summary><div class="mb-body">${richText(DB.meta.gaya || '')}</div></details></div>`;
}

/* ---------------------------------------------------------------- Koleksi generik */
function pageKoleksi(key, id) {
  const sk = SKEMA[key];
  const items = DB[key];
  const item = id ? items.find((x) => x.id === id) : null;
  $('#main').innerHTML = `
    <div class="page-head ${item ? 'hide-on-detail' : ''}"><div class="grow"><h1 class="h-ico">${ico(sk.ikon)} ${esc(sk.label)}</h1>
      <p class="only-mobile">${items.length} entri</p></div>
      <button class="btn primary" id="addItem">${ico('plus')}Tambah</button></div>
    ${item ? `<a class="back-link only-mobile" href="#/k/${key}">${ico('back')}Semua ${esc(sk.label)}</a>` : ''}
    <div class="coll ${item ? 'has-detail' : ''}">
      <div class="card coll-list"><input id="filter" type="search" placeholder="Saring ${esc(sk.label.toLowerCase())}…" aria-label="Saring"><div id="listBody"></div></div>
      <div id="detail">${item ? '' : `<div class="card empty-state">Pilih salah satu di kiri, atau klik <b>Tambah</b>.</div>`}</div>
    </div>`;

  const drawList = (q = '') => {
    const ql = q.toLowerCase();
    const aktif = (x) => Object.entries(x).filter(([k]) => !k.endsWith('Lama')).map(([, v]) => v).join('\n');
    const fil = items.filter((x) => !ql || aktif(x).toLowerCase().includes(ql));
    const groups = {};
    for (const x of fil) (groups[(sk.grup && x[sk.grup]) || 'Lainnya'] ||= []).push(x);
    const order = sk.grupUrut || Object.keys(groups);
    const keys = [...order.filter((g) => groups[g]), ...Object.keys(groups).filter((g) => !order.includes(g))];
    $('#listBody').innerHTML = keys.map((g) => `${sk.grup ? `<div class="grp">${esc(g)}</div>` : ''}
      ${groups[g].map((x) => `<a href="#/k/${key}/${esc(x.id)}" class="${item === x ? 'active' : ''}">${esc(x[sk.judul] || '(tanpa nama)')}<small>${esc(sk.sub(x))}</small></a>`).join('')}`).join('')
      || '<div class="empty">Tidak ada hasil.</div>';
  };
  drawList();
  $('#filter').addEventListener('input', (e) => drawList(e.target.value));
  $('#addItem').onclick = () => {
    const x = { id: uid(key) };
    x[sk.judul] = 'Baru';
    if (sk.grup) { const f = sk.fields.find((y) => y.k === sk.grup); if (f?.opt) x[sk.grup] = f.opt[0]; }
    items.push(x); markDirty(); location.hash = `#/k/${key}/${x.id}`;
  };
  if (!item) return;

  const usedIn = babUrut().filter((b) => {
    const terms = termsOf(item, sk);
    if (!terms.length) return false;
    const re = new RegExp('(?<![\\p{L}\\p{N}])(' + terms.map(escRe).join('|') + ')(?![\\p{L}\\p{N}])', 'iu');
    return re.test([b.isi, b.ringkasan, b.tokoh, b.latar].join('\n'));
  });

  let html = '<div class="card form">';
  let open = false;
  let arsip = false; // sedang di dalam <details> arsip versi lama
  const closeSec = () => { if (open) html += '</div>'; if (arsip) html += '</details>'; open = false; arsip = false; };
  const fieldHtml = (f) => {
    const v = item[f.k] ?? '';
    const lab = `<label>${esc(f.l)}${f.hint ? ` <span class="hint">— ${esc(f.hint)}</span>` : ''}</label>`;
    let input;
    if (f.type === 'select') {
      const opts = f.opt.includes(v) || !v ? f.opt : [v, ...f.opt];
      input = `<select data-k="${f.k}">${opts.map((o) => `<option ${o === v ? 'selected' : ''}>${esc(o)}</option>`).join('')}</select>`;
    } else if (f.type === 'suggest') {
      const dl = `dl-${f.k}`;
      input = `<input data-k="${f.k}" value="${esc(v)}" list="${dl}" autocomplete="off"><datalist id="${dl}">${f.opt().map((o) => `<option value="${esc(o)}"></option>`).join('')}</datalist>`;
    } else if (f.type === 'area') input = `<textarea data-k="${f.k}" rows="${f.rows || 3}">${esc(v)}</textarea>`;
    else input = `<input data-k="${f.k}" value="${esc(v)}">`;
    return `<div class="field ${f.wide || f.type === 'area' ? 'wide' : ''}">${lab}${input}</div>`;
  };
  for (let i = 0; i < sk.fields.length; i++) {
    const f = sk.fields[i];
    if (f.sec && f.arsip) {
      // Arsip versi lama: semua field berakhiran "Lama" milik entri ini, tertutup secara default.
      const isi = [];
      for (let j = i + 1; j < sk.fields.length && !sk.fields[j].sec; j++) isi.push(sk.fields[j]);
      i += isi.length;
      for (const k of Object.keys(item)) {
        if (!k.endsWith('Lama') || isi.some((x) => x.k === k)) continue;
        const dasar = sk.fields.find((x) => x.k === k.slice(0, -4));
        isi.push({ k, l: `${dasar ? dasar.l : k.slice(0, -4)} (versi lama)`, type: 'area', wide: true });
      }
      const ada = isi.filter((x) => item[x.k]);
      if (!ada.length) continue;
      closeSec();
      html += `<details class="arsip-sec"><summary>${esc(f.sec)} <span class="hint">— ${ada.length} isian, tidak dipakai di versi reboot</span></summary><div class="fields">`;
      html += ada.map(fieldHtml).join('');
      open = true; arsip = true; continue;
    }
    if (f.sec) { closeSec(); html += `<div class="sec-title">${esc(f.sec)}</div><div class="fields">`; open = true; continue; }
    if (!open) { html += '<div class="fields">'; open = true; }
    html += fieldHtml(f);
  }
  closeSec();
  if (KOLEKSI_DETEKSI.includes(key)) {
    html += `<div class="sec-title">Disebut di bab (deteksi otomatis)</div><div class="row">${usedIn.map((b) => `<a class="chip" href="#/bab/${esc(b.id)}">${esc(babLabel(b))}</a>`).join('') || '<span class="muted small">Belum terdeteksi di bab mana pun.</span>'}</div>`;
  }
  html += `<div class="row mt"><span class="spacer"></span><button class="btn small danger" id="delItem">${ico('trash')}Hapus</button></div></div>`;
  $('#detail').innerHTML = html;
  autoGrow($('#detail'));
  $$('#detail [data-k]').forEach((el) => el.addEventListener(el.tagName === 'SELECT' ? 'change' : 'input', () => {
    item[el.dataset.k] = el.value; markDirty();
    if (el.dataset.k === sk.judul || el.dataset.k === sk.grup) drawList($('#filter').value);
  }));
  $('#delItem').onclick = () => {
    if (!confirm(`Hapus "${item[sk.judul]}" dari ${sk.label}?`)) return;
    items.splice(items.indexOf(item), 1); markDirty(); location.hash = `#/k/${key}`;
  };
}

/* ---------------------------------------------------------------- Pencarian */
function pageCari(q) {
  $('#main').innerHTML = `
    <div class="page-head"><div class="grow"><h1>Cari</h1><p id="cariInfo"></p></div></div>
    <div class="search-page"><input id="cariInput" type="search" placeholder="Nama tokoh, benda, kejadian…" autocomplete="off" aria-label="Cari" value="${esc(q)}"></div>
    <div id="cariHasil"></div>`;
  const inp = $('#cariInput');
  let t;
  inp.addEventListener('input', () => {
    clearTimeout(t);
    t = setTimeout(() => {
      history.replaceState(null, '', '#/cari/' + encodeURIComponent(inp.value)); // tanpa render ulang → fokus tidak hilang
      $('#globalSearch').value = inp.value;
      cariHasil(inp.value);
    }, 200);
  });
  if (!q) setTimeout(() => inp.focus(), 30);
  cariHasil(q);
}
function cariHasil(q) {
  const res = [];
  if (q.trim()) {
    const ql = q.toLowerCase();
    for (const b of babUrut()) {
      for (const [k, l] of [['ringkasan', 'ringkasan'], ['isi', 'teks'], ['arahan', 'arahan'], ['catatan', 'catatan']]) {
        if (String(b[k] || '').toLowerCase().includes(ql)) res.push({ kind: `Bab · ${l}`, title: babLabel(b), href: `#/bab/${b.id}`, snip: snippet(b[k], q) });
      }
    }
    for (const key of Object.keys(SKEMA)) {
      const sk = SKEMA[key];
      for (const x of DB[key]) {
        const cocok = (f) => f.k && String(x[f.k] || '').toLowerCase().includes(ql);
        const hit = sk.fields.find((f) => cocok(f) && !f.k.endsWith('Lama')) || sk.fields.find(cocok); // arsip lama terakhir
        if (hit) res.push({ kind: `${sk.label} · ${hit.l}`, title: x[sk.judul], href: `#/k/${key}/${x.id}`, snip: snippet(x[hit.k], q) });
      }
    }
    for (const k of ['arahanUmum', 'premis', 'sinopsis', 'gaya', 'struktur']) {
      if (String(DB.meta[k] || '').toLowerCase().includes(ql)) res.push({ kind: 'Info cerita', title: k, href: '#/info', snip: snippet(DB.meta[k], q) });
    }
  }
  $('#cariInfo').textContent = q.trim() ? `${res.length} hasil untuk “${q}”` : 'Cari di semua bab, database, dan info cerita.';
  $('#cariHasil').innerHTML = res.map((r) => `<a class="card result" href="${r.href}"><div class="kind">${esc(r.kind)}</div><h3>${esc(r.title)}</h3><div class="snip small">${r.snip}</div></a>`).join('');
}

/* ---------------------------------------------------------------- Checklist */
function pageChecklist() {
  const list = DB.checklist;
  $('#main').innerHTML = `
    <div class="page-head"><div class="grow"><h1>Checklist</h1><p>Perbaikan konsistensi & tugas penulis. Klik teks untuk mengubah.</p></div>
      <button class="btn primary" id="addTodo">＋ Tambah</button></div>
    <div class="card">${list.map((t, i) => `
      <div class="todo ${t.selesai ? 'done' : ''}">
        <input type="checkbox" data-i="${i}" ${t.selesai ? 'checked' : ''}>
        <textarea class="txt" data-i="${i}" rows="1">${esc(t.teks)}</textarea>
        ${t.kategori ? `<span class="chip">${esc(t.kategori)}</span>` : ''}
        <button class="btn small ghost danger" data-del="${i}" title="Hapus">✕</button>
      </div>`).join('') || '<div class="empty-state">Kosong.</div>'}</div>`;
  autoGrow($('#main'));
  $$('#main input[type=checkbox]').forEach((c) => c.onchange = () => { list[c.dataset.i].selesai = c.checked; markDirty(); pageChecklist(); renderNav('checklist'); });
  $$('#main .txt').forEach((t) => t.addEventListener('input', () => { list[t.dataset.i].teks = t.value; markDirty(); }));
  $$('[data-del]').forEach((b) => b.onclick = () => { list.splice(+b.dataset.del, 1); markDirty(); pageChecklist(); renderNav('checklist'); });
  $('#addTodo').onclick = () => { list.unshift({ id: uid('todo'), teks: '', selesai: false }); markDirty(); pageChecklist(); $('#main .txt')?.focus(); };
}

/* ---------------------------------------------------------------- Lain-lain */
function autoGrow(root) {
  $$('textarea:not(.editor)', root).forEach((t) => {
    const fit = () => { t.style.height = 'auto'; t.style.height = t.scrollHeight + 2 + 'px'; };
    fit(); t.addEventListener('input', fit);
  });
}
function download(name, content, type) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([content], { type }));
  a.download = name; a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 2000);
}
function applyTheme(t) {
  if (t) document.documentElement.dataset.theme = t; else delete document.documentElement.dataset.theme;
  // warna bilah status HP ikut tema yang dipilih
  $$('meta[name="theme-color"]').forEach((m) => {
    if (!m.dataset.orig) m.dataset.orig = m.content;
    m.content = t === 'dark' ? '#131417' : t === 'light' ? '#f4f1ea' : m.dataset.orig;
  });
}
try { applyTheme(localStorage.getItem('murag-theme')); } catch (e) { /* abaikan */ }
$('#btnTheme').onclick = () => {
  const cur = document.documentElement.dataset.theme
    || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  const nxt = cur === 'dark' ? 'light' : 'dark';
  applyTheme(nxt);
  try { localStorage.setItem('murag-theme', nxt); } catch (e) { /* abaikan */ }
};
$('#btnBackup').onclick = () => download(`murag-cadangan-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(DB, null, 2), 'application/json');
$('#menuToggle').onclick = () => setDrawer(!$('#sidebar').classList.contains('open'));
$('#menuClose').onclick = () => setDrawer(false);
$('#scrim').onclick = () => setDrawer(false);
$('#exitFocus').onclick = () => document.body.classList.remove('focus');
$('#btnPhone').onclick = bukaDiHP;
hydrateIcons();

/* ---------------------------------------------------------------- Buka di HP (QR) */
async function bukaDiHP() {
  setDrawer(false);
  let info = {};
  if (ONLINE) {
    // tautan berisi kunci (+ alamat web app kalau belum ditanam di config.js), di bagian #… yang tidak dikirim ke GitHub
    const q = new URLSearchParams({ k: GAS_KEY });
    if (!GAS_OK.test(CFG.gas || '')) q.set('gas', GAS_URL);
    info = { online: true, lan: true, local: true, url: location.origin + location.pathname + '#sambung&' + q };
  } else {
    try { info = await (await fetch('/api/lan')).json(); } catch (e) { /* server lama */ }
  }
  const dlg = document.createElement('div');
  dlg.className = 'modal-wrap';
  dlg.innerHTML = `<div class="modal card" role="dialog" aria-modal="true" aria-labelledby="hpTitle">
    <div class="row"><h2 id="hpTitle">${ico('phone')} Buka di HP</h2><span class="spacer"></span>
      <button class="icon-btn" data-close aria-label="Tutup">${ico('x')}</button></div>
    ${info.online ? (GAS_KEY ? `<p>Scan dengan kamera HP (boleh pakai internet apa saja, komputer tidak perlu menyala). Setelah terbuka, pilih <b>Tambahkan ke layar utama</b> di menu browser supaya jadi seperti aplikasi.</p>
      <div class="qr" id="qr"><span class="muted small">Membuat QR…</span></div>
      <div class="field"><label for="hpUrl">Atau salin tautan ini ke HP</label><input id="hpUrl" readonly value="${esc(info.url)}"></div>
      <div class="row mt"><button class="btn" id="copyUrl">Salin tautan</button><span class="spacer"></span><button class="btn ghost danger" id="putusSambung">Keluarkan perangkat ini</button></div>
      <p class="small muted">Tautan ini berisi kunci akses. Jangan dibagikan: siapa pun yang punya bisa membaca dan mengubah naskah.</p>`
      : '<p>Perangkat ini belum tersambung. Masukkan kunci akses dulu.</p>')
    : !info.lan ? `<p>Server sedang jalan dalam mode <b>komputer saja</b>.</p>
      <ol class="steps"><li>Tutup jendela hitam server.</li><li>Klik dua kali <b>Jalankan untuk HP (Wi-Fi).bat</b>.</li>
      <li>Kalau Windows bertanya soal firewall, izinkan untuk <b>Private networks</b>.</li><li>Klik tombol ini lagi untuk dapat QR.</li></ol>
      <p class="small muted">HP dan komputer harus tersambung ke Wi-Fi yang sama.</p>`
    : !info.local ? '<p>Kamu sudah membuka MURAG Studio dari HP. Simpan ke layar utama lewat menu browser supaya gampang dibuka lagi.</p>'
    : `<p>Scan dengan kamera HP (Wi-Fi yang sama). Setelah terbuka, pilih <b>Tambahkan ke layar utama</b> di menu browser supaya jadi seperti aplikasi.</p>
      <div class="qr" id="qr"><span class="muted small">Membuat QR…</span></div>
      <div class="field"><label for="hpUrl">Atau ketik alamat ini di HP</label><input id="hpUrl" readonly value="${esc(info.url)}"></div>
      <div class="row mt"><button class="btn" id="copyUrl">Salin alamat</button><span class="spacer"></span></div>
      <p class="small muted">Alamat ini berisi kunci akses. Jangan dibagikan: siapa pun yang punya bisa mengubah naskah selama komputer menyala.</p>`}
  </div>`;
  document.body.appendChild(dlg);
  const close = () => { dlg.remove(); document.removeEventListener('keydown', onKey); };
  const onKey = (e) => { if (e.key === 'Escape') close(); };
  document.addEventListener('keydown', onKey);
  dlg.addEventListener('click', (e) => { if (e.target === dlg || e.target.closest('[data-close]')) close(); });
  dlg.querySelector('[data-close]').focus();
  if (!info.lan || !info.local || (info.online && !GAS_KEY)) return;
  if (info.online) $('#putusSambung').onclick = () => {
    if (dirty && !confirm('Masih ada perubahan yang belum tersimpan. Tetap keluarkan perangkat ini?')) return;
    if (!confirm('Hapus kunci akses dari perangkat ini? Data di server tidak ikut terhapus.')) return;
    simpanan.set('murag-kunci', ''); GAS_KEY = ''; DB = null; dirty = false; clearTimeout(saveTimer);
    close(); $('#nav').innerHTML = ''; $('#bottomnav').innerHTML = ''; pageSambung();
  };
  $('#copyUrl').onclick = async () => {
    try { await navigator.clipboard.writeText(info.url); $('#copyUrl').textContent = 'Tersalin'; } catch (e) { $('#hpUrl').select(); }
  };
  try {
    if (!window.QRCode) await new Promise((ok, fail) => {
      const s = document.createElement('script');
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
      s.onload = ok; s.onerror = fail; document.head.appendChild(s);
    });
    $('#qr').innerHTML = '';
    new window.QRCode($('#qr'), { text: info.url, width: 220, height: 220, colorDark: '#000000', colorLight: '#ffffff' });
  } catch (e) {
    $('#qr').innerHTML = '<span class="muted small">QR butuh internet sebentar. Ketik alamat di bawah saja.</span>';
  }
}
let searchT;
$('#globalSearch').addEventListener('input', (e) => {
  clearTimeout(searchT);
  searchT = setTimeout(() => { location.hash = '#/cari/' + encodeURIComponent(e.target.value); }, 250);
});

load();
