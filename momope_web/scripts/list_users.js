const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
);

async function listUsers() {
    console.log("🔍 Listing Users...\n");

    // 1. Get Auth Users
    const { data: { users }, error } = await supabase.auth.admin.listUsers();
    if (error) {
        console.error("Error listing auth users:", error);
        return;
    }

    // 2. Get Public Profiles to match roles
    const { data: profiles } = await supabase.from('users').select('*');

    users.forEach(u => {
        const profile = profiles.find(p => p.id === u.id);
        const role = profile ? profile.role : 'UNKNOWN (No Profile)';
        console.log(`📧 Email: ${u.email}`);
        console.log(`   ID: ${u.id}`);
        console.log(`   Role: ${role}`);
        console.log('-----------------------------------');
    });
}

listUsers();
