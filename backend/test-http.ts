import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

console.log('Testing HTTP Connection via Supabase API...');
console.log('URL:', supabaseUrl);

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testHttp() {
    try {
        // Try a simple select from standard table, or just check health
        // We will try to SELECT version() equivalent, or just count users
        // Since we don't know if users has rows, we'll look for *any* response.

        // Actually, let's just try to select from 'users' table (even if empty, it shouldn't error on connection)
        const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true });

        if (error) {
            console.error('API Error:', error.message);
            // If error is "relation does not exist", it means we connected but table check failed (Good!)
            // If error is "FetchError" or network, then it failed (Bad).
        } else {
            console.log('✅ SUCCESS! Connected via HTTP/HTTPS.');
            console.log('User Count:', data); // might be null but successful
        }
    } catch (e: any) {
        console.error('Unexpected Error:', e.message);
    }
}

testHttp();
