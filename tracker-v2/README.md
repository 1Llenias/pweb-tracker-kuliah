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
