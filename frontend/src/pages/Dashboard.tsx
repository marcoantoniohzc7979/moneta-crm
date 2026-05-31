import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  FunnelChart, Funnel, LabelList, Cell, PieChart, Pie
} from 'recharts';
import { KPICard } from '../components/dashboard/KPICard';
import { Badge } from '../components/ui/Badge';
import { formatCurrency, formatRelativeDate, stageLabel, productLabel, productColor, productShortLabel, accountStatusColor, accountStatusLabel } from '../utils/formatters';
import api from '../utils/api';
import { DashboardKPIs, PipelineStage, ProductType, AccountStatus } from '../types';

const STAGE_ORDER: PipelineStage[] = ['PROSPECCION', 'CALIFICACION', 'DEMO_PROPUESTA', 'NEGOCIACION', 'CONTRATO'];
const PRODUCT_COLORS: Record<ProductType, string> = {
  PROCESAMIENTO_PAGOS: '#3b82f6',
  ONBOARDING_DIGITAL: '#a855f7',
  SEGURIDAD_TRANSACCIONAL: '#ef4444',
  DISPONIBILIDAD_CONTINUA: '#10b981'
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-moneta-navy border border-white/20 rounded-lg p-3 text-xs">
      <p className="font-semibold text-white mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.color }}>{p.name}: {formatCurrency(p.value)}</p>
      ))}
    </div>
  );
};

export const Dashboard = () => {
  const [kpis, setKpis] = useState<DashboardKPIs | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/dashboard/kpis').then(r => { setKpis(r.data); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-moneta-orange/30 border-t-moneta-orange rounded-full animate-spin mx-auto mb-4" />
        <p className="text-white/40 text-sm">Cargando dashboard...</p>
      </div>
    </div>
  );

  if (!kpis) return <div className="text-white/40 text-center py-20">Error al cargar datos</div>;

  const funnelData = STAGE_ORDER.map(stage => {
    const s = kpis.stageBreakdown.find(x => x.stage === stage);
    return { name: stageLabel[stage], value: s?._sum?.value || 0, count: s?._count || 0 };
  });

  const productData = kpis.productBreakdown.map(p => ({
    name: productShortLabel[p.product as ProductType],
    value: p._sum?.value || 0,
    color: PRODUCT_COLORS[p.product as ProductType]
  }));

  const accountCounts = kpis.accountsByStatus.reduce((acc, s) => ({ ...acc, [s.status]: s._count }), {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Alerts */}
      {kpis.staleOpportunities.length > 0 && (
        <div className="flex items-start gap-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
          <span className="text-yellow-400 text-lg flex-shrink-0">⚠</span>
          <div>
            <p className="text-sm font-semibold text-yellow-400">
              {kpis.staleOpportunities.length} oportunidad{kpis.staleOpportunities.length > 1 ? 'es' : ''} sin actividad +14 días
            </p>
            <p className="text-xs text-yellow-400/70 mt-0.5">
              {kpis.staleOpportunities.map(o => o.account?.razonSocial).join(' · ')}
            </p>
          </div>
          <button onClick={() => navigate('/pipeline')} className="ml-auto text-xs text-yellow-400 hover:underline flex-shrink-0">Ver pipeline →</button>
        </div>
      )}

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Pipeline Total" value={formatCurrency(kpis.pipelineTotal)} subtitle={`${formatCurrency(kpis.weightedPipeline)} ponderado`} icon="💰" accent="from-blue-500/20 to-transparent" />
        <KPICard title="Cerrado este mes" value={formatCurrency(kpis.closedThisMonth)} subtitle="revenue generado" icon="✅" accent="from-emerald-500/20 to-transparent" />
        <KPICard title="Win Rate" value={`${kpis.winRate}%`} subtitle="oportunidades ganadas" icon="🏆" accent="from-moneta-orange/20 to-transparent" />
        <div className="bg-moneta-navy border border-white/10 rounded-xl p-5">
          <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">Cuentas por estado</p>
          <div className="space-y-1.5">
            {(['CLIENTE_ACTIVO', 'CLIENTE_EN_RIESGO', 'PROSPECTO_CALIFICADO', 'LEAD_FRIO'] as AccountStatus[]).map(s => (
              <div key={s} className="flex items-center justify-between">
                <Badge className={accountStatusColor[s]} size="sm">{accountStatusLabel[s]}</Badge>
                <span className="text-sm font-bold text-white">{accountCounts[s] || 0}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Pipeline funnel */}
        <div className="bg-moneta-navy border border-white/10 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Pipeline por Etapa (MXN)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={funnelData} layout="vertical" margin={{ left: 10, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" horizontal={false} />
              <XAxis type="number" tickFormatter={v => `${(v / 1000000).toFixed(1)}M`} tick={{ fill: '#ffffff60', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#ffffff80', fontSize: 10 }} axisLine={false} tickLine={false} width={80} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill="#F26522" radius={[0, 4, 4, 0]} maxBarSize={20} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue by product */}
        <div className="bg-moneta-navy border border-white/10 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Pipeline por Producto</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={productData} margin={{ left: -10, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#ffffff80', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tickFormatter={v => `${(v / 1000000).toFixed(0)}M`} tick={{ fill: '#ffffff60', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={40}>
                {productData.map((entry, idx) => <Cell key={idx} fill={entry.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Top opportunities */}
        <div className="lg:col-span-2 bg-moneta-navy border border-white/10 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Top 5 Oportunidades</h3>
            <button onClick={() => navigate('/opportunities')} className="text-xs text-moneta-orange hover:underline">Ver todas →</button>
          </div>
          <div className="space-y-2">
            {kpis.topOpportunities.map((op, i) => (
              <div key={op.id} className="flex items-center gap-4 p-3 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition-colors" onClick={() => navigate(`/opportunities/${op.id}`)}>
                <span className="text-xs font-bold text-white/30 w-4">#{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{op.name}</p>
                  <p className="text-xs text-white/40 truncate">{op.account?.razonSocial}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-white">{formatCurrency(op.value)}</p>
                  <p className="text-xs text-white/40">{op.probability}% prob.</p>
                </div>
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${op.probability >= 70 ? 'bg-emerald-400' : op.probability >= 40 ? 'bg-yellow-400' : 'bg-red-400'}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Recent activity */}
        <div className="bg-moneta-navy border border-white/10 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white">Actividad Reciente</h3>
            <button onClick={() => navigate('/activities')} className="text-xs text-moneta-orange hover:underline">Ver todo →</button>
          </div>
          <div className="space-y-3">
            {kpis.recentActivities.slice(0, 6).map(act => (
              <div key={act.id} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-sm flex-shrink-0">
                  {act.user?.name?.charAt(0) || '?'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-white/80 truncate">{act.title}</p>
                  <p className="text-xs text-white/40 truncate">{act.user?.name} · {act.account?.razonSocial}</p>
                </div>
                <span className="text-xs text-white/30 flex-shrink-0">{formatRelativeDate(act.createdAt)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
