import React from 'react';

interface KPICardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: string;
  trend?: { value: number; label: string };
  accent?: string;
}

export const KPICard = ({ title, value, subtitle, icon, trend, accent = 'from-moneta-orange/20 to-transparent' }: KPICardProps) => (
  <div className={`relative overflow-hidden bg-moneta-navy border border-white/10 rounded-xl p-5`}>
    <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${accent} rounded-full -translate-y-8 translate-x-8 opacity-60`} />
    <div className="relative">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-semibold text-white/50 uppercase tracking-wider">{title}</p>
        <span className="text-xl">{icon}</span>
      </div>
      <p className="text-2xl font-bold text-white mb-1">{value}</p>
      {subtitle && <p className="text-xs text-white/40">{subtitle}</p>}
      {trend && (
        <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${trend.value >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
          <span>{trend.value >= 0 ? '↑' : '↓'}</span>
          <span>{Math.abs(trend.value)}% {trend.label}</span>
        </div>
      )}
    </div>
  </div>
);
