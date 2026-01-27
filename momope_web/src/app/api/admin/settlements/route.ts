import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { verifyJWT } from '@/middleware/authMiddleware';

export async function GET(request: NextRequest) {
    const auth = await verifyJWT(request);
    if (!auth.success || auth.user.role !== 'admin') {
        return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 403 });
    }

    try {
        // 1. Fetch all Payment Transactions (Descending Date)
        const { data: txns, error } = await supabaseAdmin
            .from('transactions')
            .select('*')
            .eq('type', 'PAY_TO_MERCHANT')
            .order('created_at', { ascending: false });

        if (error) throw error;

        // 2. Fetch All Merchants (for names)
        const { data: merchants } = await supabaseAdmin
            .from('users')
            .select('id, full_name, mobile')
            .eq('role', 'MERCHANT');

        const merchantMap = new Map();
        merchants?.forEach(m => merchantMap.set(m.id, m));

        // 3. Aggregate Data per Merchant
        const settlements = new Map();

        txns.forEach(tx => {
            const mid = tx.receiver_id;
            if (!settlements.has(mid)) {
                settlements.set(mid, {
                    merchant_id: mid,
                    merchant_name: merchantMap.get(mid)?.full_name || 'Unknown',
                    mobile: merchantMap.get(mid)?.mobile,
                    total_gross: 0,
                    total_commission: 0,
                    total_net: 0,
                    pending_payout: 0, // Should calculate based on status if we tracked it
                    tx_count: 0,
                    last_tx_date: tx.created_at
                });
            }

            const record = settlements.get(mid);
            const gross = Number(tx.amount);
            const financials = tx.metadata?.financials || {};
            const commission = Number(financials.commission_amount || 0);
            const net = gross - commission;

            record.total_gross += gross;
            record.total_commission += commission;
            record.total_net += net;
            record.tx_count += 1;

            // For now, assume everything not marked "paid_out" (future flag) is pending
            // Since we don't have a 'payouts' table yet, we treat ALL as "Lifetime" view
            // In a real system, we'd filter out settled ones.
            record.pending_payout += net;
        });

        return NextResponse.json({
            success: true,
            data: Array.from(settlements.values())
        });

    } catch (error) {
        console.error('Admin Settlements Error:', error);
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}
