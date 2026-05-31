import express from 'express';
import serverless from 'serverless-http';
import cors from 'cors';
import helmet from 'helmet';

import authRoutes from '../../backend/src/routes/auth.js';
import userRoutes from '../../backend/src/routes/users.js';
import quoteRoutes from '../../backend/src/routes/quotes.js';
import orderRoutes from '../../backend/src/routes/orders.js';
import settingsRoutes from '../../backend/src/routes/settings.js';
import aiRoutes from '../../backend/src/routes/ai.js';
import rateRoutes from '../../backend/src/routes/rates.js';

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '2mb' }));

const router = express.Router();
router.get('/health', (_req, res) => res.json({ ok: true, app: 'RotulaPro', runtime: 'Netlify Functions' }));
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/quotes', quoteRoutes);
router.use('/orders', orderRoutes);
router.use('/settings', settingsRoutes);
router.use('/ai', aiRoutes);
router.use('/rates', rateRoutes);

// Netlify puede entregar la función con diferentes prefijos según dev/prod.
// Montamos los mismos endpoints en tres bases para evitar errores de ruta.
app.use('/api', router);
app.use('/.netlify/functions/api', router);
app.use('/', router);

app.use((err, _req, res, _next) => {
  console.error(err);
  const status = err?.status || 500;
  res.status(status).json({ error: err?.message || 'Error interno de RotulaPro' });
});

export const handler = serverless(app);
