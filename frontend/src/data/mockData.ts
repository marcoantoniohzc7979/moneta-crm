import { Account, Opportunity, Lead, Contact, Activity, DashboardKPIs } from '../types';

// ─── USERS ───────────────────────────────────────────────────────────────────
export const MOCK_USERS = [
  { id: 'u1', name: 'Javier Gonzalez', email: 'comercial@moneta.com.mx', role: 'DIRECTOR_COMERCIAL' as const },
  { id: 'u2', name: 'Sergio Vega',      email: 'sergio.vega@moneta.com.mx',      role: 'EJECUTIVO_VENTAS' as const },
  { id: 'u3', name: 'Fernando Martínez',email: 'fernando.martinez@moneta.com.mx', role: 'EJECUTIVO_VENTAS' as const },
  { id: 'u4', name: 'Javier González',  email: 'javier.gonzalez@moneta.com.mx',  role: 'EJECUTIVO_VENTAS' as const },
];

// ─── ACCOUNTS ────────────────────────────────────────────────────────────────
export const MOCK_ACCOUNTS: Account[] = [
  // Clientes Activos
  { id: 'acc1', razonSocial: 'BBVA México S.A.',                   rfc: 'BBV920101123', industry: 'BANCA',  size: 'ENTERPRISE',  status: 'CLIENTE_ACTIVO',       healthScore: 85, employeeCount: 36000, website: 'bbvamexico.com',   city: 'Ciudad de México', createdAt: '2023-01-10T00:00:00Z', updatedAt: '2025-05-15T00:00:00Z',
    products: [
      { id: 'ap1', accountId: 'acc1', product: 'PROCESAMIENTO_PAGOS',      contracted: true, value: 3200000 },
      { id: 'ap2', accountId: 'acc1', product: 'SEGURIDAD_TRANSACCIONAL',   contracted: true, value: 2800000 },
      { id: 'ap3', accountId: 'acc1', product: 'DISPONIBILIDAD_CONTINUA',   contracted: true, value: 1500000 },
    ],
    contacts: [
      { id: 'c1', accountId: 'acc1', firstName: 'Roberto',  lastName: 'Hernández', email: 'r.hernandez@bbva.com.mx', jobTitle: 'CTO',  role: 'DECISION_MAKER' },
      { id: 'c2', accountId: 'acc1', firstName: 'Patricia', lastName: 'Morales',   email: 'p.morales@bbva.com.mx',   jobTitle: 'CFO',  role: 'INFLUENCIADOR' },
    ],
    _count: { opportunities: 2, activities: 8 } },

  { id: 'acc2', razonSocial: 'Walmart de México S.A.B. de C.V.',   rfc: 'WMX991205456', industry: 'RETAIL', size: 'ENTERPRISE',  status: 'CLIENTE_ACTIVO',       healthScore: 92, employeeCount: 220000, website: 'walmart.com.mx',  city: 'Ciudad de México', createdAt: '2022-06-01T00:00:00Z', updatedAt: '2025-05-20T00:00:00Z',
    products: [
      { id: 'ap4', accountId: 'acc2', product: 'PROCESAMIENTO_PAGOS', contracted: true, value: 4100000 },
      { id: 'ap5', accountId: 'acc2', product: 'ONBOARDING_DIGITAL',  contracted: true, value: 1800000 },
    ],
    contacts: [
      { id: 'c3', accountId: 'acc2', firstName: 'Diego', lastName: 'Sánchez', email: 'd.sanchez@walmart.com.mx', jobTitle: 'VP Tecnología', role: 'DECISION_MAKER' },
    ],
    _count: { opportunities: 2, activities: 12 } },

  { id: 'acc3', razonSocial: 'Telcel S.A. de C.V.',                 rfc: 'TCL020315789', industry: 'TELCO', size: 'ENTERPRISE',  status: 'CLIENTE_ACTIVO',       healthScore: 78, employeeCount: 80000, website: 'telcel.com',      city: 'Ciudad de México', createdAt: '2022-03-15T00:00:00Z', updatedAt: '2025-04-30T00:00:00Z',
    products: [
      { id: 'ap6', accountId: 'acc3', product: 'PROCESAMIENTO_PAGOS',  contracted: true, value: 2900000 },
      { id: 'ap7', accountId: 'acc3', product: 'DISPONIBILIDAD_CONTINUA', contracted: true, value: 1600000 },
    ],
    contacts: [
      { id: 'c4', accountId: 'acc3', firstName: 'Sofía', lastName: 'Ramírez', email: 's.ramirez@telcel.com', jobTitle: 'Director IT', role: 'DECISION_MAKER' },
    ],
    _count: { opportunities: 1, activities: 6 } },

  { id: 'acc4', razonSocial: 'Banco Santander México S.A.',          rfc: 'BSM880520321', industry: 'BANCA', size: 'ENTERPRISE',  status: 'CLIENTE_ACTIVO',       healthScore: 70, employeeCount: 20000, website: 'santander.com.mx', city: 'Ciudad de México', createdAt: '2021-11-20T00:00:00Z', updatedAt: '2025-03-10T00:00:00Z',
    products: [
      { id: 'ap8', accountId: 'acc4', product: 'SEGURIDAD_TRANSACCIONAL', contracted: true, value: 2100000 },
      { id: 'ap9', accountId: 'acc4', product: 'ONBOARDING_DIGITAL',      contracted: true, value: 1400000 },
    ],
    contacts: [
      { id: 'c5', accountId: 'acc4', firstName: 'Alejandro', lastName: 'Torres', email: 'a.torres@santander.com.mx', jobTitle: 'CTO', role: 'DECISION_MAKER' },
    ],
    _count: { opportunities: 1, activities: 5 } },

  { id: 'acc5', razonSocial: 'El Puerto de Liverpool S.A.B.',        rfc: 'LIV560410654', industry: 'RETAIL', size: 'ENTERPRISE', status: 'CLIENTE_ACTIVO',       healthScore: 88, employeeCount: 45000, website: 'liverpool.com.mx', city: 'Ciudad de México', createdAt: '2022-09-05T00:00:00Z', updatedAt: '2025-05-22T00:00:00Z',
    products: [
      { id: 'ap10', accountId: 'acc5', product: 'PROCESAMIENTO_PAGOS', contracted: true, value: 2600000 },
    ],
    contacts: [
      { id: 'c6', accountId: 'acc5', firstName: 'Valeria', lastName: 'López', email: 'v.lopez@liverpool.com.mx', jobTitle: 'Directora Digital', role: 'DECISION_MAKER' },
    ],
    _count: { opportunities: 2, activities: 7 } },

  // En Riesgo
  { id: 'acc6', razonSocial: 'Grupo Elektra S.A.B.',                 rfc: 'GEL950601987', industry: 'RETAIL', size: 'ENTERPRISE', status: 'CLIENTE_EN_RIESGO',    healthScore: 42, employeeCount: 70000, city: 'Ciudad de México', createdAt: '2021-05-10T00:00:00Z', updatedAt: '2025-01-15T00:00:00Z', products: [], contacts: [], _count: { opportunities: 1, activities: 2 } },
  { id: 'acc7', razonSocial: 'HSBC México S.A.',                     rfc: 'HSB991120147', industry: 'BANCA', size: 'ENTERPRISE',  status: 'CLIENTE_EN_RIESGO',    healthScore: 38, employeeCount: 16000, city: 'Ciudad de México', createdAt: '2021-08-20T00:00:00Z', updatedAt: '2024-12-10T00:00:00Z', products: [], contacts: [], _count: { opportunities: 0, activities: 1 } },

  // Prospectos
  { id: 'acc8',  razonSocial: 'Nu México Financiera S.A.',            rfc: 'NMF210301258', industry: 'FINTECH', size: 'MID_MARKET', status: 'PROSPECTO_CALIFICADO', healthScore: 60, employeeCount: 2500,  city: 'Ciudad de México', createdAt: '2024-09-01T00:00:00Z', updatedAt: '2025-05-10T00:00:00Z',
    contacts: [{ id: 'c7', accountId: 'acc8', firstName: 'Sebastián', lastName: 'Gutiérrez', email: 's.gutierrez@nu.com.mx', jobTitle: 'Head of Engineering', role: 'DECISION_MAKER' }],
    products: [], _count: { opportunities: 1, activities: 4 } },
  { id: 'acc9',  razonSocial: 'OXXO Pay S.A. de C.V.',               rfc: 'OXP180615369', industry: 'RETAIL', size: 'ENTERPRISE',  status: 'PROSPECTO_CALIFICADO', healthScore: 55, employeeCount: 130000, city: 'Monterrey',       createdAt: '2024-11-10T00:00:00Z', updatedAt: '2025-05-18T00:00:00Z',
    contacts: [{ id: 'c8', accountId: 'acc9', firstName: 'Fernanda', lastName: 'Castillo', email: 'f.castillo@oxxopay.com', jobTitle: 'CTO', role: 'DECISION_MAKER' }],
    products: [], _count: { opportunities: 1, activities: 3 } },
  { id: 'acc10', razonSocial: 'Baz Superapp S.A.P.I.',               rfc: 'BAZ200812471', industry: 'FINTECH', size: 'MID_MARKET', status: 'PROSPECTO_CALIFICADO', healthScore: 50, employeeCount: 800,   city: 'Ciudad de México', createdAt: '2025-01-15T00:00:00Z', updatedAt: '2025-04-25T00:00:00Z', products: [], contacts: [], _count: { opportunities: 1, activities: 2 } },
  { id: 'acc11', razonSocial: 'Banorte Digital S.A.',                 rfc: 'BDI190430582', industry: 'BANCA', size: 'ENTERPRISE',  status: 'PROSPECTO_CALIFICADO', healthScore: 58, employeeCount: 33000, city: 'Monterrey',        createdAt: '2024-08-20T00:00:00Z', updatedAt: '2025-05-05T00:00:00Z',
    contacts: [{ id: 'c9', accountId: 'acc11', firstName: 'Claudia', lastName: 'Vega', email: 'c.vega@banorte.com', jobTitle: 'VP Digital', role: 'DECISION_MAKER' }],
    products: [], _count: { opportunities: 1, activities: 5 } },

  // Leads fríos
  { id: 'acc12', razonSocial: 'Coppel S.A. de C.V.',    rfc: 'COP690901693', industry: 'RETAIL', size: 'ENTERPRISE', status: 'LEAD_FRIO', healthScore: 30, city: 'Culiacán',        createdAt: '2025-04-01T00:00:00Z', updatedAt: '2025-04-01T00:00:00Z', products: [], contacts: [], _count: { opportunities: 1, activities: 0 } },
  { id: 'acc13', razonSocial: 'Banco Azteca S.A.',       rfc: 'BAZ020401804', industry: 'BANCA',  size: 'ENTERPRISE', status: 'LEAD_FRIO', healthScore: 25, city: 'Ciudad de México', createdAt: '2025-03-10T00:00:00Z', updatedAt: '2025-03-10T00:00:00Z', products: [], contacts: [], _count: { opportunities: 0, activities: 0 } },
  { id: 'acc14', razonSocial: 'Clip Tecnología S.A.',    rfc: 'CTI160718915', industry: 'FINTECH', size: 'SMB',       status: 'LEAD_FRIO', healthScore: 35, city: 'Ciudad de México', createdAt: '2025-02-20T00:00:00Z', updatedAt: '2025-02-20T00:00:00Z', products: [], contacts: [], _count: { opportunities: 0, activities: 0 } },
  { id: 'acc15', razonSocial: 'AT&T México S.A.',         rfc: 'ATM000901026', industry: 'TELCO',  size: 'ENTERPRISE', status: 'LEAD_FRIO', healthScore: 28, city: 'Ciudad de México', createdAt: '2025-01-05T00:00:00Z', updatedAt: '2025-01-05T00:00:00Z', products: [], contacts: [], _count: { opportunities: 0, activities: 0 } },
  { id: 'acc16', razonSocial: 'Kueski S.A.P.I.',          rfc: 'KUE150202137', industry: 'FINTECH', size: 'SMB',       status: 'LEAD_FRIO', healthScore: 40, city: 'Guadalajara',       createdAt: '2025-03-25T00:00:00Z', updatedAt: '2025-03-25T00:00:00Z', products: [], contacts: [], _count: { opportunities: 1, activities: 0 } },
];

