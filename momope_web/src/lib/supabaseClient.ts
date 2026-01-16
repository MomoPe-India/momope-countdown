
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// WARNING: This client uses the Service Role Key. 
// It has FULL ACCESS and bypasses RLS. 
// NEVER import this in a Client Component ("use client").
export const supabase = createClient(supabaseUrl, supabaseKey);
