'use server';

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function getSettlements() {
    try {
        // Fetch All Merchants who have a positive balance
        // We join momo_coins (wallet) -> user_id -> merchants (details)
        // Check filtering strategy: simpler to fetch all coins where customer_id is a merchant
        // But momo_coins doesn't know roles.
        // So: Fetch Merchants -> Join momo_coins

        const { data: merchants, error } = await supabase
            .from('users')
            .select(`
                id,
                mobile,
                merchants!inner (
                    business_name,
                    bank_account_number,
                    ifsc_code,
                    account_holder_name
                ),
                momo_coins (
                    balance_available
                )
            `)
            .eq('role', 'MERCHANT');

        if (error) {
            console.error('Fetch Settlements Error:', error);
            return [];
        }

        // Filter for > 0 balance
        const settleable = merchants.map((m: any) => {
            const wallet = Array.isArray(m.momo_coins) ? m.momo_coins[0] : m.momo_coins;
            return {
                id: m.id,
                business_name: m.merchants?.[0]?.business_name || 'Unknown',
                mobile: m.mobile,
                bank_account: m.merchants?.[0]?.bank_account_number || 'N/A',
                ifsc: m.merchants?.[0]?.ifsc_code || 'N/A',
                holder: m.merchants?.[0]?.account_holder_name || 'N/A',
                balance: wallet?.balance_available || 0
            };
        }).filter(m => m.balance > 0); // Only positive balance

        return settleable;

    } catch (e) {
        console.error('Server Action Error:', e);
        return [];
    }
}