// ─── OPPORTUNITIES ───────────────────────────────────────────────────────────
export const MOCK_OPPORTUNITIES: Opportunity[] = [
  // Sergio Vega
  { id: 'op1',  accountId: 'acc8',  ownerId: 'u2', name: 'Nu México - Procesamiento Pagos Enterprise', stage: 'NEGOCIACION',   value: 8500000,  probability: 70, daysInStage: 45, lastStageChange: '2025-04-16T00:00:00Z', competitors: ['Kushki', 'MIT'], nextStep: 'Revisión legal del contrato', createdAt: '2025-02-01T00:00:00Z', updatedAt: '2025-05-10T00:00:00Z', account: { id: 'acc8',  razonSocial: 'Nu México Financiera S.A.',          industry: 'FINTECH' }, owner: { id: 'u2', name: 'Sergio Vega'       }, products: [{ id: 'opp1', opportunityId: 'op1', product: 'PROCESAMIENTO_PAGOS' }] },
  { id: 'op2',  accountId: 'acc9',  ownerId: 'u2', name: 'OXXO Pay - Suite Completa',                  stage: 'DEMO_PROPUESTA', value: 15000000, probability: 50, daysInStage: 30, lastStageChange: '2025-05-01T00:00:00Z', competitors: ['Adyen', 'Stripe'], nextStep: 'Presentar propuesta económica', createdAt: '2025-01-20T00:00:00Z', updatedAt: '2025-05-20T00:00:00Z', account: { id: 'acc9',  razonSocial: 'OXXO Pay S.A. de C.V.',              industry: 'RETAIL'  }, owner: { id: 'u2', name: 'Sergio Vega'       }, products: [{ id: 'opp2', opportunityId: 'op2', product: 'PROCESAMIENTO_PAGOS' }, { id: 'opp3', opportunityId: 'op2', product: 'ONBOARDING_DIGITAL' }, { id: 'opp4', opportunityId: 'op2', product: 'SEGURIDAD_TRANSACCIONAL' }] },
  { id: 'op3',  accountId: 'acc3',  ownerId: 'u2', name: 'Telcel - Onboarding Digital',                stage: 'PROSPECCION',    value: 4500000,  probability: 25, daysInStage: 10, lastStageChange: '2025-05-21T00:00:00Z', competitors: [],                  nextStep: 'Primera reunión de discovery', createdAt: '2025-05-10T00:00:00Z', updatedAt: '2025-05-21T00:00:00Z', account: { id: 'acc3',  razonSocial: 'Telcel S.A. de C.V.',                industry: 'TELCO'   }, owner: { id: 'u2', name: 'Sergio Vega'       }, products: [{ id: 'opp5', opportunityId: 'op3', product: 'ONBOARDING_DIGITAL' }] },
  { id: 'op4',  accountId: 'acc1',  ownerId: 'u2', name: 'BBVA - Disponibilidad Premium Upgrade',       stage: 'NEGOCIACION',   value: 6000000,  probability: 80, daysInStage: 25, lastStageChange: '2025-05-06T00:00:00Z', competitors: [],                  nextStep: 'Firma de addendum',            createdAt: '2025-03-01T00:00:00Z', updatedAt: '2025-05-06T00:00:00Z', account: { id: 'acc1',  razonSocial: 'BBVA México S.A.',                   industry: 'BANCA'   }, owner: { id: 'u2', name: 'Sergio Vega'       }, products: [{ id: 'opp6', opportunityId: 'op4', product: 'DISPONIBILIDAD_CONTINUA' }] },
  // Fernando Martínez
  { id: 'op5',  accountId: 'acc10', ownerId: 'u3', name: 'Baz - Seguridad Transaccional',              stage: 'CALIFICACION',   value: 3200000,  probability: 40, daysInStage: 20, lastStageChange: '2025-05-11T00:00:00Z', competitors: ['Seon'],            nextStep: 'Demo técnica semana próxima',  createdAt: '2025-04-15T00:00:00Z', updatedAt: '2025-05-11T00:00:00Z', account: { id: 'acc10', razonSocial: 'Baz Superapp S.A.P.I.',              industry: 'FINTECH' }, owner: { id: 'u3', name: 'Fernando Martínez' }, products: [{ id: 'opp7', opportunityId: 'op5', product: 'SEGURIDAD_TRANSACCIONAL' }] },
  { id: 'op6',  accountId: 'acc2',  ownerId: 'u3', name: 'Walmart - Seguridad Transaccional',           stage: 'CONTRATO',       value: 9500000,  probability: 90, daysInStage: 8,  lastStageChange: '2025-05-23T00:00:00Z', competitors: [],                  nextStep: 'Revisión legal y firma',       createdAt: '2024-12-01T00:00:00Z', updatedAt: '2025-05-23T00:00:00Z', account: { id: 'acc2',  razonSocial: 'Walmart de México S.A.B. de C.V.', industry: 'RETAIL'  }, owner: { id: 'u3', name: 'Fernando Martínez' }, products: [{ id: 'opp8', opportunityId: 'op6', product: 'SEGURIDAD_TRANSACCIONAL' }] },
  { id: 'op7',  accountId: 'acc5',  ownerId: 'u3', name: 'Liverpool - Disponibilidad Upgrade',          stage: 'DEMO_PROPUESTA', value: 4000000,  probability: 60, daysInStage: 35, lastStageChange: '2025-04-26T00:00:00Z', competitors: [],                  nextStep: 'Enviar propuesta actualizada', createdAt: '2025-02-20T00:00:00Z', updatedAt: '2025-04-26T00:00:00Z', account: { id: 'acc5',  razonSocial: 'El Puerto de Liverpool S.A.B.',    industry: 'RETAIL'  }, owner: { id: 'u3', name: 'Fernando Martínez' }, products: [{ id: 'opp9', opportunityId: 'op7', product: 'DISPONIBILIDAD_CONTINUA' }] },
  { id: 'op8',  accountId: 'acc4',  ownerId: 'u3', name: 'Santander - Procesamiento Pagos Upgrade',     stage: 'CALIFICACION',   value: 7000000,  probability: 35, daysInStage: 15, lastStageChange: '2025-05-16T00:00:00Z', competitors: ['BBVA Payments'],   nextStep: 'Llamada con CTO esta semana',  createdAt: '2025-04-01T00:00:00Z', updatedAt: '2025-05-16T00:00:00Z', account: { id: 'acc4',  razonSocial: 'Banco Santander México S.A.',       industry: 'BANCA'   }, owner: { id: 'u3', name: 'Fernando Martínez' }, products: [{ id: 'opp10', opportunityId: 'op8', product: 'PROCESAMIENTO_PAGOS' }] },
  // Javier González
  { id: 'op9',  accountId: 'acc11', ownerId: 'u4', name: 'Banorte Digital - Onboarding',                stage: 'DEMO_PROPUESTA', value: 12000000, probability: 55, daysInStage: 60, lastStageChange: '2025-03-31T00:00:00Z', competitors: ['Jumio', 'Onfido'], nextStep: 'Revisión con comité de compras', createdAt: '2024-11-15T00:00:00Z', updatedAt: '2025-03-31T00:00:00Z', account: { id: 'acc11', razonSocial: 'Banorte Digital S.A.',              industry: 'BANCA'   }, owner: { id: 'u4', name: 'Javier González'   }, products: [{ id: 'opp11', opportunityId: 'op9', product: 'ONBOARDING_DIGITAL' }] },
  { id: 'op10', accountId: 'acc16', ownerId: 'u4', name: 'Kueski - Onboarding Digital',                 stage: 'CALIFICACION',   value: 1800000,  probability: 30, daysInStage: 22, lastStageChange: '2025-05-09T00:00:00Z', competitors: [],                  nextStep: 'Enviar caso de uso',           createdAt: '2025-04-15T00:00:00Z', updatedAt: '2025-05-09T00:00:00Z', account: { id: 'acc16', razonSocial: 'Kueski S.A.P.I.',                   industry: 'FINTECH' }, owner: { id: 'u4', name: 'Javier González'   }, products: [{ id: 'opp12', opportunityId: 'op10', product: 'ONBOARDING_DIGITAL' }] },
  { id: 'op11', accountId: 'acc12', ownerId: 'u4', name: 'Coppel - Procesamiento Pagos',                stage: 'PROSPECCION',    value: 11000000, probability: 20, daysInStage: 5,  lastStageChange: '2025-05-26T00:00:00Z', competitors: [],                  nextStep: 'Agendar primera reunión',      createdAt: '2025-05-20T00:00:00Z', updatedAt: '2025-05-26T00:00:00Z', account: { id: 'acc12', razonSocial: 'Coppel S.A. de C.V.',               industry: 'RETAIL'  }, owner: { id: 'u4', name: 'Javier González'   }, products: [{ id: 'opp13', opportunityId: 'op11', product: 'PROCESAMIENTO_PAGOS' }] },
  // Admin
  { id: 'op12', accountId: 'acc6',  ownerId: 'u1', name: 'Grupo Elektra - Suite Seguridad',             stage: 'PROSPECCION',    value: 5500000,  probability: 15, daysInStage: 8,  lastStageChange: '2025-05-23T00:00:00Z', competitors: [],                  nextStep: 'Identificar contacto clave',   createdAt: '2025-05-15T00:00:00Z', updatedAt: '2025-05-23T00:00:00Z', account: { id: 'acc6',  razonSocial: 'Grupo Elektra S.A.B.',               industry: 'RETAIL'  }, owner: { id: 'u1', name: 'Javier Gonzalez'  }, products: [{ id: 'opp14', opportunityId: 'op12', product: 'SEGURIDAD_TRANSACCIONAL' }] },
];

