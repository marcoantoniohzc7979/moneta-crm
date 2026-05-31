"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
router.use(auth_1.authenticate);
router.get('/', async (_req, res) => {
    const users = await prisma.user.findMany({
        select: { id: true, email: true, name: true, role: true, avatar: true, active: true },
        where: { active: true }
    });
    res.json(users);
});
router.post('/', (0, auth_1.authorize)('ADMIN', 'DIRECTOR_COMERCIAL'), async (req, res) => {
    const { email, password, name, role } = req.body;
    const hash = await bcryptjs_1.default.hash(password, 10);
    const user = await prisma.user.create({
        data: { email, password: hash, name, role },
        select: { id: true, email: true, name: true, role: true }
    });
    res.status(201).json(user);
});
router.put('/:id', async (req, res) => {
    const { password, ...data } = req.body;
    const updateData = data;
    if (password)
        updateData.password = await bcryptjs_1.default.hash(password, 10);
    const user = await prisma.user.update({
        where: { id: req.params.id },
        data: updateData,
        select: { id: true, email: true, name: true, role: true }
    });
    res.json(user);
});
exports.default = router;
//# sourceMappingURL=users.js.map