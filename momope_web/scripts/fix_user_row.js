const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY, // Service Role needed to bypass RLS for Insert/Upsert
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);

async function fixUserRow() {
    console.log("🔧 Fixing Sales User Row...");

    // 1. Get the Sales User ID from Auth
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) {
        console.error("❌ Failed to list users:", listError);
        return;
    }

    const salesUser = users.find(u => u.email === 'sales@momope.com');

    if (!salesUser) {
        console.error("❌ Sales user not found in Auth. Please run seed_sales_data.js first.");
        return;
    }

    console.log(`found Sales User: ${salesUser.id}`);

    // 2. Upsert into public.users
    // We need to provide required fields. Schema says: mobile (unique), role.
    const { error: upsertError } = await supabase
        .from('users')
        .upsert({
            id: salesUser.id,
            email: salesUser.email,
            mobile: '+919999999999', // Dummy mobile for sales agent
            role: 'SALES',
            full_name: 'Vikram Sales',
            is_active: true
        });

    if (upsertError) {
        console.error("❌ Failed to upsert user row:", upsertError);
    } else {
        console.log("✅ Successfully inserted/updated Sales user row in public.users");
    }
}

fixUserRow();
