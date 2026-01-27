
import { supabase } from './src/config/supabaseClient';
import dotenv from 'dotenv';
dotenv.config();

async function checkLatestMerchant() {
    console.log('--- Verifying Latest Merchant ---');

    // Get latest user
    const { data: users, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'MERCHANT')
        .order('created_at', { ascending: false })
        .limit(1);

    if (userError || !users?.length) {
        console.log('No merchants found or error:', userError);
        return;
    }

    const user = users[0];
    console.log(`User ID: ${user.id}`);
    console.log(`Mobile: ${user.mobile}`);
    console.log(`PIN Set: ${!!user.pin_hash}`);

    // Get merchant profile
    const { data: profile, error: profileError } = await supabase
        .from('merchants')
        .select('*')
        .eq('user_id', user.id)
        .single();

    if (profileError) {
        console.log('Profile Error:', profileError.message);
    } else {
        console.log('Business Name:', profile.business_name);
        console.log('Onboarding:', profile.is_onboarding_complete ? 'COMPLETED' : 'PENDING');
        console.log('Status:', profile.status || 'ACTIVE');
    }
    console.log('---------------------------------');
}

checkLatestMerchant();
