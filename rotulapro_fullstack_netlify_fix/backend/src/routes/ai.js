import express from 'express';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.js';
import { estimateVehicleParts } from '../services/openai.js';
const router = express.Router();

router.post('/estimate-vehicle', requireAuth, async (req, res) => {
  const schema = z.object({
    make: z.string().min(1),
    model: z.string().min(1),
    year: z.string().min(2),
    parts: z.array(z.string()).min(1),
    marginCm: z.number().default(10)
  });
  const body = schema.parse(req.body);
  try {
    const data = await estimateVehicleParts(body);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
export default router;
