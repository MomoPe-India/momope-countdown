'use server';

import { supabase } from '@/lib/supabaseClient';

export async function getMerchantsList() {
    try {
        // Query 'users' table directly where role is MERCHANT
        const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('role', 'MERCHANT')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('getMerchantsList Error:', error);
            return [];
        }

        return data.map((u: any) => ({
            id: u.id,
            mobile: u.mobile || 'N/A',
            joined: u.created_at,
            business_name: u.business_name || 'N/A',
            // Default status logic based on data availability
            status: u.business_name ? 'Active' : 'Onboarding',
            commission: u.commission_rate || 0, // Assuming this column might exist or defaults to 0
            kyc_status: u.kyc_status || 'PENDING'
        }));

    } catch (error) {
        console.error('Server Action Error:', error);
        return [];
    }
}
