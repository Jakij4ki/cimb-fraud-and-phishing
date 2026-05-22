import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { RISK_COLORS } from '../../constants/colors';

const StatsChart = ({ data }) => {
  if (!data) return null;

  // Mock data if actual is not provided
  const lineData = data.trend || [
    { name: 'Jan', total: 120, danger: 30 },
    { name: 'Feb', total: 150, danger: 45 },
    { name: 'Mar', total: 180, danger: 60 },
    { name: 'Apr', total: 220, danger: 80 },
    { name: 'Mei', total: 190, danger: 50 },
  ];

  const pieData = data.distribution || [
    { name: 'Aman', value: 400, color: RISK_COLORS.safe.border },
    { name: 'Waspada', value: 300, color: RISK_COLORS.warning.border },
    { name: 'Bahaya', value: 300, color: RISK_COLORS.danger.border },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-border lg:col-span-2">
        <h3 className="text-lg font-semibold text-primary mb-6">Tren Laporan Masuk</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={lineData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B'}} />
              <RechartsTooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
              <Line type="monotone" name="Total Laporan" dataKey="total" stroke="#1B6EF3" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
              <Line type="monotone" name="Potensi Bahaya" dataKey="danger" stroke="#EF4444" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-border">
        <h3 className="text-lg font-semibold text-primary mb-6">Distribusi Risiko</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <RechartsTooltip />
              <Legend iconType="circle" layout="vertical" verticalAlign="bottom" align="center" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default StatsChart;
