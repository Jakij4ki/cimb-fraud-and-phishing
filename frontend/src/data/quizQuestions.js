export const quizQuestions = [
  {
    id: '1',
    text: 'Apa yang harus dilakukan jika menerima SMS berisi link mencurigakan dari nomor tidak dikenal?',
    options: [
      'Klik link untuk memastikan isinya',
      'Jangan klik, segera hapus pesannya',
      'Balas SMS untuk bertanya siapa pengirimnya',
      'Forward ke semua kontak peringatan'
    ],
    correctIndex: 1,
    explanation: 'Anda tidak boleh mengklik tautan dari nomor yang tidak dikenal, karena bisa jadi itu adalah upaya phishing atau pemasangan malware.'
  },
  {
    id: '2',
    text: 'Manakah dari URL berikut yang paling mungkin merupakan situs penipuan?',
    options: [
      'https://www.cimbniaga.co.id',
      'https://octoclicks.co.id',
      'http://cimb-niaga-update-akun.weebly.com',
      'https://bizchannel.cimbniaga.co.id'
    ],
    correctIndex: 2,
    explanation: 'Situs resmi selalu menggunakan domain milik sendiri (.co.id atau .com) dan protokol HTTPS. Domain gratisan seperti weebly.com patut dicurigai.'
  },
  {
    id: '3',
    text: 'Data apa yang TIDAK PERNAH diminta oleh pihak bank resmi melalui telepon atau pesan?',
    options: [
      'Nama Ibu Kandung',
      'Nomor Rekening',
      'Kode OTP, PIN, atau Password',
      'Alamat Rumah'
    ],
    correctIndex: 2,
    explanation: 'Bank resmi tidak akan pernah meminta PIN, kode OTP, atau password dengan alasan apa pun.'
  },
  {
    id: '4',
    text: 'Teman Anda mengirim file bernama "Undangan-Pernikahan.apk" di WhatsApp. Apa tindakan Anda?',
    options: [
      'Mengunduh dan membukanya karena penasaran',
      'Menanyakan kapan pernikahannya',
      'Abaikan, tidak mengunduh, dan peringatkan teman Anda',
      'Menyimpannya untuk dilihat nanti'
    ],
    correctIndex: 2,
    explanation: 'Undangan pernikahan digital tidak seharusnya berformat .APK (Aplikasi Android). Ini adalah modus pencurian data yang bisa mengambil alih pesan OTP di ponsel Anda.'
  },
  {
    id: '5',
    text: 'Ciri utama dari pesan penipuan dengan metode "Social Engineering" adalah...',
    options: [
      'Menyebutkan nama lengkap Anda',
      'Menggunakan logo resolusi tinggi',
      'Menciptakan kepanikan/urgensi (contoh: "Rekening akan diblokir")',
      'Dikirim pada jam kerja'
    ],
    correctIndex: 2,
    explanation: 'Penipu sering menciptakan kepanikan agar korban tidak berpikir jernih dan segera melakukan instruksi yang diberikan, seperti mengklik tautan jahat.'
  }
];
