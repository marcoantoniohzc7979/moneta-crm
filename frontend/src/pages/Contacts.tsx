import React, { useEffect, useState } from 'react';
import { Contact, ContactRole } from '../types';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input, Select } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { Table } from '../components/ui/Table';
import { contactRoleLabel } from '../utils/formatters';
import { MOCK_CONTACTS, MOCK_ACCOUNTS } from '../data/mockData';

const ROLE_COLORS: Record<ContactRole, string> = {
  DECISION_MAKER: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  INFLUENCIADOR: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  USUARIO: 'text-white/50 bg-white/5 border-white/10',
  BLOQUEADOR: 'text-red-400 bg-red-400/10 border-red-400/20',
};

const ContactForm = ({ onSave, onClose }: { onSave: () => void; onClose: () => void }) => {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', jobTitle: '', role: 'DECISION_MAKER', accountId: '' });
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
        <Input label="Nombre *" value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} />
        <Input label="Apellido *" value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} />
        <Input label="Email" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
        <Input label="Teléfono" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
        <Input label="Cargo" value={form.jobTitle} onChange={e => setForm(f => ({ ...f, jobTitle: e.target.value }))} placeholder="CTO, Director IT..." />
        <Select label="Rol" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}>
          {(['DECISION_MAKER', 'INFLUENCIADOR', 'USUARIO', 'BLOQUEADOR'] as ContactRole[]).map(r => (
            <option key={r} value={r}>{contactRoleLabel[r]}</option>
          ))}
        </Select>
        <Select label="Cuenta *" value={form.accountId} onChange={e => setForm(f => ({ ...f, accountId: e.target.value }))} className="col-span-2">
          <option value="">Seleccionar cuenta...</option>
          {MOCK_ACCOUNTS.map(a => <option key={a.id} value={a.id}>{a.razonSocial}</option>)}
        </Select>
      </div>
      <div className="flex gap-3 justify-end pt-2">
        <Button variant="secondary" onClick={onClose}>Cancelar</Button>
        <Button onClick={save} loading={saving} disabled={!form.firstName || !form.accountId}>Guardar</Button>
      </div>
    </div>
  );
};

export const Contacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showNew, setShowNew] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      let filtered = MOCK_CONTACTS;
      if (search) filtered = filtered.filter(c =>
        `${c.firstName} ${c.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
        c.email?.toLowerCase().includes(search.toLowerCase()) ||
        c.account?.razonSocial.toLowerCase().includes(search.toLowerCase())
      );
      setContacts(filtered);
      setLoading(false);
    }, 200);
    return () => clearTimeout(t);
  }, [search]);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="flex-1 relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">🔍</span>
          <Input className="pl-9" placeholder="Buscar contacto..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Button onClick={() => setShowNew(true)}>+ Nuevo Contacto</Button>
      </div>

      <div className="bg-moneta-navy border border-white/10 rounded-xl overflow-hidden">
        <Table
          columns={[
            { key: 'name', header: 'Nombre', render: c => <span className="font-medium text-white">{c.firstName} {c.lastName}</span> },
            { key: 'jobTitle', header: 'Cargo', render: c => <span className="text-white/60">{c.jobTitle || '—'}</span> },
            { key: 'role', header: 'Rol', render: c => <Badge className={ROLE_COLORS[c.role]}>{contactRoleLabel[c.role]}</Badge> },
            { key: 'account', header: 'Empresa', render: c => <span className="text-white/70">{c.account?.razonSocial}</span> },
            { key: 'email', header: 'Email', render: c => <span className="text-white/50 text-xs">{c.email || '—'}</span> },
            { key: 'phone', header: 'Teléfono', render: c => <span className="text-white/50 text-xs">{c.phone || '—'}</span> },
          ]}
          data={contacts}
          keyExtractor={c => c.id}
          loading={loading}
          emptyMessage="No hay contactos"
        />
      </div>

      <Modal open={showNew} onClose={() => setShowNew(false)} title="Nuevo Contacto">
        <ContactForm onSave={() => setShowNew(false)} onClose={() => setShowNew(false)} />
      </Modal>
    </div>
  );
};
