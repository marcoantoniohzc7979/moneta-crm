import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';
import { startOfMonth, endOfMonth, subDays } from 'date-fns';

const router = Router();
const prisma = new PrismaClient();

router.use(authenticate);

router.get('/kpis', async (_req: AuthRequest, res: Response) => {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);

  const [
    allOpportunities,
    closedThisMonth,
    totalAccounts,
    recentActivities,
    staleOpportunities,
  ] = await Promise.all([
    prisma.opportunity.findMany({
      where: { stage: { notIn: ['CERRADO_GANADO', 'CERRADO_PERDIDO'] } },
      select: { value: true, probability: true, stage: true, products: true }
    }),
    prisma.opportunity.findMany({
      where: { stage: 'CERRADO_GANADO', actualCloseDate: { gte: monthStart, lte: monthEnd } },
      select: { value: true }
    }),
    prisma.account.groupBy({ by: ['status'], _count: true }),
    prisma.activity.findMany({
      where: { createdAt: { gte: subDays(now, 7) } },
      include: { user: { select: { id: true, name: true } }, account: { select: { id: true, razonSocial: true } } },
      orderBy: { createdAt: 'desc' },
      take: 10
    }),
    prisma.opportunity.findMany({
      where: { stage: { notIn: ['CERRADO_GANADO', 'CERRADO_PERDIDO'] }, lastStageChange: { lt: subDays(now, 14) } },
      include: { account: { select: { id: true, razonSocial: true } }, owner: { select: { id: true, name: true } } },
      take: 5
    })
  ]);

  const pipelineTotal = allOpportunities.reduce((s, o) => s + o.value, 0);
  const weightedPipeline = allOpportunities.reduce((s, o) => s + (o.value * o.probability / 100), 0);
  const closedTotal = closedThisMonth.reduce((s, o) => s + o.value, 0);

  const [wonCount, lostCount] = await Promise.all([
    prisma.opportunity.count({ where: { stage: 'CERRADO_GANADO' } }),
    prisma.opportunity.count({ where: { stage: 'CERRADO_PERDIDO' } })
  ]);
  const winRate = (wonCount + lostCount) > 0 ? Math.round((wonCount / (wonCount + lostCount)) * 100) : 0;

  const stageBreakdown = await prisma.opportunity.groupBy({
    by: ['stage'],
    where: { stage: { notIn: ['CERRADO_GANADO', 'CERRADO_PERDIDO'] } },
    _sum: { value: true },
    _count: true
  });

  const productBreakdown = await prisma.opportunityProduct.groupBy({
    by: ['product'],
    _sum: { value: true },
    _count: true
  });

  const topOpportunities = await prisma.opportunity.findMany({
    where: { stage: { notIn: ['CERRADO_GANADO', 'CERRADO_PERDIDO'] } },
    include: { account: { select: { id: true, razonSocial: true } }, owner: { select: { id: true, name: true } } },
    orderBy: { value: 'desc' },
    take: 5
  });

  res.json({
    pipelineTotal,
    weightedPipeline,
    closedThisMonth: closedTotal,
    winRate,
    accountsByStatus: totalAccounts,
    stageBreakdown,
    productBreakdown,
    recentActivities,
    staleOpportunities,
    topOpportunities
  });
});

router.get('/team', async (_req: AuthRequest, res: Response) => {
  const now = new Date();
  const rcs = await prisma.user.findMany({
    where: { active: true },
    select: { id: true, name: true, email: true, role: true }
  });

  const stats = await Promise.all(rcs.map(async rc => {
    const [activeOps, wonOps, lostOps, activities] = await Promise.all([
      prisma.opportunity.findMany({
        where: { ownerId: rc.id, stage: { notIn: ['CERRADO_GANADO', 'CERRADO_PERDIDO'] } },
        select: { value: true, probability: true, stage: true }
      }),
      prisma.opportunity.findMany({
        where: { ownerId: rc.id, stage: 'CERRADO_GANADO' },
        select: { value: true }
      }),
      prisma.opportunity.count({ where: { ownerId: rc.id, stage: 'CERRADO_PERDIDO' } }),
      prisma.activity.count({ where: { userId: rc.id, createdAt: { gte: subDays(now, 30) } } })
    ]);

    const pipeline = activeOps.reduce((s, o) => s + o.value, 0);
    const weighted = activeOps.reduce((s, o) => s + (o.value * o.probability / 100), 0);
    const closedValue = wonOps.reduce((s, o) => s + o.value, 0);
    const total = wonOps.length + lostOps;
    const winRate = total > 0 ? Math.round((wonOps.length / total) * 100) : 0;

    return {
      id: rc.id,
      name: rc.name,
      email: rc.email,
      role: rc.role,
      activeOps: activeOps.length,
      pipeline,
      weighted,
      closedWon: wonOps.length,
      closedValue,
      winRate,
      activitiesLast30: activities,
      byStage: activeOps.reduce((acc, o) => {
        acc[o.stage] = (acc[o.stage] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    };
  }));

  res.json(stats);
});

router.get('/forecast', async (_req: AuthRequest, res: Response) => {
  const months = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    const closed = await prisma.opportunity.aggregate({
      where: { stage: 'CERRADO_GANADO', actualCloseDate: { gte: start, lte: end } },
      _sum: { value: true }
    });
    months.push({ month: date.toISOString().slice(0, 7), revenue: closed._sum.value || 0 });
  }
  res.json(months);
});

export default router;
