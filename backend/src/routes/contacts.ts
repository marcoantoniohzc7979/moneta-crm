import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.use(authenticate);

router.get('/', async (req: AuthRequest, res: Response) => {
  const { accountId, search } = req.query as Record<string, string>;
  const where: Record<string, unknown> = {};
  if (accountId) where.accountId = accountId;
  if (search) where.OR = [
    { firstName: { contains: search, mode: 'insensitive' } },
    { lastName: { contains: search, mode: 'insensitive' } },
    { email: { contains: search, mode: 'insensitive' } }
  ];

  const contacts = await prisma.contact.findMany({
    where,
    include: { account: { select: { id: true, razonSocial: true } } },
    orderBy: { lastName: 'asc' }
  });
  res.json(contacts);
});

router.get('/:id', async (_req: AuthRequest, res: Response) => {
  const contact = await prisma.contact.findUnique({
    where: { id: _req.params.id },
    include: {
      account: { select: { id: true, razonSocial: true } },
      activities: { include: { user: { select: { id: true, name: true } } }, orderBy: { createdAt: 'desc' }, take: 10 }
    }
  });
  if (!contact) return res.status(404).json({ error: 'Contacto no encontrado' });
  res.json(contact);
});

router.post('/', async (req: AuthRequest, res: Response) => {
  const contact = await prisma.contact.create({ data: req.body });
  res.status(201).json(contact);
});

router.put('/:id', async (req: AuthRequest, res: Response) => {
  const { account, activities, stakeholders, ...data } = req.body;
  const contact = await prisma.contact.update({ where: { id: req.params.id }, data });
  res.json(contact);
});

router.delete('/:id', async (_req: AuthRequest, res: Response) => {
  await prisma.contact.delete({ where: { id: _req.params.id } });
  res.status(204).send();
});

export default router;
