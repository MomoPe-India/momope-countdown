const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');

dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !ANON_KEY || !SERVICE_KEY) {
    console.error('❌ Missing environment variables. Check .env.local');
    process.exit(1);
}

async function verifyRLS() {
    console.log('🔒 Starting RLS Verification...\n');

    // 1. ANONYMOUS ACCESS (Should fail to list users)
    const anonClient = createClient(SUPABASE_URL, ANON_KEY);
    const { data: publicUsers, error: publicError } = await anonClient.from('users').select('*').limit(5);

    if (publicError) {
        console.log('✅ (1/4) Anonymous Access blocked (Error received).');
    } else if (publicUsers.length === 0) {
        console.log('✅ (1/4) Anonymous Access blocked (0 rows returned).');
    } else {
        console.error('❌ (1/4) SECURITY RISK: Anonymous user can see users!', publicUsers.length);
    }

    // 2. AUTHENTICATED ACCESS (Own Profile)
    // Log in as Sales User
    const { data: authData, error: authError } = await anonClient.auth.signInWithPassword({
        email: 'sales@momope.com',
        password: 'password123'
    });

    if (authError || !authData.user) {
        console.error('⚠️ Could not log in as sales user to test. Skipping auth tests.');
        return;
    }

    const myId = authData.user.id;
    const { data: myProfile } = await anonClient.from('users').select('*').eq('id', myId).single();

    if (myProfile && myProfile.id === myId) {
        console.log('✅ (2/4) Authenticated User can read their OWN profile.');
    } else {
        console.error('❌ (2/4) Authenticated User CANNOT read their own profile.');
    }

    // 3. UNAUTHORIZED ACCESS (Other Profile)
    // Try to read a different user's profile using the same authenticated client
    // We need a target ID. Let's use the Admin/Service client to find one that isn't us.
    const serviceClient = createClient(SUPABASE_URL, SERVICE_KEY);
    const { data: allUsers } = await serviceClient.from('users').select('id').neq('id', myId).limit(1);

    if (allUsers && allUsers.length > 0) {
        const otherId = allUsers[0].id;
        const { data: otherProfile } = await anonClient.from('users').select('*').eq('id', otherId);

        if (!otherProfile || otherProfile.length === 0) {
            console.log('✅ (3/4) Authenticated User cannot see OTHER users.');
        } else {
            console.error('❌ (3/4) SECURITY RISK: User can see other profiles!');
        }
    } else {
        console.log('⚠️ (3/4) Skipped: No other users found to test against.');
    }

    // 4. ADMIN ACCESS (Service Role Bypass)
    const { count } = await serviceClient.from('users').select('*', { count: 'exact', head: true });
    if (count > 0) {
        console.log(`✅ (4/4) Admin (Service Role) can still access all data (${count} users found).`);
    } else {
        console.error('❌ (4/4) Admin Client lost access?');
    }

    console.log('\n🏁 RLS Verification Complete.');
}

verifyRLS();
