import { AccountStatus, Industry, CompanySize, ProductType, PipelineStage, ContactRole, ActivityType, LeadSource, UserRole } from '../types';

export const roleLabel: Record<UserRole, string> = {
  ADMIN: 'Administrador',
  DIRECTOR_COMERCIAL: 'Director Comercial',
  EJECUTIVO_VENTAS: 'Recurso Comercial',
  MARKETING: 'Marketing'
};

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 0 }).format(value);

export const formatDate = (date: string) =>
  new Intl.DateTimeFormat('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(date));

export const formatRelativeDate = (date: string) => {
  const days = Math.floor((Date.now() - new Date(date).getTime()) / (1000 * 60 * 60 * 24));
  if (days === 0) return 'Hoy';
  if (days === 1) return 'Ayer';
  if (days < 7) return `hace ${days} días`;
  if (days < 30) return `hace ${Math.floor(days / 7)} semanas`;
  if (days < 365) return `hace ${Math.floor(days / 30)} meses`;
  return `hace ${Math.floor(days / 365)} años`;
};

export const accountStatusLabel: Record<AccountStatus, string> = {
  CLIENTE_ACTIVO: 'Cliente Activo',
  CLIENTE_EN_RIESGO: 'En Riesgo',
  PROSPECTO_CALIFICADO: 'Prospecto',
  LEAD_FRIO: 'Lead Frío',
  CHURNED: 'Churned'
};

export const accountStatusColor: Record<AccountStatus, string> = {
  CLIENTE_ACTIVO: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  CLIENTE_EN_RIESGO: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
  PROSPECTO_CALIFICADO: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  LEAD_FRIO: 'text-gray-400 bg-gray-400/10 border-gray-400/20',
  CHURNED: 'text-red-400 bg-red-400/10 border-red-400/20'
};

export const accountStatusDot: Record<AccountStatus, string> = {
  CLIENTE_ACTIVO: 'bg-emerald-400',
  CLIENTE_EN_RIESGO: 'bg-yellow-400',
  PROSPECTO_CALIFICADO: 'bg-blue-400',
  LEAD_FRIO: 'bg-gray-400',
  CHURNED: 'bg-red-400'
};

export const industryLabel: Record<Industry, string> = {
  BANCA: 'Banca',
  RETAIL: 'Retail',
  TELCO: 'Telco',
  FINTECH: 'Fintech',
  OTRO: 'Otro'
};

export const sizeLabel: Record<CompanySize, string> = {
  ENTERPRISE: 'Enterprise',
  MID_MARKET: 'Mid-Market',
  SMB: 'SMB'
};

export const productLabel: Record<ProductType, string> = {
  PROCESAMIENTO_PAGOS: 'Procesamiento de Pagos',
  ONBOARDING_DIGITAL: 'Onboarding Digital',
  SEGURIDAD_TRANSACCIONAL: 'Seguridad Transaccional',
  DISPONIBILIDAD_CONTINUA: 'Disponibilidad Contínua'
};

export const productShortLabel: Record<ProductType, string> = {
  PROCESAMIENTO_PAGOS: 'Pagos',
  ONBOARDING_DIGITAL: 'Onboarding',
  SEGURIDAD_TRANSACCIONAL: 'Seguridad',
  DISPONIBILIDAD_CONTINUA: 'Disponibilidad'
};

export const productColor: Record<ProductType, string> = {
  PROCESAMIENTO_PAGOS: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  ONBOARDING_DIGITAL: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  SEGURIDAD_TRANSACCIONAL: 'bg-red-500/20 text-red-300 border-red-500/30',
  DISPONIBILIDAD_CONTINUA: 'bg-green-500/20 text-green-300 border-green-500/30'
};

export const stageLabel: Record<PipelineStage, string> = {
  PROSPECCION: 'Prospección',
  CALIFICACION: 'Calificación',
  DEMO_PROPUESTA: 'Demo / Propuesta',
  NEGOCIACION: 'Negociación',
  CONTRATO: 'Contrato',
  CERRADO_GANADO: 'Cerrado Ganado',
  CERRADO_PERDIDO: 'Cerrado Perdido'
};

export const contactRoleLabel: Record<ContactRole, string> = {
  DECISION_MAKER: 'Decision Maker',
  INFLUENCIADOR: 'Influenciador',
  USUARIO: 'Usuario',
  BLOQUEADOR: 'Bloqueador'
};

export const activityTypeLabel: Record<ActivityType, string> = {
  LLAMADA: 'Llamada',
  EMAIL: 'Email',
  REUNION: 'Reunión',
  DEMO: 'Demo',
  PROPUESTA_ENVIADA: 'Propuesta',
  CONTRATO_ENVIADO: 'Contrato',
  NOTA: 'Nota'
};

export const activityTypeIcon: Record<ActivityType, string> = {
  LLAMADA: '📞',
  EMAIL: '✉️',
  REUNION: '🤝',
  DEMO: '🖥️',
  PROPUESTA_ENVIADA: '📄',
  CONTRATO_ENVIADO: '📋',
  NOTA: '📝'
};

export const leadSourceLabel: Record<LeadSource, string> = {
  REFERIDO: 'Referido',
  WEB: 'Web',
  EVENTO: 'Evento',
  OUTBOUND: 'Outbound',
  PARTNER: 'Partner'
};

export const getLeadCategory = (score: number): { label: string; color: string } => {
  if (score >= 70) return { label: 'Hot', color: 'text-orange-400 bg-orange-400/10' };
  if (score >= 40) return { label: 'Warm', color: 'text-yellow-400 bg-yellow-400/10' };
  return { label: 'Cold', color: 'text-blue-400 bg-blue-400/10' };
};

export const getHealthScoreColor = (score: number) => {
  if (score >= 70) return 'text-emerald-400';
  if (score >= 40) return 'text-yellow-400';
  return 'text-red-400';
};

export const getStageUrgencyColor = (daysInStage: number, stage: PipelineStage) => {
  const benchmarks: Record<PipelineStage, number> = {
    PROSPECCION: 14, CALIFICACION: 21, DEMO_PROPUESTA: 30, NEGOCIACION: 45, CONTRATO: 14,
    CERRADO_GANADO: 999, CERRADO_PERDIDO: 999
  };
  const benchmark = benchmarks[stage];
  if (daysInStage > benchmark) return 'border-red-500/50 bg-red-500/5';
  if (daysInStage > benchmark * 0.7) return 'border-yellow-500/50 bg-yellow-500/5';
  return 'border-white/10 bg-white/5';
};
