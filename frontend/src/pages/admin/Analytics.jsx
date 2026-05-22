import React, { useState } from 'react';
import { Calendar, BarChart2, TrendingUp } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
  LineChart, Line, Legend
} from 'recharts';
import ThreatMap from '../../components/admin/ThreatMap';

const Analytics = () => {
  const [period, setPeriod] = useState('30days');

  // Mock data
  const topModusData = [
    { name: 'Impersonasi CS', count: 450 },
    { name: 'Undian Palsu', count: 320 },
    { name: 'APK Resi/Undangan', count: 280 },
    { name: 'Blokir Rekening', count: 190 },
    { name: 'Link Promo', count: 120 },
  ];

  const topChannelData = [
    { name: 'WhatsApp', count: 850 },
    { name: 'SMS', count: 420 },
    { name: 'Email', count: 110 },
    { name: 'Lainnya', count: 40 },
  ];

  const trendsData = [
    { name: 'Minggu 1', phishing: 120, malware: 30, spam: 80 },
    { name: 'Minggu 2', phishing: 150, malware: 45, spam: 90 },
    { name: 'Minggu 3', phishing: 180, malware: 60, spam: 85 },
    { name: 'Minggu 4', phishing: 140, malware: 80, spam: 110 },
  ];

  const topKeywords = [
    { word: 'diblokir', count: 342, category: 'ANCAMAN' },
    { word: 'pin anda', count: 289, category: 'DATA_SENSITIF' },
    { word: 'menang', count: 256, category: 'IMING_IMING' },
    { word: 'segera', count: 210, category: 'URGENSI' },
    { word: 'download aplikasi', count: 195, category: 'TINDAKAN_PAKSA' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-4">
        <div>
          <h2 className="text-2xl font-bold text-primary">Analytics & Intelligence</h2>
          <p className="text-muted text-sm mt-1">Wawasan mendalam dari data laporan ancaman penipuan.</p>
        </div>
        <div className="flex items-center gap-2 bg-white rounded-lg p-1 border shadow-sm">
          <Calendar size={16} className="text-slate-400 ml-2" />
          {['7days', '30days', '90days'].map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                period === p ? 'bg-secondary text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {p === '7days' ? '7 Hari' : p === '30days' ? '30 Hari' : '3 Bulan'}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full">
        <ThreatMap />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-border">
          <h3 className="text-lg font-semibold text-primary mb-6 flex items-center gap-2">
            <BarChart2 size={18} className="text-secondary" /> Top 5 Modus Operandi
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topModusData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
                <XAxis type="number" axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" width={100} axisLine={false} tickLine={false} tick={{fontSize: 12}} />
                <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '8px' }} />
                <Bar dataKey="count" fill="#EF4444" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-border">
          <h3 className="text-lg font-semibold text-primary mb-6 flex items-center gap-2">
            <BarChart2 size={18} className="text-secondary" /> Kanal Paling Berisiko
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topChannelData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <RechartsTooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '8px' }} />
                <Bar dataKey="count" fill="#F59E0B" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-border lg:col-span-1">
          <h3 className="text-lg font-semibold text-primary mb-6">Kata Kunci Terpopuler</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b text-slate-500">
                  <th className="pb-3 font-medium">Kata/Frasa</th>
                  <th className="pb-3 font-medium text-right">Frekuensi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topKeywords.map((kw, i) => (
                  <tr key={i}>
                    <td className="py-3">
                      <div className="font-medium text-slate-800">{kw.word}</div>
                      <div className="text-xs text-slate-500">{kw.category}</div>
                    </td>
                    <td className="py-3 text-right font-semibold text-slate-700">{kw.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-border lg:col-span-2">
          <h3 className="text-lg font-semibold text-primary mb-6 flex items-center gap-2">
            <TrendingUp size={18} className="text-secondary" /> Tren Per Kategori Ancaman
          </h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendsData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <RechartsTooltip contentStyle={{ borderRadius: '8px' }} />
                <Legend iconType="circle" />
                <Line type="monotone" name="Phishing / Web Palsu" dataKey="phishing" stroke="#EF4444" strokeWidth={3} dot={false} activeDot={{r: 6}} />
                <Line type="monotone" name="Malware / APK" dataKey="malware" stroke="#8B5CF6" strokeWidth={3} dot={false} activeDot={{r: 6}} />
                <Line type="monotone" name="Spam / Promosi Palsu" dataKey="spam" stroke="#F59E0B" strokeWidth={3} dot={false} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
