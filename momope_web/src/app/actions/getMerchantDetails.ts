'use server';

import { supabase } from '@/lib/supabaseClient';

export async function getMerchantDetails(userId: string) {
    try {
        // 1. Fetch Merchant Profile directly (Source of Truth)
        const { data: merchant, error: merchantError } = await supabase
            .from('merchants')
            .select(`
                *,
                users (*)
            `)
            .eq('user_id', userId) // Assuming the ID passed IS the user_id (which is how the route uses it)
            .maybeSingle();

        if (merchantError) {
            console.error("Error fetching merchant:", merchantError);
            throw new Error("Merchant fetch failed");
        }

        // Fallback: If no merchant record found, try fetching user and standardizing structure
        // This handles cases where user exists but merchant record creation failed/is pending
        let fullProfile;

        if (merchant) {
            fullProfile = {
                ...merchant.users, // Base user info
                ...merchant,       // Overlay merchant specific info
                id: merchant.user_id, // Ensure ID is the user_id
                full_name: merchant.users?.full_name,
                email: merchant.users?.email,
                mobile: merchant.users?.mobile,
                created_at: merchant.users?.created_at
            };
        } else {
            // Fallback for user only
            const { data: user, error: userError } = await supabase
                .from('users')
                .select('*')
                .eq('id', userId)
                .single();

            if (userError || !user) throw new Error("User not found");

            fullProfile = { ...user, business_name: 'N/A' };
        }

        // 2. Fetch Recent Transactions (Mocked for now if 'transactions' table missing, or try ledger)
        let recentTransactions = [];
        // Attempt to fetch real transactions
        const { data: txs, error: txError } = await supabase
            .from('transactions') // Assuming table name
            .select('*')
            .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
            .order('created_at', { ascending: false })
            .limit(10);

        if (!txError && txs) {
            recentTransactions = txs;
        }

        return {
            merchant: fullProfile,
            transactions: recentTransactions,
            // Mock bank details for now as we don't have a 'bank_accounts' table yet in schema
            bankDetails: {
                accountHolder: fullProfile?.business_name || fullProfile?.full_name || 'N/A',
                accountNumber: fullProfile?.bank_account_number || 'Not Linked',
                ifsc: fullProfile?.ifsc_code || 'N/A',
                bankName: fullProfile?.ifsc_code ? 'Verified Bank' : 'N/A'
            }
        };

    } catch (error) {
        console.error("getMerchantDetails Error:", error);
        return null;
    }
}
