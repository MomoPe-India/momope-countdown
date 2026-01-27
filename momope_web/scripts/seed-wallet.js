
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Load env from .env.local
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function addMoney() {
    console.log('Searching for users...');

    // List All Customers
    const { data: allUsers } = await supabase
        .from('users')
        .select('id, full_name, mobile')
        .eq('role', 'CUSTOMER');

    console.log('Available Customers:', allUsers);

    if (!allUsers || allUsers.length === 0) {
        console.error('No customers found.');
        return;
    }

    // Default to the first one found
    const user = allUsers[0];
    console.log(`Using User: ${user.full_name} (${user.mobile}) [ID: ${user.id}]`);

    // Update Wallet
    console.log(`Crediting wallet for ${user.id}...`);
    const { data, error } = await supabase
        .from('momo_coins')
        .upsert({
            customer_id: user.id,
            balance_available: 5000.00
        }, { onConflict: 'customer_id' })
        .select();

    if (error) {
        console.error('Wallet Update Error:', error);
    } else {
        console.log('✅ Wallet credited with ₹5000');
        console.log('New Balance:', data[0].balance_available);
    }
}

addMoney();
