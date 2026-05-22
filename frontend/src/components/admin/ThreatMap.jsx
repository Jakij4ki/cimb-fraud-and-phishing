import React from 'react';
import { Map } from 'lucide-react';

const ThreatMap = ({ analyticsData }) => {
  // Simplistic placeholder for a map.
  // Real implementation would use D3, react-simple-maps, or Leaflet.
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-border flex flex-col items-center justify-center min-h-[400px]">
      <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
        <Map size={40} className="text-slate-400" />
      </div>
      <h3 className="text-xl font-semibold text-primary mb-2">Peta Persebaran Ancaman</h3>
      <p className="text-muted text-center max-w-md">
        Visualisasi persebaran laporan penipuan berdasarkan wilayah di Indonesia.
      </p>
      <div className="mt-8 p-4 bg-blue-50 text-blue-800 rounded-lg text-sm border border-blue-100">
        Data akan muncul seiring laporan masuk dan geolokasi diaktifkan.
      </div>
    </div>
  );
};

export default ThreatMap;