// ─── LEADS ───────────────────────────────────────────────────────────────────
export const MOCK_LEADS: Lead[] = [
  { id: 'l1', ownerId: 'u2', companyName: 'Fincomún S.A.P.I.',        contactName: 'Miguel Ángel Torres', email: 'm.torres@fincomun.mx',      source: 'REFERIDO', bantBudget: 'SI',          bantAuthority: 'SI',          bantNeed: 'ALTA',  bantTimeline: 'MENOS_3M',  score: 100, converted: false, industry: 'FINTECH', createdAt: '2025-04-10T00:00:00Z', updatedAt: '2025-04-10T00:00:00Z', owner: { id: 'u2', name: 'Sergio Vega'       } },
  { id: 'l2', ownerId: 'u2', companyName: 'Totalplay Telecomunicaciones', contactName: 'Ana Belén Ortiz',  email: 'a.ortiz@totalplay.com.mx',   source: 'OUTBOUND', bantBudget: 'SI',          bantAuthority: 'SI',          bantNeed: 'ALTA',  bantTimeline: 'TRES_A_6M', score: 85,  converted: false, industry: 'TELCO',  createdAt: '2025-03-22T00:00:00Z', updatedAt: '2025-03-22T00:00:00Z', owner: { id: 'u2', name: 'Sergio Vega'       } },
  { id: 'l3', ownerId: 'u2', companyName: 'Afirme Grupo Financiero',   contactName: 'Paola Mendoza',       email: 'p.mendoza@afirme.com',       source: 'REFERIDO', bantBudget: 'SI',          bantAuthority: 'SI',          bantNeed: 'ALTA',  bantTimeline: 'MENOS_3M',  score: 100, converted: false, industry: 'BANCA',  createdAt: '2025-05-01T00:00:00Z', updatedAt: '2025-05-01T00:00:00Z', owner: { id: 'u2', name: 'Sergio Vega'       } },
  { id: 'l4', ownerId: 'u3', companyName: 'Conekta S.A. de C.V.',      contactName: 'Isabella Ruiz',       email: 'i.ruiz@conekta.com',         source: 'PARTNER',  bantBudget: 'SI',          bantAuthority: 'INFLUENCIADOR', bantNeed: 'ALTA', bantTimeline: 'MENOS_3M', score: 70,  converted: false, industry: 'FINTECH', createdAt: '2025-04-18T00:00:00Z', updatedAt: '2025-04-18T00:00:00Z', owner: { id: 'u3', name: 'Fernando Martínez' } },
  { id: 'l5', ownerId: 'u3', companyName: 'Credijusto S.A.P.I.',       contactName: 'Lorena Medina',       email: 'l.medina@credijusto.mx',     source: 'WEB',      bantBudget: 'DESCONOCIDO', bantAuthority: 'INFLUENCIADOR', bantNeed: 'MEDIA', bantTimeline: 'TRES_A_6M', score: 40, converted: false, industry: 'FINTECH', createdAt: '2025-03-05T00:00:00Z', updatedAt: '2025-03-05T00:00:00Z', owner: { id: 'u3', name: 'Fernando Martínez' } },
  { id: 'l6', ownerId: 'u3', companyName: 'Flink S.A.P.I.',            contactName: 'Eduardo Campos',      email: 'e.campos@flink.mx',          source: 'WEB',      bantBudget: 'DESCONOCIDO', bantAuthority: 'SI',          bantNeed: 'MEDIA', bantTimeline: 'SEIS_A_12M', score: 45, converted: false, industry: 'FINTECH', createdAt: '2025-02-14T00:00:00Z', updatedAt: '2025-02-14T00:00:00Z', owner: { id: 'u3', name: 'Fernando Martínez' } },
  { id: 'l7', ownerId: 'u4', companyName: 'Izzi Telecom S.A.',          contactName: 'Ricardo Salinas',     email: 'r.salinas@izzi.mx',          source: 'OUTBOUND', bantBudget: 'DESCONOCIDO', bantAuthority: 'INFLUENCIADOR', bantNeed: 'MEDIA', bantTimeline: 'SEIS_A_12M', score: 30, converted: false, industry: 'TELCO',  createdAt: '2025-01-20T00:00:00Z', updatedAt: '2025-01-20T00:00:00Z', owner: { id: 'u4', name: 'Javier González'   } },
  { id: 'l8', ownerId: 'u4', companyName: 'Grupo Axtel S.A.B.',         contactName: 'Carlos Reyes',        email: 'c.reyes@axtel.mx',           source: 'EVENTO',   bantBudget: 'NO',          bantAuthority: 'USUARIO',     bantNeed: 'BAJA',  bantTimeline: 'MAS_12M',   score: 0,   converted: false, industry: 'TELCO',  createdAt: '2024-12-10T00:00:00Z', updatedAt: '2024-12-10T00:00:00Z', owner: { id: 'u4', name: 'Javier González'   } },
  { id: 'l9', ownerId: 'u4', companyName: 'Tiendanube México',          contactName: 'Rodrigo Flores',      email: 'r.flores@tiendanube.com',    source: 'EVENTO',   bantBudget: 'NO',          bantAuthority: 'USUARIO',     bantNeed: 'BAJA',  bantTimeline: 'MAS_12M',   score: 0,   converted: false, industry: 'RETAIL', createdAt: '2025-01-30T00:00:00Z', updatedAt: '2025-01-30T00:00:00Z', owner: { id: 'u4', name: 'Javier González'   } },
  { id: 'l10',ownerId: 'u1', companyName: 'Finterra S.A.P.I.',         contactName: 'Valentina Castro',    email: 'v.castro@finterra.mx',       source: 'WEB',      bantBudget: 'NO',          bantAuthority: 'USUARIO',     bantNeed: 'BAJA',  bantTimeline: 'MAS_12M',   score: 0,   converted: false, industry: 'FINTECH', createdAt: '2024-11-05T00:00:00Z', updatedAt: '2024-11-05T00:00:00Z', owner: { id: 'u1', name: 'Javier Gonzalez'  } },
];

