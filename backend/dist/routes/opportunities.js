"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
router.use(auth_1.authenticate);
router.get('/', async (req, res) => {
    const { stage, product, ownerId, accountId, search } = req.query;
    const where = {};
    if (stage)
        where.stage = stage;
    if (ownerId)
        where.ownerId = ownerId;
    if (accountId)
        where.accountId = accountId;
    if (product)
        where.products = { some: { product } };
    if (search)
        where.name = { contains: search, mode: 'insensitive' };
    const opportunities = await prisma.opportunity.findMany({
        where,
        include: {
            account: { select: { id: true, razonSocial: true, industry: true } },
            owner: { select: { id: true, name: true } },
            products: true,
            _count: { select: { activities: true } }
        },
        orderBy: { value: 'desc' }
    });
    // Calculate days in stage for each opportunity
    const now = new Date();
    const enriched = opportunities.map(op => ({
        ...op,
        daysInStage: Math.floor((now.getTime() - new Date(op.lastStageChange).getTime()) / (1000 * 60 * 60 * 24))
    }));
    res.json(enriched);
});
router.get('/:id', async (req, res) => {
    const opportunity = await prisma.opportunity.findUnique({
        where: { id: req.params.id },
        include: {
            account: true,
            owner: { select: { id: true, name: true } },
            products: true,
            activities: {
                include: { user: { select: { id: true, name: true } }, contact: { select: { id: true, firstName: true, lastName: true } } },
                orderBy: { createdAt: 'desc' }
            },
            stakeholders: { include: { contact: true } },
            stageHistory: { orderBy: { changedAt: 'desc' } }
        }
    });
    if (!opportunity)
        return res.status(404).json({ error: 'Oportunidad no encontrada' });
    res.json(opportunity);
});
router.post('/', async (req, res) => {
    const { products, stakeholders, ...data } = req.body;
    const opportunity = await prisma.opportunity.create({
        data: {
            ...data,
            products: products ? { create: products } : undefined,
            stageHistory: { create: { toStage: data.stage || 'PROSPECCION' } }
        },
        include: { products: true, owner: { select: { id: true, name: true } } }
    });
    res.status(201).json(opportunity);
});
router.put('/:id', async (req, res) => {
    const { products, stakeholders, activities, account, owner, stageHistory, _count, ...data } = req.body;
    const existing = await prisma.opportunity.findUnique({ where: { id: req.params.id } });
    if (!existing)
        return res.status(404).json({ error: 'Oportunidad no encontrada' });
    const stageChanged = data.stage && data.stage !== existing.stage;
    const now = new Date();
    const daysInPrev = stageChanged
        ? Math.floor((now.getTime() - new Date(existing.lastStageChange).getTime()) / (1000 * 60 * 60 * 24))
        : undefined;
    const opportunity = await prisma.opportunity.update({
        where: { id: req.params.id },
        data: {
            ...data,
            ...(stageChanged && { lastStageChange: now }),
            stageHistory: stageChanged ? {
                create: { fromStage: existing.stage, toStage: data.stage, daysInPrevStage: daysInPrev, reason: data.stageChangeReason }
            } : undefined,
            ...(products && { products: { deleteMany: {}, create: products } })
        },
        include: { products: true, owner: { select: { id: true, name: true } } }
    });
    res.json(opportunity);
});
router.delete('/:id', async (_req, res) => {
    await prisma.opportunity.delete({ where: { id: _req.params.id } });
    res.status(204).send();
});
exports.default = router;
//# sourceMappingURL=opportunities.js.map