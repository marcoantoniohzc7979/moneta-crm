import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.use(authenticate);

function calculateLeadScore(bantBudget: string, bantAuthority: string, bantNeed: string, bantTimeline: string): number {
  let score = 0;
  if (bantBudget === 'SI') score += 30;
  else if (bantBudget === 'DESCONOCIDO') score += 10;

  if (bantAuthority === 'SI') score += 25;
  else if (bantAuthority === 'INFLUENCIADOR') score += 15;

  if (bantNeed === 'ALTA') score += 30;
  else if (bantNeed === 'MEDIA') score += 15;

  if (bantTimeline === 'MENOS_3M') score += 15;
  else if (bantTimeline === 'TRES_A_6M') score += 10;
  else if (bantTimeline === 'SEIS_A_12M') score += 5;

  return score;
}

router.get('/', async (req: AuthRequest, res: Response) => {
  const { converted, ownerId, source } = req.query as Record<string, string>;
  const where: Record<string, unknown> = {};
  if (converted !== undefined) where.converted = converted === 'true';
  if (ownerId) where.ownerId = ownerId;
  if (source) where.source = source;

  const leads = await prisma.lead.findMany({
    where,
    include: { owner: { select: { id: true, name: true } } },
    orderBy: { score: 'desc' }
  });
  res.json(leads);
});

router.get('/:id', async (req: AuthRequest, res: Response) => {
  const lead = await prisma.lead.findUnique({
    where: { id: req.params.id },
    include: { owner: { select: { id: true, name: true } } }
  });
  if (!lead) return res.status(404).json({ error: 'Lead no encontrado' });
  res.json(lead);
});

router.post('/', async (req: AuthRequest, res: Response) => {
  const { bantBudget = 'DESCONOCIDO', bantAuthority = 'USUARIO', bantNeed = 'BAJA', bantTimeline = 'MAS_12M', ...data } = req.body;
  const score = calculateLeadScore(bantBudget, bantAuthority, bantNeed, bantTimeline);

  const lead = await prisma.lead.create({
    data: { ...data, bantBudget, bantAuthority, bantNeed, bantTimeline, score, ownerId: req.user!.id },
    include: { owner: { select: { id: true, name: true } } }
  });
  res.status(201).json(lead);
});

router.put('/:id', async (req: AuthRequest, res: Response) => {
  const { owner, ...data } = req.body;
  const { bantBudget, bantAuthority, bantNeed, bantTimeline } = data;
  if (bantBudget || bantAuthority || bantNeed || bantTimeline) {
    const existing = await prisma.lead.findUnique({ where: { id: req.params.id } });
    if (existing) {
      data.score = calculateLeadScore(
        bantBudget || existing.bantBudget,
        bantAuthority || existing.bantAuthority,
        bantNeed || existing.bantNeed,
        bantTimeline || existing.bantTimeline
      );
    }
  }
  const lead = await prisma.lead.update({
    where: { id: req.params.id },
    data,
    include: { owner: { select: { id: true, name: true } } }
  });
  res.json(lead);
});

router.post('/:id/convert', async (req: AuthRequest, res: Response) => {
  const lead = await prisma.lead.findUnique({ where: { id: req.params.id } });
  if (!lead) return res.status(404).json({ error: 'Lead no encontrado' });
  if (lead.converted) return res.status(400).json({ error: 'Lead ya convertido' });

  const account = await prisma.account.create({
    data: {
      razonSocial: lead.companyName,
      industry: lead.industry || 'OTRO',
      size: 'MID_MARKET',
      status: 'PROSPECTO_CALIFICADO'
    }
  });

  await prisma.contact.create({
    data: {
      accountId: account.id,
      firstName: lead.contactName.split(' ')[0] || lead.contactName,
      lastName: lead.contactName.split(' ').slice(1).join(' ') || '',
      email: lead.email,
      phone: lead.phone,
      role: 'DECISION_MAKER'
    }
  });

  const updatedLead = await prisma.lead.update({
    where: { id: req.params.id },
    data: { converted: true, convertedAt: new Date(), accountId: account.id }
  });

  res.json({ lead: updatedLead, account });
});

router.delete('/:id', async (_req: AuthRequest, res: Response) => {
  await prisma.lead.delete({ where: { id: _req.params.id } });
  res.status(204).send();
});

export default router;
