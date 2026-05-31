import express from 'express';
import { supabase } from '../services/supabase.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  const { data: settings } = await supabase.from('settings').select('*').eq('id', 1).single();
  const { data: materials } = await supabase.from('materials').select('*').order('name');
  res.json({ settings, materials });
});

router.put('/', requireAuth, requireRole('superadmin','admin'), async (req, res) => {
  const payload = {
    euro_bcv_rate: req.body.euro_bcv_rate,
    default_margin: req.body.default_margin,
    waste_margin_cm: req.body.waste_margin_cm,
    design_base_cost: req.body.design_base_cost,
    install_base_cost: req.body.install_base_cost,
    minimum_sale: req.body.minimum_sale,
    updated_at: new Date().toISOString()
  };
  Object.keys(payload).forEach(k => payload[k] === undefined && delete payload[k]);
  const { data, error } = await supabase.from('settings').update(payload).eq('id', 1).select('*').single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});

router.put('/materials/:id', requireAuth, requireRole('superadmin','admin'), async (req, res) => {
  const { data, error } = await supabase.from('materials').update({
    cost_per_m2: Number(req.body.cost_per_m2),
    sale_per_m2: Number(req.body.sale_per_m2),
    updated_at: new Date().toISOString()
  }).eq('id', req.params.id).select('*').single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
});
export default router;