// ─── CONTACTS ────────────────────────────────────────────────────────────────
export const MOCK_CONTACTS: Contact[] = [
  { id: 'c1',  accountId: 'acc1',  firstName: 'Roberto',    lastName: 'Hernández', email: 'r.hernandez@bbva.com.mx',      phone: '+52 55 5226 2663', jobTitle: 'CTO',              role: 'DECISION_MAKER', account: { id: 'acc1',  razonSocial: 'BBVA México S.A.'                   } },
  { id: 'c2',  accountId: 'acc1',  firstName: 'Patricia',   lastName: 'Morales',   email: 'p.morales@bbva.com.mx',        phone: '+52 55 5226 2001', jobTitle: 'CFO',              role: 'INFLUENCIADOR',  account: { id: 'acc1',  razonSocial: 'BBVA México S.A.'                   } },
  { id: 'c3',  accountId: 'acc2',  firstName: 'Diego',      lastName: 'Sánchez',   email: 'd.sanchez@walmart.com.mx',     phone: '+52 55 5283 0100', jobTitle: 'VP Tecnología',    role: 'DECISION_MAKER', account: { id: 'acc2',  razonSocial: 'Walmart de México S.A.B. de C.V.'   } },
  { id: 'c4',  accountId: 'acc3',  firstName: 'Sofía',      lastName: 'Ramírez',   email: 's.ramirez@telcel.com',         phone: '+52 55 2581 9800', jobTitle: 'Director IT',      role: 'DECISION_MAKER', account: { id: 'acc3',  razonSocial: 'Telcel S.A. de C.V.'                } },
  { id: 'c5',  accountId: 'acc4',  firstName: 'Alejandro',  lastName: 'Torres',    email: 'a.torres@santander.com.mx',    phone: '+52 55 5169 4300', jobTitle: 'CTO',              role: 'DECISION_MAKER', account: { id: 'acc4',  razonSocial: 'Banco Santander México S.A.'        } },
  { id: 'c6',  accountId: 'acc5',  firstName: 'Valeria',    lastName: 'López',     email: 'v.lopez@liverpool.com.mx',     phone: '+52 55 9177 5850', jobTitle: 'Directora Digital', role: 'DECISION_MAKER', account: { id: 'acc5', razonSocial: 'El Puerto de Liverpool S.A.B.'     } },
  { id: 'c7',  accountId: 'acc8',  firstName: 'Sebastián',  lastName: 'Gutiérrez', email: 's.gutierrez@nu.com.mx',        phone: '+52 55 4040 4040', jobTitle: 'Head of Engineering', role: 'DECISION_MAKER', account: { id: 'acc8', razonSocial: 'Nu México Financiera S.A.'        } },
  { id: 'c8',  accountId: 'acc9',  firstName: 'Fernanda',   lastName: 'Castillo',  email: 'f.castillo@oxxopay.com',       phone: '+52 81 8389 3000', jobTitle: 'CTO',              role: 'DECISION_MAKER', account: { id: 'acc9',  razonSocial: 'OXXO Pay S.A. de C.V.'              } },
  { id: 'c9',  accountId: 'acc11', firstName: 'Claudia',    lastName: 'Vega',      email: 'c.vega@banorte.com',           phone: '+52 81 8319 6000', jobTitle: 'VP Digital',       role: 'DECISION_MAKER', account: { id: 'acc11', razonSocial: 'Banorte Digital S.A.'               } },
  { id: 'c10', accountId: 'acc2',  firstName: 'Miguel',     lastName: 'Fuentes',   email: 'm.fuentes@walmart.com.mx',     phone: '+52 55 5283 0101', jobTitle: 'Director Compras', role: 'INFLUENCIADOR',  account: { id: 'acc2',  razonSocial: 'Walmart de México S.A.B. de C.V.'   } },
];

