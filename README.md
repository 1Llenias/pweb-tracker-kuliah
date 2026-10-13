# Task Tracker Kuliah

Aplikasi kecil untuk mencatat tugas kuliah. Proyek memiliki dua versi:

- [`tracker-v1/`](tracker-v1/) — aplikasi JavaScript dengan state di array, rendering, form, event delegation, filter, localStorage, dan pengurutan berdasarkan deadline.
- [`tracker-v2/`](tracker-v2/) — lanjutan REST API, termasuk Mock API Node.js, state loading/error/empty, pencarian debounce, dan optimistic update.

## Menjalankan v1

Buka `tracker-v1/index.html` melalui browser atau Live Server.

## Menjalankan v2

Pastikan Node.js tersedia. Dari folder `tracker-v2`, jalankan:

```powershell
node mock-api.js
```

Lalu buka <http://127.0.0.1:3000>. Mock API menyimpan data di memori proses, sehingga data kembali ke seed awal ketika server dimulai ulang. Detail endpoint dan simulasi koneksi ada di [`tracker-v2/README.md`](tracker-v2/README.md).

## Log penggunaan AI

AI digunakan sebagai pendamping untuk menyusun struktur, mengimplementasikan fitur bertahap, membuat Mock API lokal, dan menulis dokumentasi. Ringkasan prompt pengguna dan bantuan yang diberikan:

| Tahap | Ringkasan prompt pengguna | Bantuan AI |
| --- | --- | --- |
| Struktur | Mulai mengerjakan `pweb-tracker-kuliah` dari struktur berdasarkan gambar tugas. | Membuat `index.html`, `style.css`, dan `app.js` untuk kerangka Task Tracker Kuliah. |
| Rendering | Lanjut ke tahap rendering. | Membuat array data contoh dan `render()` untuk daftar, counter, dan empty state. |
| Form | Lanjut ke tahap form. | Menambahkan validasi judul/deadline dan penambahan tugas ke state. |
| Event delegation | Lanjut ke tahap delegation. | Menangani checkbox selesai dan hapus melalui listener pada parent daftar. |
| Filter | Menanyakan isi tahap filter, lalu meminta implementasi filter. | Menambahkan filter Semua/Aktif/Selesai dan state tombol aktif. |
| Validasi duplikat | Mencegah tugas dengan judul sama kecuali mata kuliahnya berbeda. | Membandingkan judul tanpa membedakan kapitalisasi bersama mata kuliah. |
| Bonus v1 | Menyimpan ke localStorage dan mengurutkan deadline terdekat. | Menambahkan load/save localStorage dan pengurutan deadline. |
| Pemisahan versi | Meminta folder `tracker-v1` dan `tracker-v2`, dengan v1 sampai localStorage dan kode API di v2. | Memisahkan file HTML/CSS/JS ke dua folder sesuai tahap. |
| REST API | Memulai alur GET → render state → POST → PATCH/DELETE → error handling. | Menambahkan pemuatan API, state loading/error/empty, POST, PATCH, DELETE, dan penanganan error. |
| Mock API | Menjelaskan backend belum disiapkan dan meminta dibuatkan. | Membuat server Node.js tanpa dependency untuk halaman dan endpoint tugas/mata kuliah. |
| Bonus v2 | Menambahkan pencarian debounce dan optimistic update. | Menambahkan pencarian 300 ms serta perubahan optimistic untuk tambah, status selesai, dan hapus dengan rollback saat gagal. |
| Dokumentasi | Meminta README yang berisi log penggunaan AI. | Menulis README ini dan merangkum bantuan AI sepanjang pengerjaan. |

### Catatan verifikasi

- `git diff --check` dijalankan setelah beberapa perubahan dan tidak melaporkan masalah whitespace.
- Pengujian fungsional menyeluruh terhadap semua alur UI/API belum dilakukan.
- Mock API dibuat untuk kebutuhan latihan; datanya hanya berada di memori dan bukan database permanen.

### Pernyataan penggunaan AI

AI membantu menghasilkan dan mengubah kode berdasarkan instruksi serta pemeriksaan proyek. Pengguna tetap perlu membaca, menjalankan, memahami, dan menjelaskan kode yang dikumpulkan, serta menyesuaikan log ini bila ada perubahan atau penggunaan AI tambahan.
