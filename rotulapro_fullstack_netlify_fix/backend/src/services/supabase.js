import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServerKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || '';

if (!supabaseUrl || !supabaseServerKey) {
  console.warn('Faltan variables de Supabase. Revisa backend/.env. Necesitas SUPABASE_URL y SUPABASE_SECRET_KEY o SUPABASE_SERVICE_ROLE_KEY.');
}

export const supabase = createClient(
  supabaseUrl,
  supabaseServerKey,
  { auth: { persistSession: false, autoRefreshToken: false } }
);
