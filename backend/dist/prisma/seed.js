"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const date_fns_1 = require("date-fns");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log('Seeding Moneta CRM...');
    // Limpiar datos existentes en orden correcto
    await prisma.stageHistory.deleteMany();
    await prisma.opportunityStakeholder.deleteMany();
    await prisma.opportunityProduct.deleteMany();
    await prisma.activity.deleteMany();
    await prisma.opportunity.deleteMany();
    await prisma.lead.deleteMany();
    await prisma.contact.deleteMany();
    await prisma.accountProduct.deleteMany();
    await prisma.account.deleteMany();
    await prisma.user.deleteMany();
    // Usuarios
    const hash = await bcryptjs_1.default.hash('moneta2024', 10);
    const [user, sergio, fernando, javier] = await Promise.all([
        prisma.user.create({ data: { email: 'comercial@moneta.com.mx', name: 'Equipo Comercial', password: hash, role: 'ADMIN' } }),
        prisma.user.create({ data: { email: 'sergio.vega@moneta.com.mx', name: 'Sergio Vega', password: hash, role: 'EJECUTIVO_VENTAS' } }),
        prisma.user.create({ data: { email: 'fernando.martinez@moneta.com.mx', name: 'Fernando Martínez', password: hash, role: 'EJECUTIVO_VENTAS' } }),
        prisma.user.create({ data: { email: 'javier.gonzalez@moneta.com.mx', name: 'Javier González', password: hash, role: 'EJECUTIVO_VENTAS' } }),
    ]);
    // Cuentas activas
    const activeAccounts = [
        { razonSocial: 'BBVA México S.A.', rfc: 'BBV920101123', industry: 'BANCA', size: 'ENTERPRISE', status: 'CLIENTE_ACTIVO', healthScore: 85, employeeCount: 36000, website: 'bbvamexico.com', city: 'Ciudad de México' },
        { razonSocial: 'Walmart de México S.A.B. de C.V.', rfc: 'WMX991205456', industry: 'RETAIL', size: 'ENTERPRISE', status: 'CLIENTE_ACTIVO', healthScore: 92, employeeCount: 220000, website: 'walmart.com.mx', city: 'Ciudad de México' },
        { razonSocial: 'Telcel S.A. de C.V.', rfc: 'TCL020315789', industry: 'TELCO', size: 'ENTERPRISE', status: 'CLIENTE_ACTIVO', healthScore: 78, employeeCount: 80000, website: 'telcel.com', city: 'Ciudad de México' },
        { razonSocial: 'Banco Santander México S.A.', rfc: 'BSM880520321', industry: 'BANCA', size: 'ENTERPRISE', status: 'CLIENTE_ACTIVO', healthScore: 70, employeeCount: 20000, website: 'santander.com.mx', city: 'Ciudad de México' },
        { razonSocial: 'El Puerto de Liverpool S.A.B.', rfc: 'LIV560410654', industry: 'RETAIL', size: 'ENTERPRISE', status: 'CLIENTE_ACTIVO', healthScore: 88, employeeCount: 45000, website: 'liverpool.com.mx', city: 'Ciudad de México' },
    ];
    const riskAccounts = [
        { razonSocial: 'Grupo Elektra S.A.B.', rfc: 'GEL950601987', industry: 'RETAIL', size: 'ENTERPRISE', status: 'CLIENTE_EN_RIESGO', healthScore: 42, employeeCount: 70000, city: 'Ciudad de México' },
        { razonSocial: 'HSBC México S.A.', rfc: 'HSB991120147', industry: 'BANCA', size: 'ENTERPRISE', status: 'CLIENTE_EN_RIESGO', healthScore: 38, employeeCount: 16000, city: 'Ciudad de México' },
    ];
    const prospectAccounts = [
        { razonSocial: 'Nu México Financiera S.A.', rfc: 'NMF210301258', industry: 'FINTECH', size: 'MID_MARKET', status: 'PROSPECTO_CALIFICADO', healthScore: 60, employeeCount: 2500, city: 'Ciudad de México' },
        { razonSocial: 'OXXO Pay S.A. de C.V.', rfc: 'OXP180615369', industry: 'RETAIL', size: 'ENTERPRISE', status: 'PROSPECTO_CALIFICADO', healthScore: 55, employeeCount: 130000, city: 'Monterrey' },
        { razonSocial: 'Baz Superapp S.A.P.I.', rfc: 'BAZ200812471', industry: 'FINTECH', size: 'MID_MARKET', status: 'PROSPECTO_CALIFICADO', healthScore: 50, employeeCount: 800, city: 'Ciudad de México' },
        { razonSocial: 'Banorte Digital S.A.', rfc: 'BDI190430582', industry: 'BANCA', size: 'ENTERPRISE', status: 'PROSPECTO_CALIFICADO', healthScore: 58, employeeCount: 33000, city: 'Monterrey' },
    ];
    const coldLeadAccounts = [
        { razonSocial: 'Coppel S.A. de C.V.', rfc: 'COP690901693', industry: 'RETAIL', size: 'ENTERPRISE', status: 'LEAD_FRIO', healthScore: 30, city: 'Culiacán' },
        { razonSocial: 'Banco Azteca S.A.', rfc: 'BAZ020401804', industry: 'BANCA', size: 'ENTERPRISE', status: 'LEAD_FRIO', healthScore: 25, city: 'Ciudad de México' },
        { razonSocial: 'Clip Tecnología S.A.', rfc: 'CTI160718915', industry: 'FINTECH', size: 'SMB', status: 'LEAD_FRIO', healthScore: 35, city: 'Ciudad de México' },
        { razonSocial: 'AT&T México S.A.', rfc: 'ATM000901026', industry: 'TELCO', size: 'ENTERPRISE', status: 'LEAD_FRIO', healthScore: 28, city: 'Ciudad de México' },
        { razonSocial: 'Kueski S.A.P.I.', rfc: 'KUE150202137', industry: 'FINTECH', size: 'SMB', status: 'LEAD_FRIO', healthScore: 40, city: 'Guadalajara' },
    ];
    const allAccountData = [...activeAccounts, ...riskAccounts, ...prospectAccounts, ...coldLeadAccounts];
    const createdAccounts = {};
    for (const accData of allAccountData) {
        const acc = await prisma.account.create({ data: accData });
        createdAccounts[accData.razonSocial] = acc.id;
    }
    // Contactos
    const contactsData = [
        { accountName: 'BBVA México S.A.', firstName: 'Roberto', lastName: 'Hernández', email: 'r.hernandez@bbva.com.mx', jobTitle: 'CTO', role: 'DECISION_MAKER' },
        { accountName: 'BBVA México S.A.', firstName: 'Patricia', lastName: 'Morales', email: 'p.morales@bbva.com.mx', jobTitle: 'CFO', role: 'INFLUENCIADOR' },
        { accountName: 'Walmart de México S.A.B. de C.V.', firstName: 'Diego', lastName: 'Sánchez', email: 'd.sanchez@walmart.com.mx', jobTitle: 'VP Tecnología', role: 'DECISION_MAKER' },
        { accountName: 'Telcel S.A. de C.V.', firstName: 'Sofía', lastName: 'Ramírez', email: 's.ramirez@telcel.com', jobTitle: 'Director IT', role: 'DECISION_MAKER' },
        { accountName: 'Banco Santander México S.A.', firstName: 'Alejandro', lastName: 'Torres', email: 'a.torres@santander.com.mx', jobTitle: 'CTO', role: 'DECISION_MAKER' },
        { accountName: 'El Puerto de Liverpool S.A.B.', firstName: 'Valeria', lastName: 'López', email: 'v.lopez@liverpool.com.mx', jobTitle: 'Directora Digital', role: 'DECISION_MAKER' },
        { accountName: 'Nu México Financiera S.A.', firstName: 'Sebastián', lastName: 'Gutiérrez', email: 's.gutierrez@nu.com.mx', jobTitle: 'Head of Engineering', role: 'DECISION_MAKER' },
        { accountName: 'OXXO Pay S.A. de C.V.', firstName: 'Fernanda', lastName: 'Castillo', email: 'f.castillo@oxxopay.com', jobTitle: 'CTO', role: 'DECISION_MAKER' },
        { accountName: 'Baz Superapp S.A.P.I.', firstName: 'Andrés', lastName: 'Jiménez', email: 'a.jimenez@baz.mx', jobTitle: 'CEO', role: 'DECISION_MAKER' },
        { accountName: 'Banorte Digital S.A.', firstName: 'Claudia', lastName: 'Vega', email: 'c.vega@banorte.com', jobTitle: 'VP Digital', role: 'DECISION_MAKER' },
    ];
    for (const c of contactsData) {
        const accountId = createdAccounts[c.accountName];
        if (!accountId)
            continue;
        const { accountName, ...contactData } = c;
        await prisma.contact.create({ data: { ...contactData, accountId } });
    }
    // Productos contratados
    const accountProducts = [
        { name: 'BBVA México S.A.', products: ['PROCESAMIENTO_PAGOS', 'SEGURIDAD_TRANSACCIONAL', 'DISPONIBILIDAD_CONTINUA'] },
        { name: 'Walmart de México S.A.B. de C.V.', products: ['PROCESAMIENTO_PAGOS', 'ONBOARDING_DIGITAL'] },
        { name: 'Telcel S.A. de C.V.', products: ['PROCESAMIENTO_PAGOS', 'DISPONIBILIDAD_CONTINUA'] },
        { name: 'Banco Santander México S.A.', products: ['SEGURIDAD_TRANSACCIONAL', 'ONBOARDING_DIGITAL'] },
        { name: 'El Puerto de Liverpool S.A.B.', products: ['PROCESAMIENTO_PAGOS'] },
    ];
    for (const ap of accountProducts) {
        const accountId = createdAccounts[ap.name];
        if (!accountId)
            continue;
        for (const product of ap.products) {
            await prisma.accountProduct.create({
                data: { accountId, product: product, contracted: true, startDate: (0, date_fns_1.subDays)(new Date(), 365), value: Math.floor(Math.random() * 5000000) + 1000000 }
            });
        }
    }
    // Oportunidades distribuidas entre los Recursos Comerciales
    const opportunitiesData = [
        // Sergio Vega
        { name: 'Nu México - Procesamiento Pagos Enterprise', accountName: 'Nu México Financiera S.A.', stage: 'NEGOCIACION', value: 8500000, probability: 70, products: ['PROCESAMIENTO_PAGOS'], daysAgo: 45, owner: sergio.id },
        { name: 'OXXO Pay - Suite Completa', accountName: 'OXXO Pay S.A. de C.V.', stage: 'DEMO_PROPUESTA', value: 15000000, probability: 50, products: ['PROCESAMIENTO_PAGOS', 'ONBOARDING_DIGITAL', 'SEGURIDAD_TRANSACCIONAL'], daysAgo: 30, owner: sergio.id },
        { name: 'Telcel - Onboarding Digital', accountName: 'Telcel S.A. de C.V.', stage: 'PROSPECCION', value: 4500000, probability: 25, products: ['ONBOARDING_DIGITAL'], daysAgo: 10, owner: sergio.id },
        { name: 'BBVA - Disponibilidad Premium Upgrade', accountName: 'BBVA México S.A.', stage: 'NEGOCIACION', value: 6000000, probability: 80, products: ['DISPONIBILIDAD_CONTINUA'], daysAgo: 25, owner: sergio.id },
        // Fernando Martínez
        { name: 'Baz - Seguridad Transaccional', accountName: 'Baz Superapp S.A.P.I.', stage: 'CALIFICACION', value: 3200000, probability: 40, products: ['SEGURIDAD_TRANSACCIONAL'], daysAgo: 20, owner: fernando.id },
        { name: 'Walmart - Seguridad Transaccional', accountName: 'Walmart de México S.A.B. de C.V.', stage: 'CONTRATO', value: 9500000, probability: 90, products: ['SEGURIDAD_TRANSACCIONAL'], daysAgo: 90, owner: fernando.id },
        { name: 'Liverpool - Disponibilidad Upgrade', accountName: 'El Puerto de Liverpool S.A.B.', stage: 'DEMO_PROPUESTA', value: 4000000, probability: 60, products: ['DISPONIBILIDAD_CONTINUA'], daysAgo: 35, owner: fernando.id },
        { name: 'Santander - Procesamiento Pagos Upgrade', accountName: 'Banco Santander México S.A.', stage: 'CALIFICACION', value: 7000000, probability: 35, products: ['PROCESAMIENTO_PAGOS'], daysAgo: 15, owner: fernando.id },
        // Javier González
        { name: 'Banorte Digital - Onboarding', accountName: 'Banorte Digital S.A.', stage: 'DEMO_PROPUESTA', value: 12000000, probability: 55, products: ['ONBOARDING_DIGITAL'], daysAgo: 60, owner: javier.id },
        { name: 'Kueski - Onboarding Digital', accountName: 'Kueski S.A.P.I.', stage: 'CALIFICACION', value: 1800000, probability: 30, products: ['ONBOARDING_DIGITAL'], daysAgo: 22, owner: javier.id },
        { name: 'Coppel - Procesamiento Pagos', accountName: 'Coppel S.A. de C.V.', stage: 'PROSPECCION', value: 11000000, probability: 20, products: ['PROCESAMIENTO_PAGOS'], daysAgo: 5, owner: javier.id },
        // Equipo Comercial (admin)
        { name: 'Grupo Elektra - Suite Seguridad', accountName: 'Grupo Elektra S.A.B.', stage: 'PROSPECCION', value: 5500000, probability: 15, products: ['SEGURIDAD_TRANSACCIONAL'], daysAgo: 8, owner: user.id },
    ];
    const createdOpportunities = [];
    for (const op of opportunitiesData) {
        const accountId = createdAccounts[op.accountName];
        if (!accountId)
            continue;
        const created = await prisma.opportunity.create({
            data: {
                name: op.name,
                accountId,
                ownerId: op.owner,
                stage: op.stage,
                value: op.value,
                probability: op.probability,
                expectedCloseDate: (0, date_fns_1.addDays)(new Date(), 60 + Math.floor(Math.random() * 120)),
                lastStageChange: (0, date_fns_1.subDays)(new Date(), op.daysAgo),
                products: { create: op.products.map(p => ({ product: p })) },
                stageHistory: { create: { toStage: op.stage } }
            }
        });
        createdOpportunities.push(created.id);
    }
    // Ops cerradas para win rate (distribuidas por RC)
    const wonLost = [
        { name: 'BBVA - Procesamiento Q1', accountName: 'BBVA México S.A.', stage: 'CERRADO_GANADO', value: 8000000, owner: sergio.id },
        { name: 'Walmart - Onboarding 2024', accountName: 'Walmart de México S.A.B. de C.V.', stage: 'CERRADO_GANADO', value: 5500000, owner: fernando.id },
        { name: 'Telcel - Seguridad 2024', accountName: 'Telcel S.A. de C.V.', stage: 'CERRADO_GANADO', value: 7200000, owner: sergio.id },
        { name: 'AT&T - Procesamiento Pagos', accountName: 'AT&T México S.A.', stage: 'CERRADO_PERDIDO', value: 6000000, owner: javier.id },
        { name: 'Banco Azteca - Onboarding', accountName: 'Banco Azteca S.A.', stage: 'CERRADO_PERDIDO', value: 3500000, owner: fernando.id },
        { name: 'Liverpool - Procesamiento Q4', accountName: 'El Puerto de Liverpool S.A.B.', stage: 'CERRADO_GANADO', value: 4200000, owner: javier.id },
    ];
    for (const op of wonLost) {
        const accountId = createdAccounts[op.accountName];
        if (!accountId)
            continue;
        await prisma.opportunity.create({
            data: {
                name: op.name,
                accountId,
                ownerId: op.owner,
                stage: op.stage,
                value: op.value,
                probability: op.stage === 'CERRADO_GANADO' ? 100 : 0,
                actualCloseDate: (0, date_fns_1.subDays)(new Date(), Math.floor(Math.random() * 180)),
                lastStageChange: (0, date_fns_1.subDays)(new Date(), Math.floor(Math.random() * 60)),
                products: { create: [{ product: 'PROCESAMIENTO_PAGOS' }] },
                stageHistory: { create: { toStage: op.stage } }
            }
        });
    }
    // Leads
    const leadsData = [
        { companyName: 'Fincomún S.A.P.I.', contactName: 'Miguel Ángel Torres', email: 'm.torres@fincomun.mx', source: 'REFERIDO', bantBudget: 'SI', bantAuthority: 'SI', bantNeed: 'ALTA', bantTimeline: 'MENOS_3M', industry: 'FINTECH' },
        { companyName: 'Credijusto S.A.P.I.', contactName: 'Lorena Medina', email: 'l.medina@credijusto.mx', source: 'WEB', bantBudget: 'DESCONOCIDO', bantAuthority: 'INFLUENCIADOR', bantNeed: 'MEDIA', bantTimeline: 'TRES_A_6M', industry: 'FINTECH' },
        { companyName: 'Grupo Axtel S.A.B.', contactName: 'Carlos Reyes', email: 'c.reyes@axtel.mx', source: 'EVENTO', bantBudget: 'NO', bantAuthority: 'USUARIO', bantNeed: 'BAJA', bantTimeline: 'MAS_12M', industry: 'TELCO' },
        { companyName: 'Totalplay Telecomunicaciones', contactName: 'Ana Belén Ortiz', email: 'a.ortiz@totalplay.com.mx', source: 'OUTBOUND', bantBudget: 'SI', bantAuthority: 'SI', bantNeed: 'ALTA', bantTimeline: 'TRES_A_6M', industry: 'TELCO' },
        { companyName: 'Flink S.A.P.I.', contactName: 'Eduardo Campos', email: 'e.campos@flink.mx', source: 'WEB', bantBudget: 'DESCONOCIDO', bantAuthority: 'SI', bantNeed: 'MEDIA', bantTimeline: 'SEIS_A_12M', industry: 'FINTECH' },
        { companyName: 'Conekta S.A. de C.V.', contactName: 'Isabella Ruiz', email: 'i.ruiz@conekta.com', source: 'PARTNER', bantBudget: 'SI', bantAuthority: 'INFLUENCIADOR', bantNeed: 'ALTA', bantTimeline: 'MENOS_3M', industry: 'FINTECH' },
        { companyName: 'Tiendanube México', contactName: 'Rodrigo Flores', email: 'r.flores@tiendanube.com', source: 'EVENTO', bantBudget: 'NO', bantAuthority: 'USUARIO', bantNeed: 'BAJA', bantTimeline: 'MAS_12M', industry: 'RETAIL' },
        { companyName: 'Afirme Grupo Financiero', contactName: 'Paola Mendoza', email: 'p.mendoza@afirme.com', source: 'REFERIDO', bantBudget: 'SI', bantAuthority: 'SI', bantNeed: 'ALTA', bantTimeline: 'MENOS_3M', industry: 'BANCA' },
        { companyName: 'Izzi Telecom S.A.', contactName: 'Ricardo Salinas', email: 'r.salinas@izzi.mx', source: 'OUTBOUND', bantBudget: 'DESCONOCIDO', bantAuthority: 'INFLUENCIADOR', bantNeed: 'MEDIA', bantTimeline: 'SEIS_A_12M', industry: 'TELCO' },
        { companyName: 'Finterra S.A.P.I.', contactName: 'Valentina Castro', email: 'v.castro@finterra.mx', source: 'WEB', bantBudget: 'NO', bantAuthority: 'USUARIO', bantNeed: 'BAJA', bantTimeline: 'MAS_12M', industry: 'FINTECH' },
    ];
    const leadOwners = [sergio.id, sergio.id, sergio.id, fernando.id, fernando.id, fernando.id, javier.id, javier.id, javier.id, user.id];
    for (let i = 0; i < leadsData.length; i++) {
        const l = leadsData[i];
        const score = calculateScore(l.bantBudget, l.bantAuthority, l.bantNeed, l.bantTimeline);
        await prisma.lead.create({ data: { ...l, score, ownerId: leadOwners[i] } });
    }
    // Actividades (últimos 90 días, distribuidas entre RCs)
    const activityTypes = ['LLAMADA', 'EMAIL', 'REUNION', 'DEMO', 'PROPUESTA_ENVIADA', 'NOTA'];
    const accountIds = Object.values(createdAccounts).slice(0, 9);
    const activityOwners = [sergio.id, fernando.id, javier.id, user.id];
    for (let i = 0; i < 60; i++) {
        const daysAgo = Math.floor(Math.random() * 90);
        await prisma.activity.create({
            data: {
                userId: activityOwners[i % activityOwners.length],
                accountId: accountIds[i % accountIds.length],
                opportunityId: createdOpportunities[i % createdOpportunities.length] || undefined,
                type: activityTypes[i % activityTypes.length],
                title: getActivityTitle(activityTypes[i % activityTypes.length]),
                description: 'Seguimiento de oportunidad con cliente.',
                completedAt: (0, date_fns_1.subDays)(new Date(), daysAgo),
                createdAt: (0, date_fns_1.subDays)(new Date(), daysAgo)
            }
        });
    }
    console.log('Seed completado exitosamente!');
    console.log('  comercial@moneta.com.mx / moneta2024 (Admin)');
    console.log('  sergio.vega@moneta.com.mx / moneta2024 (Recurso Comercial)');
    console.log('  fernando.martinez@moneta.com.mx / moneta2024 (Recurso Comercial)');
    console.log('  javier.gonzalez@moneta.com.mx / moneta2024 (Recurso Comercial)');
}
function calculateScore(budget, authority, need, timeline) {
    let score = 0;
    if (budget === 'SI')
        score += 30;
    else if (budget === 'DESCONOCIDO')
        score += 10;
    if (authority === 'SI')
        score += 25;
    else if (authority === 'INFLUENCIADOR')
        score += 15;
    if (need === 'ALTA')
        score += 30;
    else if (need === 'MEDIA')
        score += 15;
    if (timeline === 'MENOS_3M')
        score += 15;
    else if (timeline === 'TRES_A_6M')
        score += 10;
    else if (timeline === 'SEIS_A_12M')
        score += 5;
    return score;
}
function getActivityTitle(type) {
    const titles = {
        LLAMADA: 'Llamada de seguimiento',
        EMAIL: 'Email de propuesta enviado',
        REUNION: 'Reunión con equipo directivo',
        DEMO: 'Demo de plataforma',
        PROPUESTA_ENVIADA: 'Propuesta comercial enviada',
        NOTA: 'Nota interna de seguimiento',
        CONTRATO_ENVIADO: 'Contrato enviado para revisión'
    };
    return titles[type] || 'Actividad registrada';
}
main().catch(console.error).finally(() => prisma.$disconnect());
//# sourceMappingURL=seed.js.map