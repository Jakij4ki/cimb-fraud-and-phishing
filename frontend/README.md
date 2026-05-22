# SafeCheck Frontend

Sistem frontend SafeCheck dibangun dengan React, Vite, dan Tailwind CSS. Proyek ini memfasilitasi user biasa untuk menganalisis pesan mencurigakan, melacak status tiket, serta mempelajari modus penipuan lewat modul edukasi. Juga tersedia panel Admin untuk manajemen dan review analisis.

## Prasyarat
- Node.js versi 18 atau lebih baru.
- npm atau yarn.

## Setup & Instalasi

1. Buka terminal dan masuk ke direktori `frontend`:
   ```bash
   cd frontend
   ```

2. Instal dependensi:
   ```bash
   npm install
   ```

3. Setup environment variables:
   Copy file `.env.example` menjadi `.env` dan pastikan konfigurasi sesuai, terutama `VITE_API_BASE_URL` jika berbeda dengan default.
   ```bash
   cp .env.example .env
   ```

## Development

Untuk menjalankan server development (dengan hot-reload):
```bash
npm run dev
```
Aplikasi akan tersedia di `http://localhost:5173`. Request ke API (`/api/*`) akan di-proxy secara otomatis ke backend lokal port `8000`.

## Production Build

Untuk mem-build proyek ke versi produksi (files akan berada di folder `dist/`):
```bash
npm run build
```

## Struktur Direktori

- `src/assets/`: Berisi logo, ilustrasi (SVG/PNG) dan aset statis lainnya.
- `src/components/`: Komponen UI yang dapat digunakan berulang (Reusable).
  - `ui/`: Komponen generik (Button, Modal, Toast, Badge, Skeleton, dsb).
  - `layout/`: Navbar, Footer, AdminLayout.
  - `analysis/`: MessageInput, RiskResult, ScanAnimation.
  - `admin/`: TriageTable, StatsChart, ThreatMap, AuditLog.
  - `education/`: LearningCard, QuizWidget, BadgeDisplay.
  - `report/`: ReportForm, TicketStatus.
- `src/constants/`: Berisi konstanta warna, risk word, dan bobot untuk highlighting.
- `src/data/`: Data statis/fallback (konten edukasi dan pertanyaan kuis).
- `src/hooks/`: Custom hooks React (useAuth, useAnalyze, useTicket).
- `src/pages/`: Komponen Halaman utama sesuai routing.
- `src/services/`: Service integrasi API Axios.
- `src/store/`: Zustand state management (authStore, analysisStore, toastStore).
- `src/utils/`: Fungsi utilitas helper seperti sanitasi string dan pengolahan warna.

## Panduan Menambah Halaman Baru

1. Buat file halaman baru di folder `src/pages/` atau subfolder terkait.
2. Buka `src/App.jsx`.
3. Tambahkan halaman baru menggunakan `React.lazy` di bagian atas file.
4. Daftarkan rute baru di dalam komponen `<Routes>`, lengkapi dengan `PageWrapper` untuk memberikan Meta Title secara dinamis.

## Aksesibilitas
Frontend dibangun dengan memperhatikan _Accessibility (a11y)_ dasar:
- Menggunakan `aria-labels` untuk elemen tanpa teks eksplisit.
- Outline focus yang jelas (`focus-visible`) untuk navigasi keyboard.
- Kontras warna yang cukup tinggi dan peringatan responsif pada mobile.

## Pengecekan Keamanan (Security)
- Token autentikasi hanya disimpan sementara dalam memory (melalui `Zustand`), bukan `localStorage`.
- Sanitasi teks pada semua endpoint melalui *request interceptors* Axios (`src/services/api.js`).
- Produksi build menghapus log `console.log` secara otomatis untuk menjaga integritas data.
