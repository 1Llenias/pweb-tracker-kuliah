# Task Tracker Kuliah v2

Versi ini memakai Mock API Node.js bawaan tanpa dependency tambahan. Data disimpan di memori proses, jadi akan kembali ke data awal saat server dimatikan.

## Menjalankan

Pastikan Node.js terpasang, lalu dari folder `tracker-v2` jalankan:

```powershell
node mock-api.js
```

Buka alamat yang ditampilkan di terminal, secara default `http://127.0.0.1:3000`.

Endpoint yang tersedia:

- `GET /api/tugas`
- `POST /api/tugas`
- `PATCH /api/tugas/:id`
- `DELETE /api/tugas/:id`
- `GET /api/matkul`

## Simulasi koneksi di browser

Buka DevTools Console pada halaman tracker, lalu jalankan:

```js
__API.setMode("offline");
__API.reload();
```

Mode `offline` menampilkan error koneksi di halaman. Untuk melihat skeleton loading:

```js
__API.setMode("lambat");
__API.reload();
```

Kembalikan ke koneksi normal dengan `__API.setMode("normal")`, lalu muat ulang data memakai `__API.reload()`.

Pencarian tugas menunggu 300 ms setelah input berhenti sebelum memfilter judul dan mata kuliah. Tambah, perubahan status, dan penghapusan tampil secara optimistic; jika server menolak request atau koneksi gagal, tampilan dikembalikan dan pesan error ditampilkan.
