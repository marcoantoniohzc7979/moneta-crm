export type UserRole = 'ADMIN' | 'DIRECTOR_COMERCIAL' | 'EJECUTIVO_VENTAS' | 'MARKETING';

export type AccountStatus = 'CLIENTE_ACTIVO' | 'CLIENTE_EN_RIESGO' | 'PROSPECTO_CALIFICADO' | 'LEAD_FRIO' | 'CHURNED';

export type Industry = 'BANCA' | 'RETAIL' | 'TELCO' | 'FINTECH' | 'OTRO';

export type CompanySize = 'ENTERPRISE' | 'MID_MARKET' | 'SMB';

export type ProductType = 'PROCESAMIENTO_PAGOS' | 'ONBOARDING_DIGITAL' | 'SEGURIDAD_TRANSACCIONAL' | 'DISPONIBILIDAD_CONTINUA';

export type PipelineStage =
  | 'PROSPECCION'
  | 'CALIFICACION'
  | 'DEMO_PROPUESTA'
  | 'NEGOCIACION'
  | 'CONTRATO'
  | 'CERRADO_GANADO'
  | 'CERRADO_PERDIDO';

export type ContactRole = 'DECISION_MAKER' | 'INFLUENCIADOR' | 'USUARIO' | 'BLOQUEADOR';

export type ActivityType = 'LLAMADA' | 'EMAIL' | 'REUNION' | 'DEMO' | 'PROPUESTA_ENVIADA' | 'CONTRATO_ENVIADO' | 'NOTA';

export type LeadSource = 'REFERIDO' | 'WEB' | 'EVENTO' | 'OUTBOUND' | 'PARTNER';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
}

export interface Account {
  id: string;
  razonSocial: string;
  rfc?: string;
  industry: Industry;
  size: CompanySize;
  status: AccountStatus;
  website?: string;
  phone?: string;
  city?: string;
  healthScore: number;
  annualRevenue?: number;
  employeeCount?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  contacts?: Contact[];
  products?: AccountProduct[];
  opportunities?: Opportunity[];
  _count?: { opportunities: number; activities: number };
}

export interface AccountProduct {
  id: string;
  accountId: string;
  product: ProductType;
  contracted: boolean;
  startDate?: string;
  endDate?: string;
  value?: number;
}

export interface Contact {
  id: string;
  accountId: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  role: ContactRole;
  jobTitle?: string;
  linkedin?: string;
  notes?: string;
  account?: { id: string; razonSocial: string };
}

export interface Opportunity {
  id: string;
  accountId: string;
  ownerId: string;
  name: string;
  stage: PipelineStage;
  value: number;
  probability: number;
  expectedCloseDate?: string;
  actualCloseDate?: string;
  competitors: string[];
  nextStep?: string;
  lossReason?: string;
  notes?: string;
  daysInStage: number;
  lastStageChange: string;
  createdAt: string;
  account?: { id: string; razonSocial: string; industry: Industry };
  owner?: { id: string; name: string };
  products?: OpportunityProduct[];
  activities?: Activity[];
  _count?: { activities: number };
}

export interface OpportunityProduct {
  id: string;
  opportunityId: string;
  product: ProductType;
  value?: number;
}

export interface Lead {
  id: string;
  ownerId: string;
  companyName: string;
  contactName: string;
  email?: string;
  phone?: string;
  industry?: Industry;
  source: LeadSource;
  bantBudget: string;
  bantAuthority: string;
  bantNeed: string;
  bantTimeline: string;
  score: number;
  notes?: string;
  converted: boolean;
  convertedAt?: string;
  owner?: { id: string; name: string };
  createdAt: string;
}

export interface Activity {
  id: string;
  userId: string;
  accountId?: string;
  opportunityId?: string;
  contactId?: string;
  type: ActivityType;
  title: string;
  description?: string;
  scheduledAt?: string;
  completedAt?: string;
  duration?: number;
  outcome?: string;
  createdAt: string;
  user?: { id: string; name: string };
  account?: { id: string; razonSocial: string };
  opportunity?: { id: string; name: string };
  contact?: { id: string; firstName: string; lastName: string };
}

export interface DashboardKPIs {
  pipelineTotal: number;
  weightedPipeline: number;
  closedThisMonth: number;
  winRate: number;
  accountsByStatus: Array<{ status: AccountStatus; _count: number }>;
  stageBreakdown: Array<{ stage: PipelineStage; _sum: { value: number }; _count: number }>;
  productBreakdown: Array<{ product: ProductType; _sum: { value: number }; _count: number }>;
  recentActivities: Activity[];
  staleOpportunities: Opportunity[];
  topOpportunities: Opportunity[];
}
