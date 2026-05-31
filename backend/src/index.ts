import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';

import authRoutes from './routes/auth';
import accountRoutes from './routes/accounts';
import contactRoutes from './routes/contacts';
import opportunityRoutes from './routes/opportunities';
import leadRoutes from './routes/leads';
import activityRoutes from './routes/activities';
import dashboardRoutes from './routes/dashboard';
import userRoutes from './routes/users';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = process.env.FRONTEND_URL
  ? [process.env.FRONTEND_URL, 'http://localhost:5173']
  : ['http://localhost:5173'];
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/leads', leadRoutes);
app.use('/api/activities', activityRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users', userRoutes);

app.get('/api/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date() }));

app.listen(PORT, () => {
  console.log(`Moneta CRM API running on http://localhost:${PORT}`);
});

export default app;
