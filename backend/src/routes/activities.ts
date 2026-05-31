import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.use(authenticate);

router.get('/', async (req: AuthRequest, res: Response) => {
  const { accountId, opportunityId, contactId, userId, type, limit = '50' } = req.query as Record<string, string>;
  const where: Record<string, unknown> = {};
  if (accountId) where.accountId = accountId;
  if (opportunityId) where.opportunityId = opportunityId;
  if (contactId) where.contactId = contactId;
  if (userId) where.userId = userId;
  if (type) where.type = type;

  const activities = await prisma.activity.findMany({
    where,
    include: {
      user: { select: { id: true, name: true } },
      account: { select: { id: true, razonSocial: true } },
      opportunity: { select: { id: true, name: true } },
      contact: { select: { id: true, firstName: true, lastName: true } }
    },
    orderBy: { createdAt: 'desc' },
    take: parseInt(limit)
  });
  res.json(activities);
});

router.post('/', async (req: AuthRequest, res: Response) => {
  const activity = await prisma.activity.create({
    data: { ...req.body, userId: req.user!.id },
    include: {
      user: { select: { id: true, name: true } },
      account: { select: { id: true, razonSocial: true } }
    }
  });
  res.status(201).json(activity);
});

router.put('/:id', async (req: AuthRequest, res: Response) => {
  const { user, account, opportunity, contact, ...data } = req.body;
  const activity = await prisma.activity.update({ where: { id: req.params.id }, data });
  res.json(activity);
});

router.delete('/:id', async (_req: AuthRequest, res: Response) => {
  await prisma.activity.delete({ where: { id: _req.params.id } });
  res.status(204).send();
});

export default router;
