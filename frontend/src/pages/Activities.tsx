import React, { useEffect, useState } from 'react';
import { Activity, ActivityType } from '../types';
import { Button } from '../components/ui/Button';
import { Input, Select, TextArea } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { activityTypeLabel, activityTypeIcon, formatRelativeDate, formatDate } from '../utils/formatters';
import { MOCK_ACTIVITIES, MOCK_ACCOUNTS } from '../data/mockData';

const TYPES: ActivityType[] = ['LLAMADA', 'EMAIL', 'REUNION', 'DEMO', 'PROPUESTA_ENVIADA', 'CONTRATO_ENVIADO', 'NOTA'];

const ActivityForm = ({ onSave, onClose }: { onSave: () => void; onClose: () => void }) => {
  const [form, setForm] = useState({ type: 'LLAMADA', title: '', description: '', accountId: '', outcome: '' });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 500));
    setSaving(false);
    onSave();
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Select label="Tipo de actividad" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
          {TYPES.map(t => <option key={t} value={t}>{activityTypeIcon[t]} {activityTypeLabel[t]}</option>)}
        </Select>
        <Select label="Cuenta" value={form.accountId} onChange={e => setForm(f => ({ ...f, accountId: e.target.value }))}>
          <option value="">Sin cuenta</option>
          {MOCK_ACCOUNTS.map(a => <option key={a.id} value={a.id}>{a.razonSocial}</option>)}
        </Select>
        <div className="col-span-2"><Input label="Título *" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Breve descripción de la actividad" /></div>
        <div className="col-span-2"><TextArea label="Descripción" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} /></div>
        <div className="col-span-2"><Input label="Resultado / Outcome" value={form.outcome} onChange={e => setForm(f => ({ ...f, outcome: e.target.value }))} placeholder="¿Qué resultó de esta actividad?" /></div>
      </div>
      <div className="flex gap-3 justify-end pt-2">
        <Button variant="secondary" onClick={onClose}>Cancelar</Button>
        <Button onClick={save} loading={saving} disabled={!form.title}>Registrar Actividad</Button>
      </div>
    </div>
  );
};

export const Activities = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState('');
  const [showNew, setShowNew] = useState(false);

  useEffect(() => {
    let filtered = MOCK_ACTIVITIES;
    if (filterType) filtered = filtered.filter(a => a.type === filterType);
    setActivities(filtered);
    setLoading(false);
  }, [filterType]);

  // Group by date
  const grouped: Record<string, Activity[]> = {};
  activities.forEach(a => {
    const key = new Date(a.createdAt).toDateString();
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(a);
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <Select value={filterType} onChange={e => setFilterType(e.target.value)}>
          <option value="">Todas las actividades</option>
          {TYPES.map(t => <option key={t} value={t}>{activityTypeLabel[t]}</option>)}
        </Select>
        <Button className="ml-auto" onClick={() => setShowNew(true)}>+ Registrar Actividad</Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-moneta-orange/30 border-t-moneta-orange rounded-full animate-spin" /></div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([date, acts]) => (
            <div key={date}>
              <p className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">{formatDate(acts[0].createdAt)}</p>
              <div className="space-y-2">
                {acts.map(act => (
                  <div key={act.id} className="flex items-start gap-4 bg-moneta-navy border border-white/10 rounded-xl p-4 hover:border-white/20 transition-all">
                    <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-lg flex-shrink-0">
                      {activityTypeIcon[act.type]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-white">{act.title}</p>
                        <span className="text-xs text-white/30 flex-shrink-0">{formatRelativeDate(act.createdAt)}</span>
                      </div>
                      {act.description && <p className="text-xs text-white/50 mt-0.5">{act.description}</p>}
                      <div className="flex items-center gap-3 mt-2">
                        {act.user && <span className="text-xs text-white/40">{act.user.name}</span>}
                        {act.account && <span className="text-xs text-moneta-orange/70">{act.account.razonSocial}</span>}
                        {act.outcome && <span className="text-xs text-white/30 italic">"{act.outcome}"</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {activities.length === 0 && <div className="text-center py-20 text-white/30">No hay actividades registradas</div>}
        </div>
      )}

      <Modal open={showNew} onClose={() => setShowNew(false)} title="Registrar Actividad" size="lg">
        <ActivityForm onSave={() => setShowNew(false)} onClose={() => setShowNew(false)} />
      </Modal>
    </div>
  );
};
