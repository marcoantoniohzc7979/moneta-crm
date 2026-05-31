import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Account } from '../types';
import { Badge } from '../components/ui/Badge';
import { accountStatusColor, accountStatusLabel, industryLabel, sizeLabel, productLabel, productColor, productShortLabel, stageLabel, formatCurrency, formatDate, getHealthScoreColor, activityTypeIcon, activityTypeLabel, formatRelativeDate } from '../utils/formatters';
import api from '../utils/api';

export const AccountDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [account, setAccount] = useState<Account | null>(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'overview' | 'opportunities' | 'contacts' | 'activities'>('overview');
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;
    api.get(`/accounts/${id}`).then(r => { setAccount(r.data); setLoading(false); });
  }, [id]);

  if (loading) return <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-moneta-orange/30 border-t-moneta-orange rounded-full animate-spin" /></div>;
  if (!account) return <div className="text-center py-20 text-white/40">Cuenta no encontrada</div>;

  return (
    <div className="space-y-5 max-w-5xl">
      {/* Header */}
      <div className="flex items-start gap-4">
        <button onClick={() => navigate('/accounts')} className="text-white/40 hover:text-white text-sm mt-1">← Volver</button>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-xl font-bold text-white">{account.razonSocial}</h1>
            <Badge className={accountStatusColor[account.status]}>{accountStatusLabel[account.status]}</Badge>
          </div>
          <p className="text-sm text-white/50">{account.rfc && `RFC: ${account.rfc} · `}{industryLabel[account.industry]} · {sizeLabel[account.size]}{account.city && ` · ${account.city}`}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-white/40">Score de salud</p>
          <p className={`text-3xl font-bold ${getHealthScoreColor(account.healthScore)}`}>{account.healthScore}</p>
        </div>
      </div>

      {/* Health bar */}
      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${account.healthScore}%`, backgroundColor: account.healthScore >= 70 ? '#10b981' : account.healthScore >= 40 ? '#f59e0b' : '#ef4444' }} />
      </div>

      {/* Products contracted */}
      {account.products && account.products.length > 0 && (
        <div className="bg-moneta-navy border border-white/10 rounded-xl p-4">
          <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">Productos</p>
          <div className="flex flex-wrap gap-2">
            {account.products.map(p => (
              <div key={p.id} className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${productColor[p.product]}`}>
                <span className="text-sm font-medium">{productLabel[p.product]}</span>
                {p.value && <span className="text-xs opacity-70">{formatCurrency(p.value)}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
        {(['overview', 'opportunities', 'contacts', 'activities'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 px-4 rounded-lg text-xs font-semibold capitalize transition-colors ${tab === t ? 'bg-moneta-orange text-white' : 'text-white/50 hover:text-white'}`}
          >
            {t === 'overview' ? 'Resumen' : t === 'opportunities' ? `Oportunidades (${account.opportunities?.length || 0})` : t === 'contacts' ? `Contactos (${account.contacts?.length || 0})` : `Actividades`}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === 'overview' && (
        <div className="grid grid-cols-2 gap-4">
          {account.website && <div className="bg-moneta-navy border border-white/10 rounded-xl p-4"><p className="text-xs text-white/40 mb-1">Sitio Web</p><a href={`https://${account.website}`} target="_blank" className="text-sm text-moneta-orange hover:underline">{account.website}</a></div>}
          {account.employeeCount && <div className="bg-moneta-navy border border-white/10 rounded-xl p-4"><p className="text-xs text-white/40 mb-1">Empleados</p><p className="text-sm font-medium text-white">{account.employeeCount.toLocaleString('es-MX')}</p></div>}
          <div className="bg-moneta-navy border border-white/10 rounded-xl p-4"><p className="text-xs text-white/40 mb-1">Registrado</p><p className="text-sm font-medium text-white">{formatDate(account.createdAt)}</p></div>
          <div className="bg-moneta-navy border border-white/10 rounded-xl p-4"><p className="text-xs text-white/40 mb-1">Última actualización</p><p className="text-sm font-medium text-white">{formatRelativeDate(account.updatedAt)}</p></div>
          {account.notes && <div className="col-span-2 bg-moneta-navy border border-white/10 rounded-xl p-4"><p className="text-xs text-white/40 mb-2">Notas</p><p className="text-sm text-white/70">{account.notes}</p></div>}
        </div>
      )}

      {tab === 'opportunities' && (
        <div className="space-y-2">
          {account.opportunities?.map(op => (
            <div key={op.id} className="flex items-center gap-4 bg-moneta-navy border border-white/10 rounded-xl p-4 hover:border-white/20 cursor-pointer transition-all" onClick={() => navigate(`/opportunities/${op.id}`)}>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{op.name}</p>
                <p className="text-xs text-white/40">{stageLabel[op.stage]}</p>
              </div>
              <p className="text-sm font-bold text-white">{formatCurrency(op.value)}</p>
              <p className={`text-xs font-medium ${op.probability >= 70 ? 'text-emerald-400' : op.probability >= 40 ? 'text-yellow-400' : 'text-white/40'}`}>{op.probability}%</p>
            </div>
          ))}
          {!account.opportunities?.length && <p className="text-center py-10 text-white/30 text-sm">Sin oportunidades</p>}
        </div>
      )}

      {tab === 'contacts' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {account.contacts?.map(c => (
            <div key={c.id} className="bg-moneta-navy border border-white/10 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-sm font-bold text-white/60">{c.firstName.charAt(0)}</div>
                <div>
                  <p className="text-sm font-semibold text-white">{c.firstName} {c.lastName}</p>
                  <p className="text-xs text-white/40">{c.jobTitle}</p>
                </div>
              </div>
              {c.email && <p className="text-xs text-white/50 mb-1">✉️ {c.email}</p>}
              {c.phone && <p className="text-xs text-white/50">📞 {c.phone}</p>}
            </div>
          ))}
          {!account.contacts?.length && <p className="text-center py-10 text-white/30 text-sm col-span-2">Sin contactos</p>}
        </div>
      )}

      {tab === 'activities' && (
        <div className="space-y-2">
          {account.activities?.map(act => (
            <div key={act.id} className="flex items-start gap-3 bg-moneta-navy border border-white/10 rounded-xl p-4">
              <span className="text-xl">{activityTypeIcon[act.type]}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-white">{act.title}</p>
                {act.description && <p className="text-xs text-white/50 mt-0.5">{act.description}</p>}
                <p className="text-xs text-white/30 mt-1">{act.user?.name} · {formatRelativeDate(act.createdAt)}</p>
              </div>
            </div>
          ))}
          {!account.activities?.length && <p className="text-center py-10 text-white/30 text-sm">Sin actividades</p>}
        </div>
      )}
    </div>
  );
};
