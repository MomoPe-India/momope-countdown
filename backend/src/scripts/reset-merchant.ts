import { supabase } from '../config/supabaseClient';

const resetMerchant = async () => {
    const mobile = '9999999999';
    console.log(`Deleting test merchant: ${mobile}...`);

    try {
        // 1. Get User ID
        const { data: users, error: findError } = await supabase
            .from('users')
            .select('id')
            .eq('mobile', mobile);

        if (findError) {
            console.error('Error finding user:', findError);
            return;
        }

        if (!users || users.length === 0) {
            console.log('User not found. Already clean?');
            return;
        }

        const userId = users[0].id;

        // 2. Delete from Merchants (Cascade might handle this, but being explicit)
        const { error: merchError } = await supabase
            .from('merchants')
            .delete()
            .eq('user_id', userId);

        if (merchError) console.error('Error deleting merchant profile:', merchError);

        // 3. Delete from Sessions
        const { error: sessError } = await supabase
            .from('sessions')
            .delete()
            .eq('user_id', userId);

        if (sessError) console.error('Error deleting sessions:', sessError);

        // 4. Delete User (Cascade should handle related tables)
        const { error: deleteError } = await supabase
            .from('users')
            .delete()
            .eq('id', userId);

        if (deleteError) {
            console.error('Error deleting user:', deleteError);
        } else {
            console.log(`Successfully deleted user ${mobile} and all related data.`);
        }

    } catch (e) {
        console.error('Unexpected error:', e);
    }
};

resetMerchant();
