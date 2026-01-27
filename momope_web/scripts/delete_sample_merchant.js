
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://isvpvncghckqhioljotp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzdnB2bmNnaGNrcWhpb2xqb3RwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODQ5MTAzNSwiZXhwIjoyMDg0MDY3MDM1fQ.OaY3tUvCTT9N13mtR5bbjO6_1lXy8pEJ-e2LWd2GFRA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function deleteSampleMerchant() {
    // 1. Inspect Schema (Fetch one user)
    const { data: sample, error: sampleError } = await supabase
        .from('users')
        .select('*')
        .limit(1);

    if (sample && sample.length > 0) {
        console.log('Sample User Keys:', Object.keys(sample[0]));
    }

    // 2. Try Deleting with likely 'id' column if user_id failed
    const targetMobile = '9999999999';
    const targetMobileWithCode = '+919999999999';

    console.log(`Searching for users with mobile '${targetMobile}'...`);

    // Fetch specifically to get the ID
    const { data: users, error: findError } = await supabase
        .from('users')
        .select('*') // Get all cols to find ID
        .or(`mobile.eq.${targetMobile},mobile.eq.${targetMobileWithCode}`);

    if (users && users.length > 0) {
        users.forEach(async (u) => {
            // Assume 'id' or 'user_id' or 'uuid'
            const idToDelete = u.id || u.user_id || u.uuid;
            console.log(`Deleting user with ID: ${idToDelete} (Mobile: ${u.mobile})`);

            const { error: deleteError } = await supabase
                .from('users')
                .delete()
                .eq('id', idToDelete); // Try 'id' first as standard

            if (deleteError) {
                console.error('Delete Error:', deleteError);
                // Fallback if column name was actually something else, but Object.keys above will tell us.
            } else {
                console.log('✅ Deleted.');
            }
        });
    } else {
        console.log('No sample user found (maybe already deleted?).');
    }
}

deleteSampleMerchant();
