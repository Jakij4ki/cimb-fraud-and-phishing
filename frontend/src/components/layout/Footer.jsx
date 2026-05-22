import React from 'react';
import { Link } from 'react-router-dom';
import logoWhite from '../../assets/logo-white.svg';

const Footer = () => {
  return (
    <footer className="bg-primary text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <img src={logoWhite} alt="SafeCheck Logo" className="h-10 mb-4" />
            <p className="text-sm mt-4 max-w-md text-slate-400">
              Sistem ini membantu mendeteksi potensi penipuan digital. Selalu waspada dan jangan pernah membagikan data pribadi seperti PIN, Password, atau OTP kepada siapapun.
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Tautan Cepat</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">Beranda</Link></li>
              <li><Link to="/analyze" className="hover:text-white transition-colors">Cek Pesan</Link></li>
              <li><Link to="/education" className="hover:text-white transition-colors">Edukasi Keamanan</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">Tentang Sistem</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold text-lg mb-4">Kontak Darurat</h3>
            <ul className="space-y-2 text-sm">
              <li>Call Center: 14041</li>
              <li>Email: 14041@cimbniaga.co.id</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} SafeCheck — CIMB Niaga Capstone Project. All rights reserved.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-white">Syarat & Ketentuan</a>
            <a href="#" className="hover:text-white">Kebijakan Privasi</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
