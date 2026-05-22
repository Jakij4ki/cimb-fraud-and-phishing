# Panduan Setup dan Eksekusi Sistem

Dokumen ini memuat langkah-langkah teknis untuk menjalankan sistem deteksi phishing secara lokal.

## Persyaratan Sistem
Pastikan perangkat lunak berikut telah terinstal:
- Python 3.11 atau versi lebih baru
- Node.js (versi 16 atau lebih baru) dan npm
- Docker dan Docker Compose

## 1. Konfigurasi Environment Variable
1. Salin file `.env.example` di direktori utama proyek menjadi `.env`.
2. Sesuaikan nilai variabel pada file `.env` dengan konfigurasi lokal keras (misalnya kredensial database).

## 2. Menjalankan Database dan Redis
Sistem membutuhkan PostgreSQL dan Redis yang dijalankan melalui Docker. Jalankan perintah berikut pada root direktori proyek:
```bash
docker-compose up -d db redis
```
Pastikan kontainer beroperasi normal.

## 3. Setup Backend
1. Masuk ke direktori backend:
   ```bash
   cd backend
   ```
2. (Opsional) Buat dan aktifkan Virtual Environment:
   - Windows: `python -m venv venv` dan `.\venv\Scripts\activate`
   - Linux/macOS: `python3 -m venv venv` dan `source venv/bin/activate`
3. Instal dependensi:
   ```bash
   pip install -r requirements.txt
   ```

## 4. Inisialisasi Data (Seeding)
Untuk mengisi struktur dan data awal ke dalam database, jalankan skrip berikut dari direktori root proyek:
```bash
python database/seed.py
python database/seed_riskwords_js.py
```

## 5. Pelatihan Model Machine Learning
Jika model (NLP, Random Forest, XGBoost) belum tersedia di dalam direktori `backend/app/ml/model/`, jalankan proses pelatihan model. Pastikan dataset berada di folder `backend/data/` terlebih dahulu.
```bash
cd backend
python app/ml/train_nlp.py
python app/ml/train_url_raw.py
python app/ml/train_url_features.py
```

## 6. Menjalankan Backend Server
Setelah inisialisasi selesai, jalankan server FastAPI:
```bash
cd backend
uvicorn app.main:app --reload
```
API dapat diakses melalui `http://localhost:8000`. Dokumentasi interaktif (Swagger UI) tersedia pada `http://localhost:8000/docs`.

## 7. Setup Frontend
1. Buka terminal baru dan masuk ke direktori frontend:
   ```bash
   cd frontend
   ```
2. Instal dependensi Node.js:
   ```bash
   npm install
   ```
3. Jalankan development server:
   ```bash
   npm run dev
   ```
Frontend akan berjalan dan dapat diakses pada alamat yang diberikan oleh Vite (umumnya `http://localhost:5173`).

## Alternatif: Eksekusi Penuh via Docker
Untuk menjalankan seluruh layanan (Backend, Frontend, Database, Redis, dan Nginx) secara terintegrasi menggunakan Docker Compose:
```bash
docker-compose up -d --build
```
Aplikasi frontend akan terekspos pada port 80 (`http://localhost`), sedangkan rute API akan diteruskan oleh Nginx ke `http://localhost/api`.
