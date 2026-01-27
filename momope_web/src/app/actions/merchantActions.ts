'use server';

import { supabase } from '@/lib/supabaseClient';
import { revalidatePath } from 'next/cache';

export async function approveMerchant(userId: string) {
    try {
        // 1. Approve User Role
        const { error: userError } = await supabase
            .from('users')
            .update({
                kyc_verified: true,
                role: 'MERCHANT'
            })
            .eq('id', userId);

        if (userError) throw userError;

        // 2. Approve Merchant Profile (Critical for Dashboard Stats)
        const { error: merchantError } = await supabase
            .from('merchants')
            .update({
                kyc_status: 'APPROVED',
                updated_at: new Date().toISOString()
            })
            .eq('user_id', userId);

        if (merchantError) throw merchantError;

        revalidatePath('/admin/dashboard');
        return { success: true };
    } catch (error) {
        console.error('Approve Merchant Error:', error);
        return { success: false, error: 'Failed to approve merchant' };
    }
}

export async function rejectMerchant(userId: string) {
    try {
        const { error } = await supabase
            .from('users')
            .delete()
            .eq('id', userId); // Fixed: user_id -> id

        if (error) throw error;

        revalidatePath('/admin/dashboard');
        return { success: true };
    } catch (error) {
        console.error('Reject Merchant Error:', error);
        return { success: false, error: 'Failed to reject merchant' };
    }
}

export async function submitManualKyc(userId: string, data: any) {
    try {
        const { pan_number, bank_account_number, ifsc_code } = data;

        // 1. Update Merchant Details
        const { error: merchantError } = await supabase
            .from('merchants')
            .update({
                pan_number,
                bank_account_number,
                ifsc_code,
                kyc_status: 'APPROVED',
                updated_at: new Date().toISOString()
            })
            .eq('user_id', userId);

        if (merchantError) throw merchantError;

        // 2. Auto-Approve User
        const { error: userError } = await supabase
            .from('users')
            .update({
                kyc_verified: true,
                role: 'MERCHANT'
            })
            .eq('id', userId);

        if (userError) throw userError;

        revalidatePath('/admin/dashboard');
        revalidatePath(`/admin/merchants/${userId}`);
        return { success: true };

    } catch (error) {
        console.error('Manual KYC Error:', error);
        return { success: false, error: 'Failed to submit manual KYC' };
    }
}
