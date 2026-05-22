import React from 'react';
import { AlertTriangle, ShieldCheck, ShieldAlert, Link as LinkIcon, Phone, AlertCircle } from 'lucide-react';
import RiskMeter from '../ui/RiskMeter';
import ExplainCard from './ExplainCard';
import Button from '../ui/Button';

const RiskResult = ({ result, onReport, onReset }) => {
  if (!result) return null;

  const { risk_score, risk_level, components, breakdown = [], typosquatting_alerts = [], explanation } = result;

  const isWarningOrDanger = risk_level === 'warning' || risk_level === 'danger';

  return (
    <div className="bg-white rounded-xl shadow-lg border border-border overflow-hidden w-full max-w-4xl mx-auto animate-fade-in">
      <div className="p-8 flex flex-col items-center border-b border-slate-100">
        <h2 className="text-2xl font-bold text-primary mb-6">Hasil Analisis</h2>
        <RiskMeter score={risk_score} size="large" />
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        <ExplainCard explanation={explanation} riskLevel={risk_level} />

        {typosquatting_alerts.length > 0 && (
          <div className="bg-red-50 border-l-4 border-danger p-4 rounded-r-lg">
            <div className="flex items-start">
              <AlertCircle className="text-danger mt-0.5 mr-3 flex-shrink-0" size={20} />
              <div>
                <h3 className="text-red-800 font-semibold mb-1">Peringatan Typosquatting!</h3>
                <p className="text-red-700 text-sm mb-2">
                  Link ini sangat mirip dengan domain resmi bank, tapi <strong className="font-bold">BUKAN</strong> yang asli! Penipu sengaja membuat link yang mirip untuk mengelabui Anda.
                </p>
                <ul className="list-disc list-inside text-sm text-red-700 font-medium">
                  {typosquatting_alerts.map((t, i) => (
                    <li key={i}>{t.suspicious_domain} (Mirip dengan {t.similar_to}) - {t.explanation_id}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary border-b pb-2">Komponen Terdeteksi</h3>
            
            <div className="space-y-3">
              {components.urls && components.urls.length > 0 && (
                <div>
                  <span className="text-sm text-muted font-medium flex items-center gap-1 mb-2"><LinkIcon size={14}/> Tautan (URL)</span>
                  <div className="flex flex-wrap gap-2">
                    {components.urls.map((url, i) => (
                      <span key={i} className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${url.is_whitelisted ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                        {url.value} {url.is_whitelisted && <ShieldCheck size={12} className="ml-1" />}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {components.phones && components.phones.length > 0 && (
                <div>
                  <span className="text-sm text-muted font-medium flex items-center gap-1 mb-2"><Phone size={14}/> Nomor Telepon</span>
                  <div className="flex flex-wrap gap-2">
                    {components.phones.map((phone, i) => (
                      <span key={i} className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${phone.is_whitelisted ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-50 text-slate-700 border-slate-200'}`}>
                        {phone.value} {phone.is_whitelisted && <ShieldCheck size={12} className="ml-1" />}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {(!components.urls?.length && !components.phones?.length && !components.emails?.length) && (
                <p className="text-sm text-muted italic">Tidak ada tautan atau kontak khusus terdeteksi.</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-primary border-b pb-2">Rincian Risiko</h3>
            {breakdown.length > 0 ? (
              <ul className="space-y-2 text-sm text-slate-700">
                {breakdown.map((b, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <AlertTriangle className="text-amber-500 flex-shrink-0 mt-0.5" size={16} />
                    <span><span className="font-semibold capitalize">{b.component}</span>: {b.reason_id} <span className="font-medium text-danger">(+{b.points} Poin)</span></span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted italic">Tidak ada rincian risiko spesifik.</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-6 border-t border-border flex flex-col sm:flex-row justify-center sm:justify-end gap-4">
        <Button variant="secondary" onClick={onReset}>
          Cek Pesan Lain
        </Button>
        {isWarningOrDanger && (
          <Button variant="danger" onClick={onReport}>
            Laporkan Pesan Ini
          </Button>
        )}
      </div>
    </div>
  );
};

export default RiskResult;
