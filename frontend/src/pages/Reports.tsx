import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { formatCurrency, roleLabel } from '../utils/formatters';
import { UserRole } from '../types';
import { MOCK_FORECAST, MOCK_KPIS, MOCK_TEAM_STATS } from '../data/mockData';

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-moneta-navy border border-white/20 rounded-lg p-3 text-xs">
      <p className="font-semibold text-white mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }}>{p.name}: {typeof p.value === 'number' && p.value > 10000 ? formatCurrency(p.value) : p.value}</p>
      ))}
    </div>
  );
};

const RC_COLORS = ['#F26522', '#3b82f6', '#a855f7', '#10b981', '#f59e0b'];

interface RCStat {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  activeOps: number;
  pipeline: number;
  weighted: number;
  closedWon: number;
  closedValue: number;
  winRate: number;
  activitiesLast30: number;
  byStage: Record<string, number>;
}

export const Reports = () => {
  const [forecast, setForecast] = useState<{ month: string; revenue: number }[]>([]);
  const [kpis, setKpis] = useState<any>(null);
  const [team, setTeam] = useState<RCStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'general' | 'equipo'>('equipo');

  useEffect(() => {
    setForecast(MOCK_FORECAST);
    setKpis(MOCK_KPIS);
    setTeam(MOCK_TEAM_STATS as unknown as RCStat[]);
    setLoading(false);
  }, []);

  if (loading) return (
    <div className="flex justify-center py-20">
      <div className="w-8 h-8 border-2 border-moneta-orange/30 border-t-moneta-orange rounded-full animate-spin" />
    </div>
  );

  const rcs = team.filter(u => u.role === 'EJECUTIVO_VENTAS');

  const pipelineByRC = rcs.map((rc, i) => ({
    name: rc.name.split(' ')[0],
    pipeline: rc.pipeline,
    ponderado: rc.weighted,
    color: RC_COLORS[i % RC_COLORS.length]
  }));

  const stageConvData = kpis?.stageBreakdown?.map((s: any) => ({
    name: s.stage.replace(/_/g, ' '),
    value: s._sum?.value || 0,
    count: s._count
  })) || [];

  const productData = kpis?.productBreakdown?.map((p: any) => ({
    name: p.product.replace(/_/g, ' '),
    value: p._sum?.value || 0,
    count: p._count
  })) || [];

  const COLORS = ['#3b82f6', '#a855f7', '#ef4444', '#10b981'];

  return (
    <div className="space-y-5">
      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 border border-white/10 rounded-xl p-1 max-w-xs">
        <button
          onClick={() => setActiveTab('equipo')}
          className={`flex-1 py-2 px-4 rounded-lg text-xs font-semibold transition-colors ${activeTab === 'equipo' ? 'bg-moneta-orange text-white' : 'text-white/50 hover:text-white'}`}
        >
          Recursos Comerciales
        </button>
        <button
          onClick={() => setActiveTab('general')}
          className={`flex-1 py-2 px-4 rounded-lg text-xs font-semibold transition-colors ${activeTab === 'general' ? 'bg-moneta-orange text-white' : 'text-white/50 hover:text-white'}`}
        >
          General
        </button>
      </div>

      {/* ── EQUIPO TAB ── */}
      {activeTab === 'equipo' && (
        <div className="space-y-5">
          {/* RC Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {rcs.map((rc, i) => (
              <div key={rc.id} className="bg-moneta-navy border border-white/10 rounded-xl p-5 space-y-4">
                {/* Header */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                    style={{ backgroundColor: RC_COLORS[i % RC_COLORS.length] + '33', border: `1px solid ${RC_COLORS[i % RC_COLORS.length]}66` }}
                  >
                    <span style={{ color: RC_COLORS[i % RC_COLORS.length] }}>{rc.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{rc.name}</p>
                    <p className="text-xs text-white/40">Recurso Comercial</p>
                  </div>
                </div>

                {/* KPIs */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-xs text-white/40 mb-1">Ops activas</p>
                    <p className="text-xl font-bold text-white">{rc.activeOps}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3">
                    <p className="text-xs text-white/40 mb-1">Win rate</p>
                    <p className="text-xl font-bold" style={{ color: rc.winRate >= 60 ? '#10b981' : rc.winRate >= 40 ? '#f59e0b' : '#ef4444' }}>
                      {rc.winRate}%
                    </p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-3 col-span-2">
                    <p className="text-xs text-white/40 mb-1">Pipeline activo</p>
                    <p className="text-base font-bold text-white">{formatCurrency(rc.pipeline)}</p>
                    <p className="text-xs text-white/40">ponderado: {formatCurrency(rc.weighted)}</p>
                  </div>
                </div>

                {/* Stats row */}
                <div className="flex items-center justify-between border-t border-white/10 pt-3 text-xs">
                  <div className="text-center">
                    <p className="font-bold text-emerald-400">{rc.closedWon}</p>
                    <p className="text-white/40">ganadas</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-white">{formatCurrency(rc.closedValue)}</p>
                    <p className="text-white/40">revenue total</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-blue-400">{rc.activitiesLast30}</p>
                    <p className="text-white/40">actividades/mes</p>
                  </div>
                </div>

                {/* Win rate bar */}
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-white/40">Efectividad</span>
                    <span className="text-xs font-semibold text-white">{rc.winRate}%</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${rc.winRate}%`,
                        backgroundColor: RC_COLORS[i % RC_COLORS.length]
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Comparativa pipeline */}
          <div className="bg-moneta-navy border border-white/10 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Comparativa de Pipeline por Recurso Comercial</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={pipelineByRC} margin={{ left: -10, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#ffffff80', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={v => `${(v / 1000000).toFixed(0)}M`} tick={{ fill: '#ffffff60', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="pipeline" name="Pipeline bruto" radius={[4, 4, 0, 0]} maxBarSize={50}>
                  {pipelineByRC.map((entry, i) => (
                    <Cell key={i} fill={RC_COLORS[i % RC_COLORS.length]} />
                  ))}
                </Bar>
                <Bar dataKey="ponderado" name="Pipeline ponderado" fill="#ffffff20" radius={[4, 4, 0, 0]} maxBarSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Tabla resumen */}
          <div className="bg-moneta-navy border border-white/10 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-white/10">
              <h3 className="text-sm font-semibold text-white">Resumen del Equipo Comercial</h3>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  {['Recurso Comercial', 'Ops activas', 'Pipeline', 'Ponderado', 'Ganadas', 'Revenue', 'Win Rate', 'Actividad/mes'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-white/50 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rcs.map((rc, i) => (
                  <tr key={rc.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: RC_COLORS[i % RC_COLORS.length] }} />
                        <span className="font-medium text-white">{rc.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-white/70">{rc.activeOps}</td>
                    <td className="px-4 py-3 font-semibold text-white">{formatCurrency(rc.pipeline)}</td>
                    <td className="px-4 py-3 text-white/50">{formatCurrency(rc.weighted)}</td>
                    <td className="px-4 py-3 text-emerald-400 font-semibold">{rc.closedWon}</td>
                    <td className="px-4 py-3 text-white/70">{formatCurrency(rc.closedValue)}</td>
                    <td className="px-4 py-3">
                      <span className={`font-semibold ${rc.winRate >= 60 ? 'text-emerald-400' : rc.winRate >= 40 ? 'text-yellow-400' : 'text-red-400'}`}>
                        {rc.winRate}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-blue-400">{rc.activitiesLast30}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── GENERAL TAB ── */}
      {activeTab === 'general' && (
        <div className="space-y-5">
          {/* Revenue forecast */}
          <div className="bg-moneta-navy border border-white/10 rounded-xl p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Revenue Histórico — Últimos 6 Meses</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={forecast}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                <XAxis dataKey="month" tick={{ fill: '#ffffff60', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={v => `${(v / 1000000).toFixed(1)}M`} tick={{ fill: '#ffffff60', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="revenue" stroke="#F26522" strokeWidth={2} dot={{ fill: '#F26522', r: 4 }} name="Revenue" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-moneta-navy border border-white/10 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white mb-4">Distribución del Pipeline por Etapa</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={stageConvData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
                  <XAxis type="number" tickFormatter={v => `${(v / 1000000).toFixed(1)}M`} tick={{ fill: '#ffffff60', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" tick={{ fill: '#ffffff80', fontSize: 9 }} axisLine={false} tickLine={false} width={90} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" fill="#F26522" radius={[0, 4, 4, 0]} name="Valor" maxBarSize={18} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-moneta-navy border border-white/10 rounded-xl p-5">
              <h3 className="text-sm font-semibold text-white mb-4">Oportunidades por Producto</h3>
              <div className="flex items-center gap-4">
                <ResponsiveContainer width={160} height={160}>
                  <PieChart>
                    <Pie data={productData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="count" paddingAngle={3}>
                      {productData.map((_: any, i: number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex-1 space-y-2">
                  {productData.map((p: any, i: number) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                        <span className="text-xs text-white/60 capitalize">{p.name.toLowerCase()}</span>
                      </div>
                      <span className="text-xs font-bold text-white">{p.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-moneta-navy border border-white/10 rounded-xl p-5">
              <p className="text-xs text-white/50 mb-2">Win Rate General</p>
              <p className="text-3xl font-bold text-white">{kpis?.winRate || 0}%</p>
              <div className="w-full h-2 bg-white/10 rounded-full mt-3 overflow-hidden">
                <div className="h-full bg-emerald-400 rounded-full" style={{ width: `${kpis?.winRate || 0}%` }} />
              </div>
            </div>
            <div className="bg-moneta-navy border border-white/10 rounded-xl p-5">
              <p className="text-xs text-white/50 mb-2">Pipeline Total (activo)</p>
              <p className="text-2xl font-bold text-white">{formatCurrency(kpis?.pipelineTotal || 0)}</p>
              <p className="text-xs text-white/30 mt-1">Bruto sin ponderar</p>
            </div>
            <div className="bg-moneta-navy border border-white/10 rounded-xl p-5">
              <p className="text-xs text-white/50 mb-2">Pipeline Ponderado</p>
              <p className="text-2xl font-bold text-moneta-orange">{formatCurrency(kpis?.weightedPipeline || 0)}</p>
              <p className="text-xs text-white/30 mt-1">Valor × probabilidad</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