// ─── ACTIVITIES ───────────────────────────────────────────────────────────────
export const MOCK_ACTIVITIES: Activity[] = [
  { id: 'a1',  userId: 'u2', accountId: 'acc8',  opportunityId: 'op1',  type: 'REUNION',           title: 'Reunión de negociación con equipo legal',    description: 'Revisamos términos del contrato y SLAs.', completedAt: '2025-05-28T10:00:00Z', createdAt: '2025-05-28T10:00:00Z', updatedAt: '2025-05-28T10:00:00Z', user: { id: 'u2', name: 'Sergio Vega'       }, account: { id: 'acc8',  razonSocial: 'Nu México Financiera S.A.'          }, opportunity: { id: 'op1', name: 'Nu México - Procesamiento Pagos Enterprise' } },
  { id: 'a2',  userId: 'u3', accountId: 'acc2',  opportunityId: 'op6',  type: 'CONTRATO_ENVIADO',  title: 'Contrato enviado para firma de Walmart',     description: 'Versión final revisada por legal.', completedAt: '2025-05-27T14:30:00Z', createdAt: '2025-05-27T14:30:00Z', updatedAt: '2025-05-27T14:30:00Z', user: { id: 'u3', name: 'Fernando Martínez' }, account: { id: 'acc2',  razonSocial: 'Walmart de México S.A.B. de C.V.'   }, opportunity: { id: 'op6', name: 'Walmart - Seguridad Transaccional' } },
  { id: 'a3',  userId: 'u4', accountId: 'acc11', opportunityId: 'op9',  type: 'LLAMADA',           title: 'Llamada de seguimiento con Claudia Vega',    description: 'Actualización de status ante comité.', completedAt: '2025-05-27T11:00:00Z', createdAt: '2025-05-27T11:00:00Z', updatedAt: '2025-05-27T11:00:00Z', user: { id: 'u4', name: 'Javier González'   }, account: { id: 'acc11', razonSocial: 'Banorte Digital S.A.'                }, opportunity: { id: 'op9', name: 'Banorte Digital - Onboarding' } },
  { id: 'a4',  userId: 'u2', accountId: 'acc9',  opportunityId: 'op2',  type: 'PROPUESTA_ENVIADA', title: 'Propuesta comercial OXXO Pay enviada',       description: 'Suite completa con pricing por volumen.', completedAt: '2025-05-26T09:00:00Z', createdAt: '2025-05-26T09:00:00Z', updatedAt: '2025-05-26T09:00:00Z', user: { id: 'u2', name: 'Sergio Vega'       }, account: { id: 'acc9',  razonSocial: 'OXXO Pay S.A. de C.V.'              }, opportunity: { id: 'op2', name: 'OXXO Pay - Suite Completa' } },
  { id: 'a5',  userId: 'u3', accountId: 'acc5',  opportunityId: 'op7',  type: 'DEMO',              title: 'Demo de Disponibilidad Contínua — Liverpool', description: 'Presentamos uptime 99.999% y casos de uso.', completedAt: '2025-05-24T16:00:00Z', createdAt: '2025-05-24T16:00:00Z', updatedAt: '2025-05-24T16:00:00Z', user: { id: 'u3', name: 'Fernando Martínez' }, account: { id: 'acc5',  razonSocial: 'El Puerto de Liverpool S.A.B.'      }, opportunity: { id: 'op7', name: 'Liverpool - Disponibilidad Upgrade' } },
  { id: 'a6',  userId: 'u1', accountId: 'acc1',  opportunityId: 'op4',  type: 'EMAIL',             title: 'Email de seguimiento a Roberto Hernández',   description: 'Status del addendum de disponibilidad.', completedAt: '2025-05-23T12:00:00Z', createdAt: '2025-05-23T12:00:00Z', updatedAt: '2025-05-23T12:00:00Z', user: { id: 'u1', name: 'Javier Gonzalez'  }, account: { id: 'acc1',  razonSocial: 'BBVA México S.A.'                   }, opportunity: { id: 'op4', name: 'BBVA - Disponibilidad Premium Upgrade' } },
  { id: 'a7',  userId: 'u4', accountId: 'acc10', opportunityId: 'op5',  type: 'LLAMADA',           title: 'Calificación técnica con equipo Baz',        description: 'Validamos requerimientos de antifraude.', completedAt: '2025-05-22T10:30:00Z', createdAt: '2025-05-22T10:30:00Z', updatedAt: '2025-05-22T10:30:00Z', user: { id: 'u4', name: 'Javier González'   }, account: { id: 'acc10', razonSocial: 'Baz Superapp S.A.P.I.'              }, opportunity: { id: 'op5', name: 'Baz - Seguridad Transaccional' } },
  { id: 'a8',  userId: 'u3', accountId: 'acc4',  opportunityId: 'op8',  type: 'REUNION',           title: 'Reunión de calificación con CTO Santander',  description: 'Presentamos roadmap de procesamiento.', completedAt: '2025-05-20T09:00:00Z', createdAt: '2025-05-20T09:00:00Z', updatedAt: '2025-05-20T09:00:00Z', user: { id: 'u3', name: 'Fernando Martínez' }, account: { id: 'acc4',  razonSocial: 'Banco Santander México S.A.'        }, opportunity: { id: 'op8', name: 'Santander - Procesamiento Pagos Upgrade' } },
  { id: 'a9',  userId: 'u2', accountId: 'acc3',  opportunityId: 'op3',  type: 'EMAIL',             title: 'Primer contacto con Director IT Telcel',     description: 'Enviamos one-pager de Onboarding Digital.', completedAt: '2025-05-19T15:00:00Z', createdAt: '2025-05-19T15:00:00Z', updatedAt: '2025-05-19T15:00:00Z', user: { id: 'u2', name: 'Sergio Vega'       }, account: { id: 'acc3',  razonSocial: 'Telcel S.A. de C.V.'                }, opportunity: { id: 'op3', name: 'Telcel - Onboarding Digital' } },
  { id: 'a10', userId: 'u4', accountId: 'acc16', opportunityId: 'op10', type: 'NOTA',              title: 'Nota: Kueski en revisión de presupuesto',    description: 'Esperan aprobación de board Q3.', completedAt: '2025-05-15T11:00:00Z', createdAt: '2025-05-15T11:00:00Z', updatedAt: '2025-05-15T11:00:00Z', user: { id: 'u4', name: 'Javier González'   }, account: { id: 'acc16', razonSocial: 'Kueski S.A.P.I.'                    } },
];

