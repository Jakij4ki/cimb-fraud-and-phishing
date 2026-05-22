import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Clock, Award, ClipboardPaste, ScanSearch, ShieldCheck, AlertTriangle, ArrowRight, Smartphone, MessageSquare, Download } from 'lucide-react';
import Button from '../components/ui/Button';
import heroIllustration from '../assets/hero-illustration.svg';
import { motion, useInView } from 'framer-motion';

const StatCard = ({ icon: Icon, value, label, delay = 0 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = parseInt(value.replace(/[^0-9]/g, '')) || 0;
      const suffix = value.replace(/[0-9]/g, '');
      
      if (end === 0) {
        setCount(0);
        return;
      }

      const duration = 2000;
      const incrementTime = Math.max(duration / end, 10);
      
      const timer = setInterval(() => {
        start += 1;
        setCount(start);
        if (start === end) clearInterval(timer);
      }, incrementTime);

      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return (
    <motion.div 
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.5, delay }}
      className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center text-center"
    >
      <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-secondary mb-4">
        <Icon size={24} />
      </div>
      <h3 className="text-3xl font-bold text-primary mb-1">
        {isInView ? `${count}${value.replace(/[0-9]/g, '')}` : '0'}
      </h3>
      <p className="text-muted font-medium">{label}</p>
    </motion.div>
  );
};

const Home = () => {
  const navigate = useNavigate();

  const handleCtaClick = () => {
    navigate('/analyze');
  };

  const modusData = [
    {
      id: 1,
      title: "SMS Phishing via Fake BTS",
      desc: "Penipu mengirim SMS dengan tautan palsu yang terlihat seperti resmi dari bank, sering menyertakan ancaman blokir rekening.",
      icon: Smartphone,
      level: "danger"
    },
    {
      id: 2,
      title: "WhatsApp Impersonasi CS Bank",
      desc: "Akun WhatsApp bercentang hijau palsu berpura-pura menjadi CS bank dan meminta Anda membagikan OTP atau PIN.",
      icon: MessageSquare,
      level: "danger"
    },
    {
      id: 3,
      title: "Fake APK Mobile Banking",
      desc: "Modus undangan pernikahan atau resi paket yang ternyata aplikasi pencuri data (APK) yang mengintai perangkat Anda.",
      icon: Download,
      level: "warning"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-secondary pt-20 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Decorative background shapes */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-white opacity-5 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-secondary-light opacity-20 blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center gap-12 relative z-10">
          <div className="flex-1 text-center md:text-left mt-8 md:mt-0">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6"
            >
              Lindungi Diri dari <br/><span className="text-blue-300">Penipuan Digital</span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto md:mx-0"
            >
              SafeCheck menggunakan teknologi AI cerdas untuk mendeteksi pesan mencurigakan, tautan phishing, dan modus penipuan perbankan terkini.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Button 
                size="lg" 
                onClick={handleCtaClick}
                className="bg-white text-secondary hover:bg-slate-50 border-transparent shadow-lg text-lg px-8 py-4 w-full sm:w-auto"
                icon={ArrowRight}
              >
                Cek Pesan Sekarang
              </Button>
              <p className="text-blue-200 text-sm mt-4 italic flex items-center justify-center md:justify-start gap-1">
                <Shield size={16} /> 100% Gratis dan Aman
              </p>
            </motion.div>
          </div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="flex-1 w-full max-w-lg mx-auto"
          >
            <img src={heroIllustration} alt="SafeCheck System" className="w-full h-auto drop-shadow-2xl" />
          </motion.div>
        </div>
      </section>

      {/* Trust Stats Section */}
      <section className="bg-white py-16 px-4 sm:px-6 lg:px-8 relative z-20 -mt-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shadow-xl bg-white rounded-2xl p-4 border border-slate-100">
            <StatCard icon={ShieldAlert => <Shield size={24}/>} value="100+" label="Modus Dideteksi" delay={0.1} />
            <StatCard icon={Clock} value="3" label="Detik Waktu Analisis" delay={0.2} />
            <StatCard icon={Award} value="0" label="Biaya Penggunaan" delay={0.3} />
          </div>
        </div>
      </section>

      {/* Cara Kerja Section */}
      <section className="bg-background py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-primary mb-4">Bagaimana SafeCheck Bekerja?</h2>
            <p className="text-muted max-w-2xl mx-auto">Proses cepat dan mudah untuk memastikan pesan yang Anda terima aman dari percobaan penipuan.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Horizontal Line for Desktop */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-slate-200 z-0"></div>

            {/* Step 1 */}
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-md border border-slate-100 mb-6 relative">
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
                <ClipboardPaste size={40} className="text-secondary" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">Paste Pesan</h3>
              <p className="text-slate-600">Salin pesan mencurigakan yang Anda terima dari SMS, WhatsApp, atau Email.</p>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-md border border-slate-100 mb-6 relative">
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
                <ScanSearch size={40} className="text-secondary" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">Sistem Menganalisis</h3>
              <p className="text-slate-600">SafeCheck memeriksa link, nomor pengirim, dan pola bahasa secara otomatis dengan AI.</p>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-md border border-slate-100 mb-6 relative">
                <div className="absolute -top-3 -right-3 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">3</div>
                <ShieldCheck size={40} className="text-success" />
              </div>
              <h3 className="text-xl font-bold text-primary mb-3">Hasil Instan</h3>
              <p className="text-slate-600">Dapatkan hasil analisis lengkap dengan penjelasan yang mudah dipahami dalam hitungan detik.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Modus Terkini Section */}
      <section className="bg-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div>
              <h2 className="text-3xl font-bold text-primary mb-4">Modus Penipuan yang Sedang Marak</h2>
              <p className="text-muted">Waspadai taktik terbaru yang digunakan penipu untuk mencuri data perbankan Anda.</p>
            </div>
            <Link to="/education">
              <Button variant="secondary" icon={ArrowRight}>
                Pelajari Cara Lindungi Diri
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {modusData.map((modus) => {
              const Icon = modus.icon;
              return (
                <div key={modus.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow group">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-lg ${modus.level === 'danger' ? 'bg-red-50 text-danger' : 'bg-amber-50 text-amber-600'}`}>
                      <Icon size={24} />
                    </div>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                      modus.level === 'danger' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {modus.level === 'danger' ? 'Bahaya Tinggi' : 'Waspada'}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-3 group-hover:text-secondary transition-colors">{modus.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{modus.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Bottom Section */}
      <section className="bg-primary py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#1B6EF3 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Terima pesan mencurigakan?</h2>
          <p className="text-xl text-blue-200 mb-10 max-w-2xl mx-auto">
            Jangan biarkan keraguan merugikan Anda. Pastikan keamanan pesan atau tautan yang Anda terima sekarang juga.
          </p>
          <Button 
            size="lg" 
            onClick={handleCtaClick}
            className="bg-white text-primary hover:bg-slate-100 text-lg px-10 py-4 shadow-xl transform transition hover:-translate-y-1"
          >
            Cek Sekarang — Gratis
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;
