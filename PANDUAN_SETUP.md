# Panduan Setup dan Eksekusi Sistem

Dokumen ini memuat langkah-langkah teknis untuk menjalankan sistem deteksi phishing secara lokal. Aplikasi ini mendukung arsitektur **Dua Mode (Dual-Mode)** untuk model pendeteksi teks (NLP).

## Persyaratan Sistem
Pastikan perangkat lunak berikut telah terinstal:
- Docker dan Docker Desktop (harus dalam kondisi **Running**)

## 1. Konfigurasi Environment Variable
1. Salin file `.env.example` di direktori utama proyek menjadi `.env` (jika belum ada).
2. Pastikan `DATABASE_URL` di dalam file `.env` menunjuk ke `db` (bukan localhost) jika menjalankan via Docker:
   ```env
   DATABASE_URL=postgresql+asyncpg://postgres:postgres@db:5432/cimb_phishing_db
   ```

---

## 2. Menjalankan Sistem Penuh (Docker Compose)

Sistem memiliki dua mode untuk backend. Silakan pilih salah satu sesuai kebutuhan.

### Opsi A: Mode Demo Default (SANGAT DISARANKAN UNTUK PRESENTASI)
Mode ini menggunakan image ringan tanpa mengunduh framework Deep Learning (`torch`, `transformers`) atau *artifact* model berukuran besar. Mode ini mengaktifkan algoritma deteksi **rule-based fallback** yang sangat stabil, meminimalisir waktu build, dan mengurangi penggunaan RAM & CPU.

Jalankan perintah berikut di root direktori proyek:
```bash
docker compose up --build -d
```

### Opsi B: Mode ML Full (IndoBERT)
Mode ini mengaktifkan model Deep Learning secara penuh. Karena membutuhkan instalasi `torch` dan `transformers`, waktu build akan lebih lama dan ukuran container akan lebih besar. Pastikan juga Anda sudah memiliki folder model di `backend/app/ml/model/indobert-phishing` karena model besar *tidak* disimpan di Git Repository!

Jalankan perintah berikut:
```bash
docker compose -f docker-compose.yml -f docker-compose.ml.yml up --build -d
```

**Verifikasi Mode yang Berjalan**
Lakukan pengujian pada endpoint analisis (`POST /api/v1/analyze`). Perhatikan bagian balasan JSON pada kunci `nlp_method`.
- Jika `nlp_method` bernilai `"rule_based_fallback"`, berarti Mode Demo aktif.
- Jika `nlp_method` bernilai `"indobert"`, berarti Mode ML Full berhasil diload.

---

### Kredensial Admin Default
Jika database dalam kondisi kosong saat pertama kali dijalankan, proses *seeding* otomatis akan membuatkan akun admin bawaan berikut:
- **Username**: `admin`
- **Password**: `changeme123` (harap ganti di *production*)

### Akses Aplikasi
- **Frontend / Aplikasi Utama**: `http://localhost`
- **Backend API Docs (Swagger UI)**: `http://localhost/api/docs`

---
