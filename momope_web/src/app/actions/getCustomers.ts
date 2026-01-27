'use server'

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function getCustomers() {
    try {
        // Fetch users with role 'CUSTOMER' directly from 'users' table
        const { data: users, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('role', 'CUSTOMER')
            .order('created_at', { ascending: false });

        if (userError) {
            console.error('Fetch Users Failed:', userError);
            return [];
        }

        if (!users || users.length === 0) return [];

        // Fetch Coins for these users
        const userIds = users.map(u => u.id);
        const { data: coinsData, error: coinsError } = await supabase
            .from('momo_coins')
            .select('customer_id, balance_available')
            .in('customer_id', userIds);

        if (coinsError) console.warn('Fetch Coins Failed:', coinsError);

        // Map coins for quick lookup
        const coinMap = new Map();
        if (coinsData) {
            coinsData.forEach((c: any) => {
                coinMap.set(c.customer_id, c.balance_available);
            });
        }

        console.log(`[GET_CUSTOMERS] Found ${users.length} users.`);

        // Map to expected format
        return users.map((u: any) => ({
            id: u.id,
            mobile: u.mobile,
            full_name: u.full_name || 'N/A',
            email: u.email || 'N/A',
            coins: coinMap.get(u.id) || 0,
            joined_at: new Date(u.created_at).toLocaleDateString()
        }));

    } catch (e) {
        console.error(e);
        return [];
    }
}