// ─── DASHBOARD KPIs ───────────────────────────────────────────────────────────
export const MOCK_KPIS: DashboardKPIs = {
  pipelineTotal:    88200000,
  weightedPipeline: 49455000,
  closedThisMonth:  12000000,
  winRate:          67,
  accountsByStatus: [
    { status: 'CLIENTE_ACTIVO',       _count: 5 },
    { status: 'CLIENTE_EN_RIESGO',    _count: 2 },
    { status: 'PROSPECTO_CALIFICADO', _count: 4 },
    { status: 'LEAD_FRIO',            _count: 5 },
  ],
  stageBreakdown: [
    { stage: 'PROSPECCION',    _sum: { value: 21000000 }, _count: 3 },
    { stage: 'CALIFICACION',   _sum: { value: 12000000 }, _count: 3 },
    { stage: 'DEMO_PROPUESTA', _sum: { value: 31000000 }, _count: 3 },
    { stage: 'NEGOCIACION',    _sum: { value: 14500000 }, _count: 2 },
    { stage: 'CONTRATO',       _sum: { value: 9500000  }, _count: 1 },
  ],
  productBreakdown: [
    { product: 'PROCESAMIENTO_PAGOS',      _sum: { value: 42000000 }, _count: 6 },
    { product: 'ONBOARDING_DIGITAL',       _sum: { value: 21000000 }, _count: 4 },
    { product: 'SEGURIDAD_TRANSACCIONAL',  _sum: { value: 18000000 }, _count: 4 },
    { product: 'DISPONIBILIDAD_CONTINUA',  _sum: { value: 7200000  }, _count: 2 },
  ],
  recentActivities: MOCK_ACTIVITIES.slice(0, 6),
  staleOpportunities: [MOCK_OPPORTUNITIES[8]], // Banorte 60 días
  topOpportunities: [
    MOCK_OPPORTUNITIES[1],  // OXXO Pay 15M
    MOCK_OPPORTUNITIES[8],  // Banorte 12M
    MOCK_OPPORTUNITIES[10], // Coppel 11M
    MOCK_OPPORTUNITIES[5],  // Walmart 9.5M
    MOCK_OPPORTUNITIES[0],  // Nu México 8.5M
  ],
};

