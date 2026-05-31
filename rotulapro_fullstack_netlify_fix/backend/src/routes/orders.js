import express from 'express';
import { supabase } from '../services/supabase.js';
import { requireAuth, isAdmin } from '../middleware/auth.js';
const router = express.Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  const { data, error } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
  if (error) return res.status(400).json({ error: error.message });
  const safe = isAdmin(req.user) ? data : data.map(o => ({ ...o, internal_cost: undefined, profit: undefined }));
  res.json(safe);
});

router.patch('/:id/status', async (req, res) => {
  const { data, error } = await supabase.from('orders').update({ status: req.body.status, updated_at: new Date().toISOString() }).eq('id', req.params.id).select('*').single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});
export default router;
