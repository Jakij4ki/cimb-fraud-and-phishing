export const educationContent = [
  {
    id: '1',
    title: 'Apa itu SMS Phishing (Smishing)?',
    content_type: 'article',
    difficulty: 'Mudah',
    order_index: 1,
    read_time: 3,
    type: 'phishing',
    content_body: {
      summary: 'Penipuan melalui pesan singkat (SMS) yang berpura-pura menjadi bank atau institusi resmi untuk mencuri data pribadi Anda.',
      points: [
        'Penipu berpura-pura menjadi bank resmi menggunakan nama pengirim (Sender ID) palsu.',
        'Sering memuat pesan bernada ancaman seperti "Rekening Anda akan diblokir" untuk memicu kepanikan.',
        'Selalu menyertakan tautan (link) ke situs web palsu yang dirancang mirip dengan situs bank asli.',
        'Bertujuan mencuri data sensitif seperti PIN, kode OTP, atau password Anda.'
      ],
      warning_signs: ['Link tidak resmi atau menggunakan penyingkat URL (seperti bit.ly, s.id)', 'Meminta informasi pribadi', 'Bahasa yang tidak profesional atau terburu-buru']
    }
  },
  {
    id: '2',
    title: 'Mengenali Link Berbahaya',
    content_type: 'article',
    difficulty: 'Mudah',
    order_index: 2,
    read_time: 4,
    type: 'security',
    content_body: {
      summary: 'Tautan (link) adalah jalan utama penipu mencuri data Anda. Kenali ciri-ciri link berbahaya sebelum Anda mengkliknya.',
      points: [
        'Selalu periksa domain utama. Bank resmi memiliki domain sendiri (contoh: cimbniaga.co.id).',
        'Waspadai ejaan yang mirip tapi salah, seperti "cimbniaga-update.com" atau "cimb-niaga.id".',
        'Hati-hati dengan penyingkat URL karena Anda tidak bisa melihat tujuan aslinya sebelum diklik.',
        'Jangan pernah memasukkan data login jika Anda tidak yakin dengan keaslian situs web tersebut.'
      ],
      warning_signs: ['Domain gratisan (blogspot, weebly)', 'Kesalahan ejaan pada nama bank', 'Tidak ada ikon gembok hijau (HTTPS) di browser']
    }
  },
  {
    id: '3',
    title: 'Modus Penipuan Mobile Banking Terkini',
    content_type: 'article',
    difficulty: 'Sedang',
    order_index: 3,
    read_time: 5,
    type: 'phishing',
    content_body: {
      summary: 'Penipu terus berinovasi. Modus terbaru tidak hanya meminta data, tetapi bisa mencuri akses ponsel Anda secara langsung.',
      points: [
        'Modus Undangan Pernikahan: Mengirim file berekstensi .APK yang disamarkan sebagai undangan digital.',
        'Modus Resi Paket: Berpura-pura dari jasa kurir dan meminta Anda mengunduh aplikasi untuk melacak paket.',
        'Surat Tilang Palsu: Mengirim file APK dengan alasan tilang elektronik dari kepolisian.',
        'Jika diinstal, aplikasi ini dapat membaca SMS OTP Anda dan mengambil alih akses mobile banking.'
      ],
      warning_signs: ['Diminta menginstal aplikasi di luar Play Store/App Store', 'File berekstensi .APK dikirim via WhatsApp', 'Aplikasi meminta izin membaca SMS']
    }
  },
  {
    id: '4',
    title: 'Cara Melindungi Data Perbankan',
    content_type: 'article',
    difficulty: 'Sedang',
    order_index: 4,
    read_time: 6,
    type: 'security',
    content_body: {
      summary: 'Langkah-langkah praktis dan esensial untuk menjaga agar uang dan data perbankan Anda tetap aman dari jangkauan penipu.',
      points: [
        'JAGA RAHASIA: Jangan pernah berikan PIN, Password, atau kode OTP kepada siapapun, termasuk pegawai bank.',
        'AKTIFKAN NOTIFIKASI: Gunakan fitur notifikasi transaksi (SMS/Email) agar Anda tahu aktivitas rekening Anda.',
        'UBAH BERKALA: Ganti PIN dan password aplikasi perbankan Anda secara berkala (misal 3 bulan sekali).',
        'GUNAKAN BIOMETRIK: Aktifkan login sidik jari atau Face ID pada aplikasi perbankan untuk keamanan ganda.'
      ],
      warning_signs: ['Pihak bank tiba-tiba menelpon meminta OTP', 'Orang terdekat meminjam ponsel untuk transaksi tidak dikenal']
    }
  },
  {
    id: '5',
    title: 'Teknik Typosquatting dan Cara Mendeteksinya',
    content_type: 'article',
    difficulty: 'Sulit',
    order_index: 5,
    read_time: 7,
    type: 'security',
    content_body: {
      summary: 'Penipu membeli domain web yang sangat mirip dengan situs bank asli untuk menjebak nasabah yang salah ketik.',
      points: [
        'Typosquatting memanfaatkan kelengahan atau kesalahan ketik pengguna (contoh: cimbnaiga.co.id alih-alih cimbniaga.co.id).',
        'Penipu sering menggunakan huruf yang mirip, seperti "1" menggantikan "l" atau "0" menggantikan "o".',
        'Tampilan situs palsu ini dibuat 100% identik dengan aslinya untuk mengelabui nasabah.',
        'Cara terbaik menghindarinya adalah menggunakan fitur Bookmark atau mengetik URL dengan perlahan dan teliti.'
      ],
      warning_signs: ['Terdapat huruf tambahan atau hilang pada URL', 'Domain menggunakan ekstensi asing (bukan .co.id atau .com)', 'Situs terasa lambat atau ada bagian tidak berfungsi']
    }
  }
];
