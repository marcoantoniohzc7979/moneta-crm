import React, { useEffect, useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors, useDroppable, useDraggable } from '@dnd-kit/core';
import { Opportunity, PipelineStage, ProductType } from '../types';
import { Badge } from '../components/ui/Badge';
import { Select } from '../components/ui/Input';
import { formatCurrency, stageLabel, productShortLabel, productColor, getStageUrgencyColor, productLabel } from '../utils/formatters';
import api from '../utils/api';
import { useNavigate } from 'react-router-dom';

const STAGES: PipelineStage[] = ['PROSPECCION', 'CALIFICACION', 'DEMO_PROPUESTA', 'NEGOCIACION', 'CONTRATO'];
const PRODUCTS: ProductType[] = ['PROCESAMIENTO_PAGOS', 'ONBOARDING_DIGITAL', 'SEGURIDAD_TRANSACCIONAL', 'DISPONIBILIDAD_CONTINUA'];

const KanbanCard = ({ op, isDragging }: { op: Opportunity; isDragging?: boolean }) => {
  const navigate = useNavigate();
  const urgencyClass = getStageUrgencyColor(op.daysInStage, op.stage);

  return (
    <div
      className={`rounded-lg border p-3 cursor-pointer transition-all ${urgencyClass} ${isDragging ? 'opacity-50 shadow-2xl' : 'hover:bg-white/10'}`}
      onClick={() => navigate(`/opportunities/${op.id}`)}
    >
      <p className="text-xs font-semibold text-white truncate mb-1">{op.account?.razonSocial}</p>
      <p className="text-xs text-white/60 truncate mb-2">{op.name}</p>
      <div className="flex flex-wrap gap-1 mb-2">
        {op.products?.map(p => (
          <Badge key={p.id} className={productColor[p.product]} size="sm">{productShortLabel[p.product]}</Badge>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-white">{formatCurrency(op.value)}</span>
        <span className={`text-xs font-medium ${op.probability >= 70 ? 'text-emerald-400' : op.probability >= 40 ? 'text-yellow-400' : 'text-white/40'}`}>
          {op.probability}%
        </span>
      </div>
      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-white/30">{op.owner?.name?.split(' ')[0]}</span>
        <span className={`text-xs ${op.daysInStage > 30 ? 'text-red-400' : op.daysInStage > 14 ? 'text-yellow-400' : 'text-white/30'}`}>
          {op.daysInStage}d en etapa
        </span>
      </div>
    </div>
  );
};

const DraggableCard = ({ op }: { op: Opportunity }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({ id: op.id });
  return (
    <div ref={setNodeRef} {...attributes} {...listeners}>
      <KanbanCard op={op} isDragging={isDragging} />
    </div>
  );
};

const DroppableColumn = ({ stage, ops, totalValue }: { stage: PipelineStage; ops: Opportunity[]; totalValue: number }) => {
  const { setNodeRef, isOver } = useDroppable({ id: stage });

  return (
    <div className="flex flex-col min-w-[220px] max-w-[260px] flex-shrink-0">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-xs font-semibold text-white">{stageLabel[stage]}</p>
          <p className="text-xs text-white/40">{ops.length} ops · {formatCurrency(totalValue)}</p>
        </div>
        <span className="bg-white/10 text-white/60 text-xs rounded-full px-2 py-0.5">{ops.length}</span>
      </div>
      <div
        ref={setNodeRef}
        className={`flex-1 space-y-2 min-h-[120px] rounded-lg transition-colors p-1 -m-1 ${isOver ? 'bg-moneta-orange/10 ring-1 ring-moneta-orange/30' : ''}`}
      >
        {ops.map(op => <DraggableCard key={op.id} op={op} />)}
      </div>
    </div>
  );
};

export const Pipeline = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterProduct, setFilterProduct] = useState('');
  const [filterOwner, setFilterOwner] = useState('');
  const [users, setUsers] = useState<{ id: string; name: string }[]>([]);
  const [activeOp, setActiveOp] = useState<Opportunity | null>(null);
  const [view, setView] = useState<'kanban' | 'list'>('kanban');

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const load = () => {
    const params: Record<string, string> = {};
    if (filterProduct) params.product = filterProduct;
    if (filterOwner) params.ownerId = filterOwner;
    api.get('/opportunities', { params }).then(r => { setOpportunities(r.data); setLoading(false); });
  };

  useEffect(() => { load(); }, [filterProduct, filterOwner]);
  useEffect(() => { api.get('/users').then(r => setUsers(r.data)); }, []);

  const activeStages = opportunities.filter(o => !['CERRADO_GANADO', 'CERRADO_PERDIDO'].includes(o.stage));

  const byStage = (stage: PipelineStage) => activeStages.filter(o => o.stage === stage);
  const stageTotal = (stage: PipelineStage) => byStage(stage).reduce((s, o) => s + o.value, 0);

  const handleDragStart = (e: DragStartEvent) => {
    setActiveOp(opportunities.find(o => o.id === e.active.id) || null);
  };

  const handleDragEnd = async (e: DragEndEvent) => {
    setActiveOp(null);
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const newStage = over.id as PipelineStage;
    if (!STAGES.includes(newStage)) return;

    setOpportunities(prev => prev.map(o => o.id === active.id ? { ...o, stage: newStage } : o));
    await api.put(`/opportunities/${active.id}`, { stage: newStage });
    load();
  };

  return (
    <div className="space-y-5 h-full flex flex-col">
      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <Select value={filterProduct} onChange={e => setFilterProduct(e.target.value)} className="min-w-[180px]">
          <option value="">Todos los productos</option>
          {PRODUCTS.map(p => <option key={p} value={p}>{productLabel[p]}</option>)}
        </Select>
        <Select value={filterOwner} onChange={e => setFilterOwner(e.target.value)} className="min-w-[160px]">
          <option value="">Todos los R. Comerciales</option>
          {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
        </Select>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs text-white/40">Vista:</span>
          <div className="flex bg-white/5 border border-white/10 rounded-lg overflow-hidden">
            <button onClick={() => setView('kanban')} className={`px-3 py-1.5 text-xs font-medium transition-colors ${view === 'kanban' ? 'bg-moneta-orange text-white' : 'text-white/50 hover:text-white'}`}>Kanban</button>
            <button onClick={() => setView('list')} className={`px-3 py-1.5 text-xs font-medium transition-colors ${view === 'list' ? 'bg-moneta-orange text-white' : 'text-white/50 hover:text-white'}`}>Lista</button>
          </div>
        </div>
      </div>

      {/* Summary bar */}
      <div className="grid grid-cols-5 gap-2">
        {STAGES.map(stage => (
          <div key={stage} className="bg-moneta-navy border border-white/10 rounded-lg p-3 text-center">
            <p className="text-xs text-white/40 truncate">{stageLabel[stage]}</p>
            <p className="text-sm font-bold text-white mt-0.5">{formatCurrency(stageTotal(stage))}</p>
            <p className="text-xs text-white/30">{byStage(stage).length} ops</p>
          </div>
        ))}
      </div>

      {/* Kanban */}
      {view === 'kanban' && (
        <div className="flex-1 overflow-x-auto">
          <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="flex gap-4 h-full pb-4" style={{ minWidth: `${STAGES.length * 250}px` }}>
              {STAGES.map(stage => (
                <DroppableColumn key={stage} stage={stage} ops={byStage(stage)} totalValue={stageTotal(stage)} />
              ))}
            </div>
            <DragOverlay>
              {activeOp && <KanbanCard op={activeOp} />}
            </DragOverlay>
          </DndContext>
        </div>
      )}

      {/* List view */}
      {view === 'list' && (
        <div className="bg-moneta-navy border border-white/10 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                {['Oportunidad', 'Empresa', 'Etapa', 'Productos', 'Valor', 'Pond.', 'Prob.', 'Días', 'Owner'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-white/50 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={9} className="px-4 py-8 text-center text-white/40">Cargando...</td></tr>
              ) : activeStages.map(op => (
                <tr key={op.id} className="border-b border-white/5 hover:bg-white/5 cursor-pointer" onClick={() => window.location.href = `/opportunities/${op.id}`}>
                  <td className="px-4 py-3"><p className="font-medium text-white truncate max-w-[150px]">{op.name}</p></td>
                  <td className="px-4 py-3 text-white/70">{op.account?.razonSocial}</td>
                  <td className="px-4 py-3"><span className="text-xs text-white/60">{stageLabel[op.stage]}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 flex-wrap">
                      {op.products?.slice(0, 2).map(p => <Badge key={p.id} className={productColor[p.product]} size="sm">{productShortLabel[p.product]}</Badge>)}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-bold text-white">{formatCurrency(op.value)}</td>
                  <td className="px-4 py-3 text-white/50">{formatCurrency(op.value * op.probability / 100)}</td>
                  <td className="px-4 py-3">
                    <span className={`font-medium ${op.probability >= 70 ? 'text-emerald-400' : op.probability >= 40 ? 'text-yellow-400' : 'text-white/40'}`}>{op.probability}%</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={op.daysInStage > 30 ? 'text-red-400' : op.daysInStage > 14 ? 'text-yellow-400' : 'text-white/40'}>{op.daysInStage}d</span>
                  </td>
                  <td className="px-4 py-3 text-white/60">{op.owner?.name?.split(' ')[0]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
