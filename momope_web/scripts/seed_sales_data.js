
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const { v4: uuidv4 } = require('uuid');

dotenv.config({ path: '.env.local' });

// Use SERVICE_ROLE_KEY to bypass RLS and create users
// Note: You must have SERVICE_ROLE_KEY in .env.local for this to work
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || 'PLACEHOLDER_KEY',
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);

async function seedSalesData() {
    console.log("🌱 Seeding Sales Data...");

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        console.error("❌ Error: SUPABASE_SERVICE_ROLE_KEY is missing in .env.local");
        return;
    }

    // 1. Create a Sales User
    const salesEmail = 'sales@momope.com';
    const salesPassword = 'password123';

    // Check if user exists first? (Naive check)
    // We'll just try to sign up/admin create
    const { data: user, error: createError } = await supabase.auth.admin.createUser({
        email: salesEmail,
        password: salesPassword,
        email_confirm: true,
        user_metadata: { full_name: 'Vikram Sales' }
    });

    if (createError) {
        console.log("⚠️ User creation notice (might exist):", createError.message);
    }

    if (user?.user) {
        const userId = user.user.id;
        console.log(`✅ Created Sales User: ${salesEmail} (${userId})`);

        // 2. Update Role to SALES
        const { error: roleError } = await supabase
            .from('users')
            .update({
                role: 'SALES',
                referral_code: 'VIKRAM01', // New column
                metadata: { region: 'South-Mumbai' }
            })
            .eq('id', userId);

        if (roleError) console.error("❌ Failed to update role:", roleError);
        else console.log("✅ Role updated to SALES");

        // 3. Create a Merchant linked to this Sales Agent
        const merchantId = uuidv4();
        // Need a user for the merchant first
        const { data: mUser } = await supabase.auth.admin.createUser({
            email: `shop_${Date.now()}@test.com`,
            password: 'password123',
            email_confirm: true
        });

        if (mUser?.user) {
            const mUserId = mUser.user.id;
            // Insert into merchants
            const { error: mError } = await supabase.from('merchants').insert({
                user_id: mUserId,
                business_name: "Vikram's Vada Pav",
                commission_rate: 2.0,
                onboarded_by: userId, // Attribution
                onboarding_lat: 19.0760,
                onboarding_long: 72.8777
            });

            if (mError) console.error("❌ Failed to create attributed merchant:", mError);
            else console.log("✅ Created merchant 'Vikram's Vada Pav' attributed to sales agent.");
        }
    }

    console.log("🌱 Seed Complete.");
}

seedSalesData();
