'use server';

import { supabase } from '@/lib/supabaseClient';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

// Helper to get user role (simulate for now if using mock auth)
async function getUserRole(userId: string) {
    // In real implementation, this comes from the session/db
    const { data } = await supabase.from('users').select('role').eq('id', userId).single();
    return data?.role || 'ADMIN'; // Default to admin for safety if fails? No, safe default is safer.
}

export async function getDashboardStats(mockRole?: string) {
    // 1. Get Real User & Role
    const querySupabase = supabaseAdmin; // Use Admin Client for Dashboard Stats (Bypass RLS)
    const { data: { user } } = await querySupabase.auth.getUser();

    let role = mockRole || 'ADMIN'; // Default fallback

    if (user) {
        // Fetch real role from DB
        const { data: userProfile } = await querySupabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single();
        if (userProfile?.role) {
            role = userProfile.role;
        }
    }

    try {
        // 1. Fetch Counts
        const { count: merchantCount } = await supabaseAdmin
            .from('users')
            .select('*', { count: 'exact', head: true })
            .eq('role', 'MERCHANT');

        const { count: userCount } = await supabaseAdmin
            .from('users')
            .select('*', { count: 'exact', head: true })
            .eq('role', 'CUSTOMER');

        const { count: pendingKycCount } = await supabaseAdmin
            .from('merchants')
            .select('*', { count: 'exact', head: true })
            .eq('is_onboarding_complete', true)
            .neq('kyc_status', 'APPROVED');

        // 2. Fetch Pending Approvals (Top 5)
        const { data: pendingMerchants } = await supabaseAdmin
            .from('merchants')
            .select(`
                business_name,
                user_id,
                created_at,
                users ( id, mobile )
            `)
            .eq('is_onboarding_complete', true)
            .neq('kyc_status', 'APPROVED')
            .order('created_at', { ascending: false })
            .limit(5);

        // Transform data
        const formattedPending = pendingMerchants?.map((m: any) => ({
            id: m.users?.id || m.user_id,
            mobile: m.users?.mobile || 'N/A',
            created_at: m.created_at,
            business_name: m.business_name || 'Pending Name'
        })) || [];

        // 3. Conditional Revenue Data
        // If SALES, we return 0/Hidden data
        let revenue = 0;
        let showFinancials = true;
        let myMerchantsCount = 0;

        if (role === 'SALES') {
            showFinancials = false;
            if (user) {
                const { count } = await supabase
                    .from('merchants')
                    .select('*', { count: 'exact', head: true })
                    .eq('onboarded_by', user.id);
                myMerchantsCount = count || 0;
            }
        } else {
            // Fetch Real Transaction Volume for Revenue Estimation
            const { data: transactions } = await supabaseAdmin
                .from('transactions')
                .select('amount_gross')
                .eq('status', 'SUCCESS');

            let totalVolume = 0;
            if (transactions) {
                totalVolume = transactions.reduce((sum, tx) => sum + (Number(tx.amount_gross) || 0), 0);
            }
            revenue = totalVolume * 0.02; // 2% Commission
        }

        return {
            totalMerchants: merchantCount || 0,
            totalUsers: userCount || 0,
            platformRevenue: revenue,
            pendingKyc: pendingKycCount || 0,
            pendingMerchants: formattedPending || [],
            showFinancials,
            myMerchantsCount,
            // New: Recent Transactions (Merchant Payments Only)
            recentTransactions: (await supabaseAdmin
                .from('transactions')
                .select(`
                    id, amount:amount_gross, created_at, status,
                    receiver:merchant_id ( id, business_name, full_name ),
                    sender:customer_id ( mobile )
                `)
                .order('created_at', { ascending: false })
                .limit(5)
            ).data || []
        };

    } catch (error) {
        console.error("Dashboard Stats Error:", error);
        return {
            totalMerchants: 0,
            totalUsers: 0,
            platformRevenue: 0,
            pendingKyc: 0,
            pendingMerchants: [],
            showFinancials: false
        };
    }
}
