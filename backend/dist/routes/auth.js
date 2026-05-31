"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ error: 'Email y contraseña requeridos' });
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.active)
        return res.status(401).json({ error: 'Credenciales inválidas' });
    const valid = await bcryptjs_1.default.compare(password, user.password);
    if (!valid)
        return res.status(401).json({ error: 'Credenciales inválidas' });
    const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role, avatar: user.avatar } });
});
router.get('/me', auth_1.authenticate, async (req, res) => {
    const user = await prisma.user.findUnique({
        where: { id: req.user.id },
        select: { id: true, email: true, name: true, role: true, avatar: true }
    });
    res.json(user);
});
exports.default = router;
//# sourceMappingURL=auth.js.map