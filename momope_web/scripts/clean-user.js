
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

async function cleanUser(mobile) {
    console.log(`🧹 Cleaning up user data for mobile: ${mobile}`);

    // 1. Check Public User
    const { data: users, error: findError } = await supabase
        .from('users')
        .select('*')
        .eq('mobile', mobile);

    if (findError) {
        console.error('Error finding user:', findError);
        return;
    }

    if (!users || users.length === 0) {
        console.log('No public user found with this mobile.');
        // Still need to cleanup Auth User just in case
    } else {
        const user = users[0];
        console.log(`Found Public User: ${user.id}`);

        // 2. Delete Wallet (momo_coins)
        const { error: walletError } = await supabase
            .from('momo_coins')
            .delete()
            .eq('customer_id', user.id);

        if (walletError) console.error('Error deleting wallet:', walletError);
        else console.log('✅ Wallet deleted.');

        // 3. Delete from Customers Table (if exists)
        const { error: custError } = await supabase
            .from('customers')
            .delete()
            .eq('id', user.id);

        if (custError) console.error('Error deleting customer record:', custError);
        else console.log('✅ Customer record deleted.');

        // 4. Delete Public User
        const { error: delUserError } = await supabase
            .from('users')
            .delete()
            .eq('id', user.id);

        if (delUserError) console.error('Error deleting public user:', delUserError);
        else console.log('✅ Public user deleted.');
    }

    // 5. Delete from Auth Users (by Phone)
    // Note: admin.deleteUser requires ID. We need to find the Auth User ID first.
    // We can list users or if we deleted public user, we might have lost the link if IDs were synced.
    // But usually Auth ID == Public ID.

    // Let's try to find Auth User ID by phone metadata? Or just assume ID matches if we found one.
    // If we didn't find public user, we can't easily loose delete auth user unless we search.
    // Admin listUsers? 

    // Safer approach: If we had a public user, use that ID.
    // If not, we might leave a ghost auth user.
    // Let's try to query auth users just in case.

    // Note: supabase-js admin client doesn't explicitly support "getUserByPhone".
    // We'll rely on the ID we found. If no public user, we might be stuck manually.

    if (users && users.length > 0) {
        const user = users[0];
        console.log(`Attempting to delete Auth User: ${user.id}`);
        const { error: authDelError } = await supabase.auth.admin.deleteUser(user.id);

        if (authDelError) console.log('Auth user delete warning (maybe already gone):', authDelError.message);
        else console.log('✅ Auth user deleted.');
    } else {
        console.log('⚠️ Could not find public ID to delete Auth User. Use Supabase Dashboard if Auth User persists.');
    }
}

cleanUser('8888888888');
