import express from 'express';
import { supabase } from '../services/supabase.js';
import { requireAuth, isAdmin } from '../middleware/auth.js';
const router = express.Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  const { data, error } = await supabase.from('quotes').select('*, quote_items(*)').order('created_at', { ascending: false });
  if (error) return res.status(400).json({ error: error.message });
  const safe = isAdmin(req.user) ? data : data.map(q => ({ ...q, internal_cost: undefined, profit: undefined }));
  res.json(safe);
});

router.post('/', async (req, res) => {
  const p = req.body;
  const { data: quote, error } = await supabase.from('quotes').insert({
    client_name: p.client_name,
    client_phone: p.client_phone,
    business_name: p.business_name || null,
    sale_type: p.sale_type,
    material_id: p.material_id,
    total_m2: p.total_m2,
    internal_cost: p.internal_cost,
    price_usd: p.price_usd,
    price_bs: p.price_bs,
    deposit_usd: p.deposit_usd || 0,
    balance_usd: p.balance_usd,
    profit: p.price_usd - p.internal_cost,
    status: p.status || 'Cotización creada',
    created_by: req.user.id
  }).select('*').single();
  if (error) return res.status(400).json({ error: error.message });
  const items = (p.items || []).map(item => ({ ...item, quote_id: quote.id }));
  if (items.length) await supabase.from('quote_items').insert(items);
  res.json(quote);
});

router.post('/:id/register-sale', async (req, res) => {
  const { data: quote, error: qError } = await supabase.from('quotes').update({ status: 'Venta registrada' }).eq('id', req.params.id).select('*').single();
  if (qError) return res.status(400).json({ error: qError.message });
  const { data: order, error } = await supabase.from('orders').insert({
    quote_id: quote.id,
    client_name: quote.client_name,
    client_phone: quote.client_phone,
    sale_type: quote.sale_type,
    total_m2: quote.total_m2,
    internal_cost: quote.internal_cost,
    price_usd: quote.price_usd,
    price_bs: quote.price_bs,
    deposit_usd: quote.deposit_usd,
    balance_usd: quote.balance_usd,
    status: quote.deposit_usd > 0 ? 'Anticipo recibido' : 'Venta registrada',
    created_by: req.user.id
  }).select('*').single();
  if (error) return res.status(400).json({ error: error.message });
  res.json(order);
});
export default router;
