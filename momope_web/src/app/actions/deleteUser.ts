'use server'

import { createClient } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function deleteUser(userId: string) {
    try {
        console.log(`[ADMIN DELETE] Deleting User: ${userId}`);

        // Delete from 'users' table. 
        // Cascading deletes should handle related profiles (merchants/customers) 
        // IF configured in DB. If not, we might need manual cleanup, but 'users' is the root.

        // 0. Manual Cascade: Delete related records first
        // This ensures no FK constraints block the user deletion
        await supabase.from('momo_coins').delete().eq('customer_id', userId);
        await supabase.from('customers').delete().eq('user_id', userId);
        await supabase.from('merchants').delete().eq('id', userId);

        // 1. Delete from public 'users' table (App Data)
        const { error: dbError } = await supabase
            .from('users')
            .delete()
            .eq('id', userId);

        if (dbError) {
            console.error('Delete DB User Failed:', dbError);
            return { success: false, error: dbError.message };
        }

        // 2. Delete from Supabase Auth (Login Credentials)
        // This fails safely if the user is already gone or if we manage auth differently
        const { error: authError } = await supabase.auth.admin.deleteUser(userId);

        if (authError) {
            console.warn('Auth Delete Warning (User might stay in Auth):', authError.message);
            // We don't block success if DB delete worked, but good to know.
        }

        revalidatePath('/admin/merchants');
        revalidatePath('/admin/customers');
        revalidatePath('/admin/dashboard');

        return { success: true };
    } catch (e: any) {
        return { success: false, error: e.message };
    }
}
