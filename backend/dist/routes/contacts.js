"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
router.use(auth_1.authenticate);
router.get('/', async (req, res) => {
    const { accountId, search } = req.query;
    const where = {};
    if (accountId)
        where.accountId = accountId;
    if (search)
        where.OR = [
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
router.get('/:id', async (_req, res) => {
    const contact = await prisma.contact.findUnique({
        where: { id: _req.params.id },
        include: {
            account: { select: { id: true, razonSocial: true } },
            activities: { include: { user: { select: { id: true, name: true } } }, orderBy: { createdAt: 'desc' }, take: 10 }
        }
    });
    if (!contact)
        return res.status(404).json({ error: 'Contacto no encontrado' });
    res.json(contact);
});
router.post('/', async (req, res) => {
    const contact = await prisma.contact.create({ data: req.body });
    res.status(201).json(contact);
});
router.put('/:id', async (req, res) => {
    const { account, activities, stakeholders, ...data } = req.body;
    const contact = await prisma.contact.update({ where: { id: req.params.id }, data });
    res.json(contact);
});
router.delete('/:id', async (_req, res) => {
    await prisma.contact.delete({ where: { id: _req.params.id } });
    res.status(204).send();
});
exports.default = router;
//# sourceMappingURL=contacts.js.map