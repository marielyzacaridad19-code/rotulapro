import jwt from 'jsonwebtoken';
import { supabase } from '../services/supabase.js';

export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'No autenticado' });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const { data: user, error } = await supabase.from('users').select('*').eq('id', payload.id).single();
    if (error || !user || user.status !== 'approved') return res.status(401).json({ error: 'Usuario no aprobado' });
    req.user = user;
    next();
  } catch {
    res.status(401).json({ error: 'Sesión inválida' });
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) return res.status(403).json({ error: 'No tienes permiso' });
    next();
  };
}

export function isAdmin(user) {
  return ['superadmin', 'admin'].includes(user?.role);
}
