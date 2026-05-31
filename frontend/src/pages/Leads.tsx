import React, { useEffect, useState } from 'react';
import { Lead, LeadSource, Industry } from '../types';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input, Select, TextArea } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { getLeadCategory, industryLabel, leadSourceLabel, formatRelativeDate } from '../utils/formatters';
import api from '../utils/api';

const BANT_LABELS = {
  budget: { SI: 'Sí', NO: 'No', DESCONOCIDO: 'Desconocido' },
  authority: { SI: 'Decision Maker', INFLUENCIADOR: 'Influenciador', USUARIO: 'Usuario' },
  need: { ALTA: 'Alta', MEDIA: 'Media', BAJA: 'Baja' },
  timeline: { MENOS_3M: '<3 meses', TRES_A_6M: '3–6 meses', SEIS_A_12M: '6–12 meses', MAS_12M: '>12 meses' }
};

const ScoreBar = ({ score }: { score: number }) => {
  const { label, color } = getLeadCategory(score);
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full rounded-full bg-moneta-orange transition-all" style={{ width: `${score}%` }} />
      </div>
      <Badge className={`${color} border-transparent`} size="sm">{label} {score}</Badge>
    </div>
  );
};

const LeadForm = ({ onSave, onClose }: { onSave: () => void; onClose: () => void }) => {
  const [form, setForm] = useState({
    companyName: '', contactName: '', email: '', phone: '', industry: 'FINTECH', source: 'WEB',
    bantBudget: 'DESCONOCIDO', bantAuthority: 'USUARIO', bantNeed: 'BAJA', bantTimeline: 'MAS_12M', notes: ''
  });
  const [saving, setSaving] = useState(false);
  const f = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm(prev => ({ ...prev, [k]: e.target.value }));

  const save = async () => {
    setSaving(true);
    try { await api.post('/leads', form); onSave(); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2"><Input label="Empresa *" value={form.companyName} onChange={f('companyName')} placeholder="Empresa S.A." /></div>
        <Input label="Nombre contacto *" value={form.contactName} onChange={f('contactName')} placeholder="Juan Pérez" />
        <Input label="Email" value={form.email} onChange={f('email')} type="email" placeholder="contacto@empresa.mx" />
        <Input label="Teléfono" value={form.phone} onChange={f('phone')} placeholder="+52 55 1234 5678" />
        <Select label="Industria" value={form.industry} onChange={f('industry')}>
          {['BANCA', 'RETAIL', 'TELCO', 'FINTECH', 'OTRO'].map(i => <option key={i} value={i}>{industryLabel[i as Industry]}</option>)}
        </Select>
        <Select label="Origen" value={form.source} onChange={f('source')}>
          {['REFERIDO', 'WEB', 'EVENTO', 'OUTBOUND', 'PARTNER'].map(s => <option key={s} value={s}>{leadSourceLabel[s as LeadSource]}</option>)}
        </Select>
      </div>

      <div className="border-t border-white/10 pt-4">
        <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">Calificación BANT</p>
        <div className="grid grid-cols-2 gap-3">
          <Select label="Budget (¿tiene presupuesto?)" value={form.bantBudget} onChange={f('bantBudget')}>
            {Object.entries(BANT_LABELS.budget).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </Select>
          <Select label="Authority (¿es decisor?)" value={form.bantAuthority} onChange={f('bantAuthority')}>
            {Object.entries(BANT_LABELS.authority).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </Select>
          <Select label="Need (¿tiene necesidad clara?)" value={form.bantNeed} onChange={f('bantNeed')}>
            {Object.entries(BANT_LABELS.need).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </Select>
          <Select label="Timeline (¿cuándo compraría?)" value={form.bantTimeline} onChange={f('bantTimeline')}>
            {Object.entries(BANT_LABELS.timeline).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </Select>
        </div>
      </div>

      <TextArea label="Notas" value={form.notes} onChange={f('notes')} rows={3} placeholder="Contexto adicional..." />

      <div className="flex gap-3 justify-end pt-2">
        <Button variant="secondary" onClick={onClose}>Cancelar</Button>
        <Button onClick={save} loading={saving} disabled={!form.companyName || !form.contactName}>Guardar Lead</Button>
      </div>
    </div>
  );
};

export const Leads = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [filterConv, setFilterConv] = useState('false');
  const [converting, setConverting] = useState<string | null>(null);

  const load = () => {
    setLoading(true);
    api.get('/leads', { params: { converted: filterConv } }).then(r => { setLeads(r.data); setLoading(false); });
  };

  useEffect(() => { load(); }, [filterConv]);

  const convertLead = async (id: string) => {
    if (!confirm('¿Convertir este lead a cuenta y prospecto?')) return;
    setConverting(id);
    try { await api.post(`/leads/${id}/convert`); load(); }
    finally { setConverting(null); }
  };

  const hot = leads.filter(l => l.score >= 70);
  const warm = leads.filter(l => l.score >= 40 && l.score < 70);
  const cold = leads.filter(l => l.score < 40);

  const groups = [
    { label: 'Hot 🔥', color: 'text-orange-400', leads: hot },
    { label: 'Warm 🌡️', color: 'text-yellow-400', leads: warm },
    { label: 'Cold ❄️', color: 'text-blue-400', leads: cold },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="flex bg-white/5 border border-white/10 rounded-lg overflow-hidden">
          <button onClick={() => setFilterConv('false')} className={`px-4 py-2 text-xs font-semibold transition-colors ${filterConv === 'false' ? 'bg-moneta-orange text-white' : 'text-white/50 hover:text-white'}`}>Activos</button>
          <button onClick={() => setFilterConv('true')} className={`px-4 py-2 text-xs font-semibold transition-colors ${filterConv === 'true' ? 'bg-moneta-orange text-white' : 'text-white/50 hover:text-white'}`}>Convertidos</button>
        </div>
        <Button className="ml-auto" onClick={() => setShowNew(true)}>+ Nuevo Lead</Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-moneta-orange/30 border-t-moneta-orange rounded-full animate-spin" /></div>
      ) : (
        <div className="space-y-6">
          {groups.map(group => group.leads.length > 0 && (
            <div key={group.label}>
              <h3 className={`text-sm font-bold mb-3 ${group.color}`}>{group.label} ({group.leads.length})</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {group.leads.map(lead => (
                  <div key={lead.id} className="bg-moneta-navy border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-sm font-semibold text-white">{lead.companyName}</p>
                        <p className="text-xs text-white/50">{lead.contactName}</p>
                      </div>
                      <Badge className="bg-white/5 text-white/50 border-white/10" size="sm">{leadSourceLabel[lead.source]}</Badge>
                    </div>

                    <div className="mb-3"><ScoreBar score={lead.score} /></div>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-3">
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-white/30">B:</span>
                        <span className="text-xs text-white/60">{BANT_LABELS.budget[lead.bantBudget as keyof typeof BANT_LABELS.budget]}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-white/30">A:</span>
                        <span className="text-xs text-white/60">{BANT_LABELS.authority[lead.bantAuthority as keyof typeof BANT_LABELS.authority]}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-white/30">N:</span>
                        <span className="text-xs text-white/60">{BANT_LABELS.need[lead.bantNeed as keyof typeof BANT_LABELS.need]}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-white/30">T:</span>
                        <span className="text-xs text-white/60">{BANT_LABELS.timeline[lead.bantTimeline as keyof typeof BANT_LABELS.timeline]}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-white/5 pt-3">
                      <span className="text-xs text-white/30">{formatRelativeDate(lead.createdAt)}</span>
                      {!lead.converted && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => convertLead(lead.id)}
                          loading={converting === lead.id}
                        >
                          Convertir →
                        </Button>
                      )}
                      {lead.converted && <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30" size="sm">Convertido</Badge>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={showNew} onClose={() => setShowNew(false)} title="Nuevo Lead" size="lg">
        <LeadForm onSave={() => { setShowNew(false); load(); }} onClose={() => setShowNew(false)} />
      </Modal>
    </div>
  );
};
