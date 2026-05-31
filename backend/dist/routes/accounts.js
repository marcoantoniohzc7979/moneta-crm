"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
router.use(auth_1.authenticate);
router.get('/', async (req, res) => {
    const { status, industry, size, search, page = '1', limit = '20' } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const where = {};
    if (status)
        where.status = status;
    if (industry)
        where.industry = industry;
    if (size)
        where.size = size;
    if (search)
        where.razonSocial = { contains: search, mode: 'insensitive' };
    const [accounts, total] = await Promise.all([
        prisma.account.findMany({
            where,
            skip,
            take: parseInt(limit),
            include: {
                contacts: { take: 3, select: { id: true, firstName: true, lastName: true, role: true, jobTitle: true } },
                products: true,
                _count: { select: { opportunities: true, activities: true } }
            },
            orderBy: { updatedAt: 'desc' }
        }),
        prisma.account.count({ where })
    ]);
    res.json({ accounts, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) });
});
router.get('/:id', async (req, res) => {
    const account = await prisma.account.findUnique({
        where: { id: req.params.id },
        include: {
            contacts: true,
            products: true,
            opportunities: {
                include: { owner: { select: { id: true, name: true } }, products: true },
                orderBy: { updatedAt: 'desc' }
            },
            activities: {
                include: { user: { select: { id: true, name: true } } },
                orderBy: { createdAt: 'desc' },
                take: 20
            }
        }
    });
    if (!account)
        return res.status(404).json({ error: 'Cuenta no encontrada' });
    res.json(account);
});
router.post('/', async (req, res) => {
    const account = await prisma.account.create({ data: req.body, include: { products: true } });
    res.status(201).json(account);
});
router.put('/:id', async (req, res) => {
    const { products, contacts, opportunities, activities, _count, ...data } = req.body;
    const account = await prisma.account.update({ where: { id: req.params.id }, data, include: { products: true } });
    res.json(account);
});
router.delete('/:id', async (_req, res) => {
    await prisma.account.delete({ where: { id: _req.params.id } });
    res.status(204).send();
});
exports.default = router;
//# sourceMappingURL=accounts.js.map