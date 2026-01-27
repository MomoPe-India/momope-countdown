import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { verifyJWT } from '@/middleware/authMiddleware';

export async function GET(request: NextRequest) {
    const auth = await verifyJWT(request);
    if (!auth.success) return auth.response;
    const merchantId = auth.user.userId;

    try {
        // 1. Fetch all Payment Transactions
        const { data: txns, error } = await supabaseAdmin
            .from('transactions')
            .select('*')
            .eq('merchant_id', merchantId)
            // .eq('type', 'PAY_TO_MERCHANT') // Column does not exist
            .eq('status', 'SUCCESS') // Ensure we only count success
            .order('created_at', { ascending: false });

        if (error) throw error;

        // 2. Aggregate Data by Date
        const dailyMap = new Map();
        const summary = { pending_payout: 0, total_settled: 0 };

        txns.forEach(tx => {
            const date = new Date(tx.created_at).toISOString().split('T')[0];
            const gross = Number(tx.amount_gross); // Fixed Column

            // Extract commission directly
            const commission = Number(tx.commission_amount || 0);
            const net = Number(tx.amount_net); // Or gross - commission

            // Simplified T+1 Logic: If date is NOT today, it is "Settled"
            const today = new Date().toISOString().split('T')[0];
            const isSettled = date < today;

            if (isSettled) {
                summary.total_settled += net;
            } else {
                summary.pending_payout += net;
            }

            if (!dailyMap.has(date)) {
                dailyMap.set(date, {
                    date,
                    gross: 0,
                    commission: 0,
                    net: 0,
                    count: 0,
                    status: isSettled ? 'SETTLED' : 'PENDING'
                });
            }

            const day = dailyMap.get(date);
            day.gross += gross;
            day.commission += commission;
            day.net += net;
            day.count += 1;
        });

        const daily_breakdown = Array.from(dailyMap.values());

        return NextResponse.json({
            success: true,
            data: {
                summary,
                daily_breakdown
            }
        });

    } catch (error) {
        console.error('Settlements Error:', error);
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}
