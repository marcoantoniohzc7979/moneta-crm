import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Account, AccountStatus } from '../types';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { accountStatusColor, accountStatusLabel, accountStatusDot, industryLabel, sizeLabel, getHealthScoreColor, formatCurrency } from '../utils/formatters';
import api from '../utils/api';

const STATUS_GROUPS: { status: AccountStatus; label: string; icon: string }[] = [
  { status: 'CLIENTE_ACTIVO', label: 'Clientes Activos', icon: '🟢' },
  { status: 'CLIENTE_EN_RIESGO', label: 'En Riesgo', icon: '🟡' },
  { status: 'PROSPECTO_CALIFICADO', label: 'Prospectos', icon: '🔵' },
  { status: 'LEAD_FRIO', label: 'Leads Fríos', icon: '⚪' },
  { status: 'CHURNED', label: 'Churned', icon: '🔴' },
];

const AccountForm = ({ onSave, onClose }: { onSave: () => void; onClose: () => void }) => {
  const [form, setForm] = useState({ razonSocial: '', rfc: '', industry: 'BANCA', size: 'ENTERPRISE', status: 'LEAD_FRIO', city: '', website: '' });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try { await api.post('/accounts', form); onSave(); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2"><Input label="Razón Social *" value={form.razonSocial} onChange={e => setForm(f => ({ ...f, razonSocial: e.target.value }))} placeholder="Empresa S.A. de C.V." /></div>
        <Input label="RFC" value={form.rfc} onChange={e => setForm(f => ({ ...f, rfc: e.target.value }))} placeholder="EMP920101ABC" />
        <Input label="Ciudad" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} placeholder="Ciudad de México" />
        <Select label="Industria" value={form.industry} onChange={e => setForm(f => ({ ...f, industry: e.target.value }))}>
          {['BANCA', 'RETAIL', 'TELCO', 'FINTECH', 'OTRO'].map(i => <option key={i} value={i}>{industryLabel[i as keyof typeof industryLabel]}</option>)}
        </Select>
        <Select label="Tamaño" value={form.size} onChange={e => setForm(f => ({ ...f, size: e.target.value }))}>
          {['ENTERPRISE', 'MID_MARKET', 'SMB'].map(s => <option key={s} value={s}>{sizeLabel[s as keyof typeof sizeLabel]}</option>)}
        </Select>
        <Select label="Estado" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} className="col-span-2">
          {STATUS_GROUPS.map(g => <option key={g.status} value={g.status}>{g.label}</option>)}
        </Select>
        <div className="col-span-2"><Input label="Sitio Web" value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} placeholder="empresa.com.mx" /></div>
      </div>
      <div className="flex gap-3 justify-end pt-2">
        <Button variant="secondary" onClick={onClose}>Cancelar</Button>
        <Button onClick={save} loading={saving} disabled={!form.razonSocial}>Guardar Cuenta</Button>
      </div>
    </div>
  );
};

export const Accounts = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterIndustry, setFilterIndustry] = useState<string>('');
  const [showNew, setShowNew] = useState(false);
  const [activeTab, setActiveTab] = useState<AccountStatus | 'ALL'>('ALL');
  const navigate = useNavigate();

  const load = () => {
    setLoading(true);
    const params: Record<string, string> = { limit: '100' };
    if (search) params.search = search;
    if (filterStatus) params.status = filterStatus;
    if (filterIndustry) params.industry = filterIndustry;
    api.get('/accounts', { params }).then(r => { setAccounts(r.data.accounts); setLoading(false); });
  };

  useEffect(() => { load(); }, [search, filterStatus, filterIndustry]);

  const displayed = activeTab === 'ALL' ? accounts : accounts.filter(a => a.status === activeTab);

  return (
    <div className="space-y-5">
      {/* Tab bar */}
      <div className="flex items-center gap-1 bg-moneta-navy border border-white/10 rounded-xl p-1">
        <button
          onClick={() => setActiveTab('ALL')}
          className={`flex-1 py-2 px-4 rounded-lg text-xs font-semibold transition-colors ${activeTab === 'ALL' ? 'bg-moneta-orange text-white' : 'text-white/50 hover:text-white'}`}
        >
          Todas ({accounts.length})
        </button>
        {STATUS_GROUPS.map(g => {
          const count = accounts.filter(a => a.status === g.status).length;
          return (
            <button
              key={g.status}
              onClick={() => setActiveTab(g.status)}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 ${activeTab === g.status ? 'bg-white/10 text-white' : 'text-white/50 hover:text-white'}`}
            >
              {g.icon} {g.label} <span className="opacity-60">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">🔍</span>
          <Input className="pl-9" placeholder="Buscar cuenta..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Select value={filterIndustry} onChange={e => setFilterIndustry(e.target.value)}>
          <option value="">Todas las industrias</option>
          {['BANCA', 'RETAIL', 'TELCO', 'FINTECH', 'OTRO'].map(i => <option key={i} value={i}>{industryLabel[i as keyof typeof industryLabel]}</option>)}
        </Select>
        <Button onClick={() => setShowNew(true)}>+ Nueva Cuenta</Button>
      </div>

      {/* Account grid */}
      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-moneta-orange/30 border-t-moneta-orange rounded-full animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {displayed.map(account => (
            <div
              key={account.id}
              className="bg-moneta-navy border border-white/10 rounded-xl p-5 hover:border-white/20 cursor-pointer transition-all hover:shadow-lg hover:shadow-black/20"
              onClick={() => navigate(`/accounts/${account.id}`)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-white truncate">{account.razonSocial}</h3>
                  <p className="text-xs text-white/40 mt-0.5">{account.city} · {industryLabel[account.industry]} · {sizeLabel[account.size]}</p>
                </div>
                <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1 ml-2 ${accountStatusDot[account.status]}`} />
              </div>

              <div className="flex items-center gap-2 mb-3">
                <Badge className={accountStatusColor[account.status]} size="sm">{accountStatusLabel[account.status]}</Badge>
              </div>

              {account.products && account.products.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {account.products.slice(0, 3).map(p => (
                    <span key={p.id} className="text-xs px-2 py-0.5 rounded bg-white/5 text-white/60 border border-white/10">
                      {p.product === 'PROCESAMIENTO_PAGOS' ? 'Pagos' : p.product === 'ONBOARDING_DIGITAL' ? 'Onboarding' : p.product === 'SEGURIDAD_TRANSACCIONAL' ? 'Seguridad' : 'Disponibilidad'}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between border-t border-white/5 pt-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-white/40">Salud</span>
                  <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${account.healthScore}%`, backgroundColor: account.healthScore >= 70 ? '#10b981' : account.healthScore >= 40 ? '#f59e0b' : '#ef4444' }} />
                  </div>
                  <span className={`text-xs font-bold ${getHealthScoreColor(account.healthScore)}`}>{account.healthScore}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-white/30">
                  {account._count && <span>{account._count.opportunities} ops</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {displayed.length === 0 && !loading && (
        <div className="text-center py-20 text-white/30 text-sm">No hay cuentas en esta categoría</div>
      )}

      <Modal open={showNew} onClose={() => setShowNew(false)} title="Nueva Cuenta">
        <AccountForm onSave={() => { setShowNew(false); load(); }} onClose={() => setShowNew(false)} />
      </Modal>
    </div>
  );
};
