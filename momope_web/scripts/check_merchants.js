
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://isvpvncghckqhioljotp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlzdnB2bmNnaGNrcWhpb2xqb3RwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODQ5MTAzNSwiZXhwIjoyMDg0MDY3MDM1fQ.OaY3tUvCTT9N13mtR5bbjO6_1lXy8pEJ-e2LWd2GFRA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkMerchants() {
    // Try fetching ANY user to see the role format
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .limit(5);

    if (error) {
        console.error('Error fetching users:', error);
        return;
    }

    console.log(`\n--- User Dump ---`);
    if (data && data.length > 0) {
        data.forEach((user, index) => {
            console.log(`${index + 1}. Role: "${user.role}" (Type: ${typeof user.role}), Name: ${user.business_name || user.full_name}`);
        });
    } else {
        console.log('No users found.');
    }
}

checkMerchants();
