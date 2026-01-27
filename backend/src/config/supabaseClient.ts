import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase URL or Key in .env');
}

// Ensure we use the Service Role Key for backend administrative privileges (bypassing RLS for storage uploads if needed)
export const supabase = createClient(supabaseUrl, supabaseKey);
