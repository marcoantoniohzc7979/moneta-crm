"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
router.use(auth_1.authenticate);
router.get('/', async (req, res) => {
    const { accountId, opportunityId, contactId, userId, type, limit = '50' } = req.query;
    const where = {};
    if (accountId)
        where.accountId = accountId;
    if (opportunityId)
        where.opportunityId = opportunityId;
    if (contactId)
        where.contactId = contactId;
    if (userId)
        where.userId = userId;
    if (type)
        where.type = type;
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
router.post('/', async (req, res) => {
    const activity = await prisma.activity.create({
        data: { ...req.body, userId: req.user.id },
        include: {
            user: { select: { id: true, name: true } },
            account: { select: { id: true, razonSocial: true } }
        }
    });
    res.status(201).json(activity);
});
router.put('/:id', async (req, res) => {
    const { user, account, opportunity, contact, ...data } = req.body;
    const activity = await prisma.activity.update({ where: { id: req.params.id }, data });
    res.json(activity);
});
router.delete('/:id', async (_req, res) => {
    await prisma.activity.delete({ where: { id: _req.params.id } });
    res.status(204).send();
});
exports.default = router;
//# sourceMappingURL=activities.js.map