// ─── FORECAST (últimos 6 meses) ───────────────────────────────────────────────
export const MOCK_FORECAST = [
  { month: '2024-12', revenue: 8000000  },
  { month: '2025-01', revenue: 5500000  },
  { month: '2025-02', revenue: 7200000  },
  { month: '2025-03', revenue: 0        },
  { month: '2025-04', revenue: 4200000  },
  { month: '2025-05', revenue: 12000000 },
];

// ─── TEAM STATS ───────────────────────────────────────────────────────────────
export const MOCK_TEAM_STATS = [
  { id: 'u2', name: 'Sergio Vega',       email: 'sergio.vega@moneta.com.mx',       role: 'EJECUTIVO_VENTAS' as const, activeOps: 4, pipeline: 34000000, weighted: 23700000, closedWon: 2, closedValue: 15200000, winRate: 100, activitiesLast30: 12, byStage: { PROSPECCION: 1, NEGOCIACION: 2, DEMO_PROPUESTA: 1 } },
  { id: 'u3', name: 'Fernando Martínez', email: 'fernando.martinez@moneta.com.mx', role: 'EJECUTIVO_VENTAS' as const, activeOps: 4, pipeline: 23700000, weighted: 14130000, closedWon: 1, closedValue: 5500000,  winRate: 50,  activitiesLast30: 10, byStage: { CALIFICACION: 2, DEMO_PROPUESTA: 1, CONTRATO: 1 } },
  { id: 'u4', name: 'Javier González',   email: 'javier.gonzalez@moneta.com.mx',   role: 'EJECUTIVO_VENTAS' as const, activeOps: 3, pipeline: 24800000, weighted: 10080000, closedWon: 1, closedValue: 4200000,  winRate: 50,  activitiesLast30: 8,  byStage: { PROSPECCION: 1, CALIFICACION: 1, DEMO_PROPUESTA: 1 } },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
export const delay = (ms = 350) => new Promise<void>(r => setTimeout(r, ms));
