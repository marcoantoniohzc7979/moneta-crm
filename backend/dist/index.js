"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_1 = __importDefault(require("./routes/auth"));
const accounts_1 = __importDefault(require("./routes/accounts"));
const contacts_1 = __importDefault(require("./routes/contacts"));
const opportunities_1 = __importDefault(require("./routes/opportunities"));
const leads_1 = __importDefault(require("./routes/leads"));
const activities_1 = __importDefault(require("./routes/activities"));
const dashboard_1 = __importDefault(require("./routes/dashboard"));
const users_1 = __importDefault(require("./routes/users"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
const allowedOrigins = process.env.FRONTEND_URL
    ? [process.env.FRONTEND_URL, 'http://localhost:5173']
    : ['http://localhost:5173'];
app.use((0, cors_1.default)({ origin: allowedOrigins, credentials: true }));
app.use(express_1.default.json());
app.use((0, morgan_1.default)('dev'));
app.use('/api/auth', auth_1.default);
app.use('/api/accounts', accounts_1.default);
app.use('/api/contacts', contacts_1.default);
app.use('/api/opportunities', opportunities_1.default);
app.use('/api/leads', leads_1.default);
app.use('/api/activities', activities_1.default);
app.use('/api/dashboard', dashboard_1.default);
app.use('/api/users', users_1.default);
app.get('/api/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date() }));
app.listen(PORT, () => {
    console.log(`Moneta CRM API running on http://localhost:${PORT}`);
});
exports.default = app;
//# sourceMappingURL=index.js.map