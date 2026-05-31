import express from 'express';
import { supabase } from '../services/supabase.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
const router = express.Router();
router.use(requireAuth, requireRole('superadmin','admin'));

router.get('/', async (req, res) => {
  const { data, error } = await supabase.from('users').select('id,name,email,phone,requested_role,role,status,created_at').order('created_at', { ascending: false });
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

router.patch('/:id/approve', async (req, res) => {
  const role = ['admin','rotulador'].includes(req.body.role) ? req.body.role : 'rotulador';
  const { data, error } = await supabase.from('users').update({ status: 'approved', role }).eq('id', req.params.id).select('id,name,email,role,status').single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

router.patch('/:id/reject', async (req, res) => {
  const { data, error } = await supabase.from('users').update({ status: 'rejected' }).eq('id', req.params.id).select('id,status').single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

export default router;
