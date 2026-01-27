import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { verifyJWT } from '@/middleware/authMiddleware';

export async function POST(request: NextRequest) {
    const auth = await verifyJWT(request);
    if (!auth.success) return auth.response;

    const userId = auth.user.userId;


    try {
        const body = await request.json();
        const { amount, merchantId, useCoins } = body;

        // Get Coin Balance
        const { data: coinData } = await supabaseAdmin
            .from('momo_coins')
            .select('balance_available')
            .eq('customer_id', userId)
            .maybeSingle();

        const coinBalance = coinData?.balance_available || 0;

        let coinsToRedeem = 0;
        let netAmount = Number(amount);

        if (useCoins) {
            coinsToRedeem = Math.min(coinBalance, netAmount);

            // UPI requires minimum ₹1 transaction. If redeeming full amount, leave 1 Re.
            if (coinsToRedeem === netAmount) {
                coinsToRedeem = netAmount - 1;
            }

            netAmount = netAmount - coinsToRedeem;
        }

        return NextResponse.json({
            originalAmount: Number(amount),
            coinsRedeemed: coinsToRedeem,
            netPayable: netAmount,
            coinBalance: coinBalance,
            minPayableWarning: netAmount < 1
        });

    } catch (error) {
        console.error('Payment Calc Error:', error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}
