import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

router.use(authenticate);

router.get('/', async (_req: AuthRequest, res: Response) => {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true, role: true, avatar: true, active: true },
    where: { active: true }
  });
  res.json(users);
});

router.post('/', authorize('ADMIN', 'DIRECTOR_COMERCIAL'), async (req: AuthRequest, res: Response) => {
  const { email, password, name, role } = req.body;
  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, password: hash, name, role },
    select: { id: true, email: true, name: true, role: true }
  });
  res.status(201).json(user);
});

router.put('/:id', async (req: AuthRequest, res: Response) => {
  const { password, ...data } = req.body;
  const updateData: Record<string, unknown> = data;
  if (password) updateData.password = await bcrypt.hash(password, 10);
  const user = await prisma.user.update({
    where: { id: req.params.id },
    data: updateData,
    select: { id: true, email: true, name: true, role: true }
  });
  res.json(user);
});

export default router;
