import express from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { fetchEuroBcvRate } from '../services/bcv.js';
import { supabase } from '../services/supabase.js';
const router = express.Router();

router.post('/bcv/euro/update', requireAuth, requireRole('superadmin','admin'), async (req, res) => {
  try {
    const result = await fetchEuroBcvRate();
    await supabase.from('exchange_rates').insert(result);
    const { data, error } = await supabase.from('settings').update({ euro_bcv_rate: result.rate, updated_at: new Date().toISOString() }).eq('id', 1).select('*').single();
    if (error) return res.status(400).json({ error: error.message });
    res.json({ rate: result, settings: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
export default router;
