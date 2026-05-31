import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { supabase } from '../services/supabase.js';
import { sendAccessRequestEmail } from '../services/email.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  const schema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().optional(),
    password: z.string().min(6),
    requestedRole: z.enum(['admin', 'rotulador'])
  });
  const body = schema.parse(req.body);
  const email = body.email.toLowerCase();
  const { data: existing } = await supabase.from('users').select('id').eq('email', email).maybeSingle();
  if (existing) return res.status(409).json({ error: 'Ese correo ya existe' });

  const password_hash = await bcrypt.hash(body.password, 12);
  const { data: user, error } = await supabase.from('users').insert({
    name: body.name,
    email,
    phone: body.phone || null,
    password_hash,
    requested_role: body.requestedRole,
    role: null,
    status: 'pending'
  }).select('*').single();
  if (error) return res.status(400).json({ error: error.message });

  await sendAccessRequestEmail(user);
  res.json({ ok: true, message: 'Solicitud enviada. Espera aprobación del administrador.' });
});

router.post('/login', async (req, res) => {
  const schema = z.object({ email: z.string().email(), password: z.string().min(1) });
  const body = schema.parse(req.body);
  const { data: user } = await supabase.from('users').select('*').eq('email', body.email.toLowerCase()).maybeSingle();
  if (!user) return res.status(401).json({ error: 'Credenciales inválidas' });
  if (user.status !== 'approved') return res.status(403).json({ error: 'Usuario pendiente de aprobación' });
  const ok = await bcrypt.compare(body.password, user.password_hash);
  if (!ok) return res.status(401).json({ error: 'Credenciales inválidas' });

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '8h' });
  const { password_hash, ...safeUser } = user;
  res.json({ token, user: safeUser });
});

router.get('/me', requireAuth, (req, res) => {
  const { password_hash, ...safeUser } = req.user;
  res.json({ user: safeUser });
});

export default router;
