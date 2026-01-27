import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { verifyJWT } from '@/middleware/authMiddleware';

export async function GET(request: NextRequest) {
    // 1. Verify JWT
    const auth = await verifyJWT(request);
    if (!auth.success) return auth.response;
    const userId = auth.user.userId;

    try {
        // 2. Fetch Transactions (Where I am the receiver)
        const { data: transactions, error } = await supabaseAdmin
            .from('transactions')
            .select(`
                *,
                sender:sender_id (full_name, mobile)
            `)
            .eq('receiver_id', userId)
            .order('created_at', { ascending: false })
            .limit(50); // Limit for now

        if (error) {
            console.error('History Fetch Error:', error);
            return NextResponse.json({ success: false, message: 'Could not fetch history' }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            data: transactions
        });

    } catch (error) {
        console.error('History Server Error:', error);
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}
