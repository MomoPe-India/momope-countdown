
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);

async function confirmUser(email) {
    console.log(`📧 Confirming email for: ${email}`);

    // 1. Get User ID
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) {
        console.error("❌ Error listing users:", listError);
        return;
    }

    const user = users.find(u => u.email === email);

    if (!user) {
        console.error("❌ User not found!");
        return;
    }

    console.log(`✅ Found User ID: ${user.id}`);

    // 2. Update User to set email_confirmed_at
    const { data, error } = await supabase.auth.admin.updateUserById(
        user.id,
        { email_confirm: true }
    );

    if (error) {
        console.error("❌ Failed to confirm email:", error);
    } else {
        console.log("✅ Email confirmed successfully via Admin API!");
    }
}

confirmUser('sales@momope.com');
