import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Opportunity, PipelineStage, ProductType } from '../types';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input, Select, TextArea } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Table } from '../components/ui/Table';
import { formatCurrency, formatDate, stageLabel, productColor, productShortLabel, productLabel } from '../utils/formatters';
import { MOCK_OPPORTUNITIES, MOCK_ACCOUNTS, MOCK_USERS } from '../data/mockData';

const STAGES: PipelineStage[] = ['PROSPECCION', 'CALIFICACION', 'DEMO_PROPUESTA', 'NEGOCIACION', 'CONTRATO', 'CERRADO_GANADO', 'CERRADO_PERDIDO'];
const PRODUCTS: ProductType[] = ['PROCESAMIENTO_PAGOS', 'ONBOARDING_DIGITAL', 'SEGURIDAD_TRANSACCIONAL', 'DISPONIBILIDAD_CONTINUA'];

const OpportunityForm = ({ onSave, onClose }: { onSave: () => void; onClose: () => void }) => {
  const [form, setForm] = useState({ name: '', accountId: '', value: '', probability: '20', stage: 'PROSPECCION', expectedCloseDate: '', nextStep: '', notes: '' });
  const [selectedProducts, setSelectedProducts] = useState<ProductType[]>([]);
  const [ownerId, setOwnerId] = useState(MOCK_USERS[1].id);
  const [saving, setSaving] = useState(false);

  const toggleProduct = (p: ProductType) => setSelectedProducts(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);

  const save = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 500));
    setSaving(false);
    onSave();
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2"><Input label="Nombre de la oportunidad *" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Empresa - Producto Principal" /></div>
        <Select label="Cuenta *" value={form.accountId} onChange={e => setForm(f => ({ ...f, accountId: e.target.value }))}>
          <option value="">Seleccionar cuenta...</option>
          {MOCK_ACCOUNTS.map(a => <option key={a.id} value={a.id}>{a.razonSocial}</option>)}
        </Select>
        <Select label="Owner *" value={ownerId} onChange={e => setOwnerId(e.target.value)}>
          {MOCK_USERS.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
        </Select>
        <Input label="Valor estimado (MXN) *" type="number" value={form.value} onChange={e => setForm(f => ({ ...f, value: e.target.value }))} placeholder="5000000" />
        <Input label="Probabilidad %" type="number" min="0" max="100" value={form.probability} onChange={e => setForm(f => ({ ...f, probability: e.target.value }))} />
        <Select label="Etapa" value={form.stage} onChange={e => setForm(f => ({ ...f, stage: e.target.value }))}>
          {STAGES.slice(0, 5).map(s => <option key={s} value={s}>{stageLabel[s]}</option>)}
        </Select>
        <Input label="Fecha de cierre esperada" type="date" value={form.expectedCloseDate} onChange={e => setForm(f => ({ ...f, expectedCloseDate: e.target.value }))} />
      </div>

      <div>
        <p className="text-xs font-medium text-white/60 uppercase tracking-wide mb-2">Productos *</p>
        <div className="flex flex-wrap gap-2">
          {PRODUCTS.map(p => (
            <button key={p} onClick={() => toggleProduct(p)} className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${selectedProducts.includes(p) ? productColor[p] : 'border-white/10 text-white/40 hover:text-white/70'}`}>
              {productLabel[p]}
            </button>
          ))}
        </div>
      </div>

      <Input label="Siguiente paso" value={form.nextStep} onChange={e => setForm(f => ({ ...f, nextStep: e.target.value }))} placeholder="Ej: Enviar propuesta el lunes" />
      <TextArea label="Notas" value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={3} />

      <div className="flex gap-3 justify-end pt-2">
        <Button variant="secondary" onClick={onClose}>Cancelar</Button>
        <Button onClick={save} loading={saving} disabled={!form.name || !form.accountId || !form.value || selectedProducts.length === 0}>Guardar</Button>
      </div>
    </div>
  );
};

export const Opportunities = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [filterStage, setFilterStage] = useState('');
  const [filterProduct, setFilterProduct] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let filtered = MOCK_OPPORTUNITIES;
    if (filterStage) filtered = filtered.filter(o => o.stage === filterStage);
    if (filterProduct) filtered = filtered.filter(o => o.products?.some(p => p.product === filterProduct));
    setOpportunities(filtered);
    setLoading(false);
  }, [filterStage, filterProduct]);

  const totalValue = opportunities.reduce((s, o) => s + o.value, 0);
  const weightedValue = opportunities.reduce((s, o) => s + (o.value * o.probability / 100), 0);

  return (
    <div className="space-y-5">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-moneta-navy border border-white/10 rounded-xl p-4">
          <p className="text-xs text-white/50 mb-1">Total oportunidades</p>
          <p className="text-2xl font-bold text-white">{opportunities.length}</p>
        </div>
        <div className="bg-moneta-navy border border-white/10 rounded-xl p-4">
          <p className="text-xs text-white/50 mb-1">Valor bruto</p>
          <p className="text-2xl font-bold text-white">{formatCurrency(totalValue)}</p>
        </div>
        <div className="bg-moneta-navy border border-white/10 rounded-xl p-4">
          <p className="text-xs text-white/50 mb-1">Valor ponderado</p>
          <p className="text-2xl font-bold text-moneta-orange">{formatCurrency(weightedValue)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <Select value={filterStage} onChange={e => setFilterStage(e.target.value)}>
          <option value="">Todas las etapas</option>
          {STAGES.map(s => <option key={s} value={s}>{stageLabel[s]}</option>)}
        </Select>
        <Select value={filterProduct} onChange={e => setFilterProduct(e.target.value)}>
          <option value="">Todos los productos</option>
          {PRODUCTS.map(p => <option key={p} value={p}>{productLabel[p]}</option>)}
        </Select>
        <Button className="ml-auto" onClick={() => setShowNew(true)}>+ Nueva Oportunidad</Button>
      </div>

      {/* Table */}
      <div className="bg-moneta-navy border border-white/10 rounded-xl overflow-hidden">
        <Table
          columns={[
            { key: 'name', header: 'Oportunidad', render: op => <span className="font-medium text-white">{op.name}</span> },
            { key: 'account', header: 'Cuenta', render: op => <span className="text-white/70">{op.account?.razonSocial}</span> },
            { key: 'stage', header: 'Etapa', render: op => <span className="text-xs text-white/60">{stageLabel[op.stage]}</span> },
            { key: 'products', header: 'Productos', render: op => (
              <div className="flex gap-1 flex-wrap">
                {op.products?.slice(0, 2).map(p => <Badge key={p.id} className={productColor[p.product]} size="sm">{productShortLabel[p.product]}</Badge>)}
              </div>
            )},
            { key: 'value', header: 'Valor', sortable: true, render: op => <span className="font-bold text-white">{formatCurrency(op.value)}</span> },
            { key: 'weighted', header: 'Ponderado', render: op => <span className="text-white/50">{formatCurrency(op.value * op.probability / 100)}</span> },
            { key: 'probability', header: 'Prob.', sortable: true, render: op => (
              <span className={`font-medium ${op.probability >= 70 ? 'text-emerald-400' : op.probability >= 40 ? 'text-yellow-400' : 'text-white/40'}`}>{op.probability}%</span>
            )},
            { key: 'expectedCloseDate', header: 'Cierre', render: op => <span className="text-white/50 text-xs">{op.expectedCloseDate ? formatDate(op.expectedCloseDate) : '—'}</span> },
            { key: 'owner', header: 'Owner', render: op => <span className="text-white/60 text-xs">{op.owner?.name?.split(' ')[0]}</span> },
          ]}
          data={opportunities}
          keyExtractor={o => o.id}
          onRowClick={o => navigate(`/opportunities/${o.id}`)}
          loading={loading}
          emptyMessage="No hay oportunidades"
        />
      </div>

      <Modal open={showNew} onClose={() => setShowNew(false)} title="Nueva Oportunidad" size="lg">
        <OpportunityForm onSave={() => setShowNew(false)} onClose={() => setShowNew(false)} />
      </Modal>
    </div>
  );
};
