# SafeCheck — Anti-Phishing Detection System
 
> **Lindungi Diri dari Penipuan Digital**
>
> Sistem deteksi pesan phishing berbasis web untuk ekosistem perbankan digital CIMB Niaga.
> Capstone Project FILKOM Universitas Brawijaya — Semester Genap 2025/2026
 
---
 
## Daftar Isi
 
- [Tentang Proyek](#tentang-proyek)
- [Arsitektur Sistem](#arsitektur-sistem)
- [Tech Stack](#tech-stack)
- [Cara Kerja](#cara-kerja)
- [Struktur Folder](#struktur-folder)
- [Setup Development](#setup-development)
- [Setup Production](#setup-production)
- [Training Model ML](#training-model-ml)
- [Dataset](#dataset)
- [API Documentation](#api-documentation)
- [Security Checklist](#security-checklist)
- [Tim Pengembang](#tim-pengembang)

---
 
## Tentang Proyek
 
SafeCheck adalah sistem anti-phishing berbasis web yang membantu nasabah perbankan mendeteksi pesan penipuan secara otomatis dalam hitungan detik. Sistem ini dirancang agar dapat digunakan oleh semua kalangan usia, mulai dari generasi muda hingga lansia.
 
### Fitur Utama
 
- **Analisis Pesan Instan** — Paste pesan SMS, WhatsApp, Email, atau URL dan dapatkan hasil dalam 3 detik
- **Risk Score 0–100** — Skor risiko dengan penjelasan Bahasa Indonesia yang mudah dipahami
- **Live Highlight** — Kata-kata manipulatif di-highlight secara real-time saat mengetik
- **Typosquatting Detection** — Mendeteksi domain yang sangat mirip dengan bank resmi
- **Sistem Pelaporan** — Laporan dengan nomor tiket yang bisa dilacak statusnya
- **Pusat Edukasi** — Materi literasi keamanan digital dengan quiz dan badge gamifikasi
- **Admin Dashboard** — Panel triage, analytics, dan manajemen whitelist

### Algoritma Scoring
 
| Kondisi | Poin |
|---|---|
| URL / No. Telp / Email tidak ada di whitelist resmi | +80 |
| Pola bahasa manipulatif terdeteksi ML | +20 |
| Hanya teks (tanpa URL/no) + pola manipulatif | Auto 100 |
 
**Risk Level:** `0–30` Aman · `31–70` Waspada · `71–100` Bahaya
 
---
 
## Arsitektur Sistem
 
```
User Browser
     │
     ▼
  Nginx (Port 80)
  ├── /          → Frontend React (Static)
  └── /api/*     → Backend FastAPI
                      │
          ┌───────────┼───────────┐
          ▼           ▼           ▼
      PostgreSQL    Redis      ML Models
      (Database)  (Rate Limit) (IndoBERT +
                               URL Classifier)
```
 
### Pipeline Analisis
 
```
Input Pesan
     │
     ├── Regex Extractor → URL, No. Telp, Email
     │
     ├── Whitelist Checker → DB PostgreSQL
     │       └── Typosquatting Detector
     │
     ├── NLP Scorer → IndoBERT fine-tuned
     │
     ├── URL Scorer → RandomForest + XGBoost
     │
     └── Weighted Scorer → Risk Score 0-100
                 │
                 └── Explainer → Penjelasan Bahasa Indonesia
```
 
---
 
## Tech Stack
 
### Backend
- **FastAPI** (Python 3.10+) — REST API async
- **PostgreSQL 15** — Database utama
- **SQLAlchemy 2.0** — ORM async
- **Redis 7** — Rate limiting
- **IndoBERT** (`indolem/indobert-base-uncased`) — NLP classifier
- **RandomForest + XGBoost** — URL phishing classifier
- **Alembic** — Database migrations

### Frontend
- **React 18** + **Vite** — UI framework
- **Tailwind CSS 3** — Styling
- **Zustand** — State management
- **Axios** — HTTP client
- **Recharts** — Charts & analytics
- **Framer Motion** — Animasi
- **Lucide React** — Icon library

### Infrastructure
- **Docker Compose** — Container orchestration
- **Nginx** — Reverse proxy + static file serving

---
 
## Cara Kerja
 
### Untuk User Biasa
 
1. Buka halaman **Cek Pesan** di SafeCheck
2. Paste pesan mencurigakan yang diterima (SMS, WA, Email, atau URL)
3. Pilih jenis pesan dan klik **Analisis Sekarang**
4. Lihat hasil: Risk Score, penjelasan, dan komponen yang terdeteksi
5. Jika mencurigakan, klik **Laporkan Pesan Ini** untuk mendapat nomor tiket

### Untuk Admin
 
1. Login ke `/admin/login`
2. Dashboard menampilkan statistik laporan real-time
3. Triage laporan masuk: konfirmasi, tolak, atau eskalasi
4. Kelola whitelist domain dan nomor telepon resmi
5. Pantau tren modus penipuan di halaman Analytics

---
 
## Struktur Folder
 
```
phishing-guard/
│
├── frontend/                   # React.js + Tailwind CSS
│   ├── src/
│   │   ├── assets/             # Logo, ilustrasi SVG
│   │   ├── components/         # Komponen reusable
│   │   │   ├── ui/             # Button, Badge, RiskMeter, dll
│   │   │   ├── layout/         # Navbar, Footer, AdminLayout
│   │   │   ├── analysis/       # MessageInput, ScanAnimation, RiskResult
│   │   │   ├── report/         # ReportForm, TicketStatus
│   │   │   ├── education/      # LearningCard, QuizWidget, BadgeDisplay
│   │   │   └── admin/          # TriageTable, StatsChart, ThreatMap
│   │   ├── pages/              # Halaman-halaman utama
│   │   ├── hooks/              # Custom React hooks
│   │   ├── services/           # API service layer
│   │   ├── store/              # Zustand state management
│   │   ├── utils/              # Helper functions
│   │   └── constants/          # Warna, kata kunci risiko
│   └── Dockerfile
│
├── backend/                    # FastAPI Python
│   ├── app/
│   │   ├── api/v1/routes/      # Endpoint API
│   │   ├── core/               # Config, database, security
│   │   ├── models/             # SQLAlchemy ORM models
│   │   ├── schemas/            # Pydantic request/response schemas
│   │   ├── services/           # Business logic (extractor, scorer, dll)
│   │   └── ml/                 # Script training + inference ML
│   ├── data/                   # Dataset training (tidak di-commit)
│   ├── tests/                  # Unit tests
│   └── Dockerfile
│
├── database/
│   ├── init.sql                # Schema database
│   ├── seed.py                 # Script seeding data awal
│   └── seed_riskwords_js.py    # Generate riskWords.js dari dataset
│
├── nginx/
│   └── nginx.conf              # Konfigurasi reverse proxy
│
├── docker-compose.yml
├── .gitignore
└── README.md
```
 
---
 
## Setup Development
 
### Prasyarat
 
- Python 3.10+
- Node.js 20+
- Docker Desktop (sudah running)
- Git

### Langkah-langkah
 
**1. Clone repository**
 
```bash
git clone https://github.com/username/phishing-guard.git
cd phishing-guard
```
 
**2. Salin dan isi file environment**
 
```bash
cp backend/.env.example backend/.env
```
 
Buka `backend/.env` dan isi variabel berikut minimal:
 
```env
DATABASE_URL=postgresql+asyncpg://postgres:password@localhost:5432/safecheck
SECRET_KEY=your-very-secret-key-change-this
ADMIN_DEFAULT_PASSWORD=your-admin-password
ENVIRONMENT=development
```
 
**3. Jalankan database dan Redis**
 
```bash
docker compose up -d db redis
```
 
Tunggu sekitar 10 detik lalu cek status:
 
```bash
docker compose ps
```
 
Pastikan `db` dan `redis` statusnya `healthy`.
 
**4. Install dependencies backend**
 
```bash
cd backend
pip install -r requirements.txt
```
 
**5. Seed database**
 
```bash
# Seed whitelist, keywords, admin, dan data dummy
python database/seed.py
 
# Generate file riskWords.js untuk frontend
python database/seed_riskwords_js.py
```
 
**6. Jalankan backend**
 
```bash
uvicorn app.main:app --reload
```
 
Backend berjalan di: `http://localhost:8000`
API docs tersedia di: `http://localhost:8000/api/docs`
 
**7. Jalankan frontend** (terminal baru)
 
```bash
cd frontend
npm install
npm run dev
```
 
Frontend berjalan di: `http://localhost:3000`
 
---
 
## Setup Production

Sistem mendukung arsitektur **Dual-Mode** untuk backend NLP.

### Opsi A: Mode Demo Default (SANGAT DISARANKAN)
Mode ini sangat ringan dan cepat karena tidak mengunduh dependensi Deep Learning. Sistem akan menggunakan *rule-based fallback* untuk deteksi teks.

```bash
# Build dan jalankan mode default
docker compose up -d --build
```

### Opsi B: Mode ML Full (IndoBERT)
Mode ini membutuhkan folder model ML (`app/ml/model/indobert-phishing`) dan menginstall dependensi besar seperti `torch` dan `transformers`. 

```bash
# Build dan jalankan mode ML Full
docker compose -f docker-compose.yml -f docker-compose.ml.yml up -d --build
```

### Manajemen Container
```bash
# Cek semua service berjalan
docker compose ps
 
# Lihat log jika ada masalah
docker compose logs -f
```
 
Aplikasi berjalan di: `http://localhost`
 
> **Catatan:** Untuk production sungguhan, pastikan sudah konfigurasi HTTPS dan update `CORS_ORIGINS` di `.env`.
 
---
 
## Arsitektur ML & Validasi Mode Inference

SafeCheck menyediakan dua mode inference. Mode Demo Default menggunakan rule-based fallback agar aplikasi ringan, stabil, dan cepat dijalankan melalui Docker Compose. Mode ML Full menggunakan IndoBERT dengan dependency `torch` dan `transformers` yang dipisahkan melalui `Dockerfile.ml` dan `docker-compose.ml.yml`.

Pada validasi Mode ML Full, model IndoBERT berhasil dimuat dengan log `"NLP model loaded successfully"` dan `"NLP mode: IndoBERT active"`. Endpoint `POST /api/v1/analyze` juga telah tervalidasi mengembalikan `"nlp_method": "indobert"` dengan confidence tinggi pada contoh pesan phishing.

Untuk meningkatkan stabilitas deployment, backend dilengkapi endpoint `/health` dan Docker healthcheck. Service Nginx dikonfigurasi agar hanya berjalan setelah backend berstatus healthy, sehingga tidak lagi terjadi race condition saat startup container.

Untuk training penuh, jalankan berurutan:
 
```bash
cd backend
 
# 1. Fine-tune IndoBERT untuk klasifikasi teks phishing
python app/ml/train_nlp.py
 
# 2. Training URL binary classifier (RandomForest)
python app/ml/train_url_raw.py
 
# 3. Training URL feature-based scorer (XGBoost)
python app/ml/train_url_features.py
```
 
> Training IndoBERT membutuhkan waktu 30–60 menit tergantung GPU/CPU. Hasil model disimpan di `backend/app/ml/model/` (tidak di-commit ke Git).
 
---
 
## Dataset
 
Semua file dataset ditempatkan di `backend/data/` (tidak di-commit ke Git).
 
| File | Deskripsi | Digunakan untuk |
|---|---|---|
| `nlp_dataset_BAHASA_ID_only.csv` | 1.414 baris teks phishing/ham Bahasa Indonesia | Fine-tune IndoBERT |
| `nlp_huggingface_FINAL.json` | Format HuggingFace, isi sama dengan CSV | HuggingFace Trainer |
| `url_raw_classifier.csv` | 20.000 URL phishing + legitimate | Training URL classifier |
| `url_features_phiusiil.csv` | 20.000 URL dengan 27 fitur teknis | URL feature scorer |
| `Dataset_AntiPhishing_CIMB_Capstone.xlsx` | Whitelist domain, nomor, kata kunci risiko, data dummy | Seed database |
 
### Sumber Dataset
 
- **Agtbaskara SMS v2** — SMS spam Bahasa Indonesia (`github.com/agtbaskara`)
- **Mendeley SMS Phishing** — 5.971 SMS phishing EN, diambil 150 smishing terjemah (`data.mendeley.com/datasets/f45bkkt8pr/1`)
- **ealvaradob/phishing-dataset** — 800K+ URL phishing (`huggingface.co/datasets/ealvaradob/phishing-dataset`)
- **PhiUSIIL Kaggle** — 235K URL dengan 54 fitur teknis (`kaggle.com/datasets/ndarvind/phiusiil-phishing-url-dataset`)
- **Dataset buatan sendiri** — 54 baris SMS + WA + Email konteks CIMB Niaga

---
 
## API Documentation
 
Setelah backend berjalan, dokumentasi interaktif tersedia di:
 
```
http://localhost:8000/api/docs
```
 
### Endpoint Utama
 
| Method | Endpoint | Deskripsi | Auth |
|---|---|---|---|
| `POST` | `/api/v1/analyze` | Analisis pesan | — |
| `POST` | `/api/v1/report` | Kirim laporan | — |
| `GET` | `/api/v1/ticket/{id}` | Cek status tiket | — |
| `POST` | `/api/v1/admin/auth/login` | Login admin | — |
| `GET` | `/api/v1/admin/reports` | Daftar laporan | JWT |
| `PATCH` | `/api/v1/admin/reports/{id}` | Update status laporan | JWT |
| `GET` | `/api/v1/dashboard/stats` | Statistik dashboard | JWT |
| `GET` | `/api/v1/education/content` | Konten edukasi | — |
| `GET` | `/health` | Health check | — |
 
### Contoh Request Analisis
 
```bash
curl -X POST http://localhost:8000/api/v1/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "message_text": "SELAMAT! Anda memenangkan hadiah Rp5.000.000 dari CIMB Niaga. Klaim di: http://cimb-hadiah.xyz",
    "message_type": "sms"
  }'
```
 
### Contoh Response
 
```json
{
  "risk_score": 100,
  "risk_level": "danger",
  "explanation": "Link dalam pesan ini bukan milik bank resmi. Pesan ini juga menggunakan kata-kata yang sengaja membuat Anda tergesa-gesa. Jangan klik link tersebut.",
  "breakdown": [
    { "component": "whitelist", "points": 80, "detail": "Link tidak terdaftar di database resmi bank" },
    { "component": "nlp", "points": 20, "detail": "Terdeteksi pola bahasa manipulatif: iming-iming hadiah" }
  ],
  "typosquatting_alerts": [],
  "components": {
    "urls": ["http://cimb-hadiah.xyz"],
    "phones": [],
    "emails": []
  },
  "processing_time_ms": 234.5
}
```
 
---
 
## Security Checklist
 
Sebelum deploy ke production, pastikan semua item berikut sudah dilakukan:
 
- [ ] Ganti `SECRET_KEY` di `.env` dengan string random panjang (min 32 karakter)
- [ ] Ganti `ADMIN_DEFAULT_PASSWORD` dari nilai default
- [ ] Set `ENVIRONMENT=production` di `.env`
- [ ] Update `CORS_ORIGINS` hanya izinkan domain frontend yang benar
- [ ] Aktifkan HTTPS (konfigurasi SSL di Nginx)
- [ ] Pastikan `backend/data/` dan `backend/app/ml/model/` ada di `.gitignore`
- [ ] Tidak ada credentials yang ter-hardcode di source code
- [ ] Review log untuk memastikan isi pesan user tidak ter-log
- [ ] Rotasi `SECRET_KEY` secara berkala

---
 
## Tim Pengembang
 
Capstone Project — Topik B.3: Advanced Phishing and Fraud
Fakultas Ilmu Komputer, Universitas Brawijaya
Semester Genap 2025/2026
 
| Nama | Prodi | Peran |
|---|---|---|
| — | Teknik Informatika | ML/AI Engineer |
| — | Teknologi Informasi | Backend & Infrastructure |
| — | Sistem Informasi | Business Analyst & Frontend |
| — | Pendidikan Teknologi Informasi | Edukasi & UX |
 
**Pembimbing:** —
**Mitra Industri:** CIMB Niaga
 
---
 
## Lisensi
 
Proyek ini dibuat untuk keperluan akademik sebagai Capstone Project FILKOM UB 2026.
Dataset yang digunakan bersifat sintetis dan tidak mengandung data nasabah riil.
 
---
 
<div align="center">
  <sub>Dibuat dengan ❤️ oleh Tim Capstone B.3 — FILKOM UB 2026</sub>
</div>
