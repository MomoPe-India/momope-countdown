const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
);

async function seedAdmin() {
    console.log("🌱 Seeding Admin User...");

    const email = 'admin@momope.com';
    const password = 'password123';

    // 1. Create User in Auth
    const { data: userData, error: createError } = await supabase.auth.admin.createUser({
        email: email,
        password: password,
        email_confirm: true,
        user_metadata: { full_name: 'Super Admin' }
    });

    if (createError) {
        console.log("⚠️ User might already exist:", createError.message);
        // If exists, find ID? We can just skip if we know the password.
    }

    // List to find ID just in case
    const { data: { users } } = await supabase.auth.admin.listUsers();
    const adminUser = users.find(u => u.email === email);

    if (adminUser) {
        console.log(`✅ Admin User Found: ${adminUser.id}`);

        // 2. Upsert into public.users with ADMIN role
        const { error: upsertError } = await supabase
            .from('users')
            .upsert({
                id: adminUser.id,
                email: email,
                mobile: '+910000000000', // Dummy mobile for Admin
                role: 'ADMIN',
                full_name: 'Super Admin',
                is_active: true
            });

        if (upsertError) console.error("❌ Failed to set ADMIN role:", upsertError);
        else console.log("✅ Successfully configured admin@momope.com as ADMIN.");
    }
}

seedAdmin();
