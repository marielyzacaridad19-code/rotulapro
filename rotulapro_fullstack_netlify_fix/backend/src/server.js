import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import quoteRoutes from './routes/quotes.js';
import orderRoutes from './routes/orders.js';
import settingsRoutes from './routes/settings.js';
import aiRoutes from './routes/ai.js';
import rateRoutes from './routes/rates.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendPath = path.join(__dirname, '../../frontend');

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/rates', rateRoutes);

app.use(express.static(frontendPath));
app.get('*', (req, res) => res.sendFile(path.join(frontendPath, 'index.html')));

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`RotulaPro funcionando en http://localhost:${port}`));
