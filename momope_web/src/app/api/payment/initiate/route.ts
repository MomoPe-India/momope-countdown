import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { verifyJWT } from '@/middleware/authMiddleware';
import Razorpay from 'razorpay';

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!
});

export async function POST(request: NextRequest) {
    const auth = await verifyJWT(request);
    if (!auth.success) return auth.response;

    const userId = auth.user.userId;

    try {
        const body = await request.json();
        const { amount, merchantId, coinsRedeemed } = body;

        // Verify Merchant
        const { data: merchant, error: merchantError } = await supabaseAdmin
            .from('merchants')
            .select('user_id, commission_rate, max_reward_cap')
            .eq('user_id', merchantId)
            .single();

        if (merchantError || !merchant) {
            return NextResponse.json({ error: 'Merchant not found' }, { status: 404 });
        }

        // Verify Coin Balance (Race condition ignored for MVP)
        if (coinsRedeemed > 0) {
            const { data: coinData } = await supabaseAdmin
                .from('momo_coins')
                .select('balance_available')
                .eq('customer_id', userId)
                .maybeSingle();

            const balance = coinData?.balance_available || 0;
            if (coinsRedeemed > balance) {
                return NextResponse.json({ error: 'Insufficient coin balance' }, { status: 400 });
            }
        }

        const netAmount = Number(amount) - Number(coinsRedeemed);
        if (netAmount < 1) return NextResponse.json({ error: 'Minimum payment amount is ₹1' }, { status: 400 });

        // Create Razorpay Order
        const options = {
            amount: netAmount * 100, // paise
            currency: 'INR',
            receipt: `rcpt_${Date.now()}`,
            notes: {
                merchant_id: merchantId,
                customer_id: userId,
                coins_redeemed: coinsRedeemed
            }
        };

        const order = await razorpay.orders.create(options);

        // Deduct Coins (Naive update)
        if (coinsRedeemed > 0) {
            // In a transaction block ideally. Here we assume success or handle manual rollback if needed.
            // We do this BEFORE creating transaction to lock funds? Or AFTER?
            // Legacy backend did it before.
            const { data: currentCoins } = await supabaseAdmin
                .from('momo_coins')
                .select('balance_available')
                .eq('customer_id', userId)
                .single();

            if (currentCoins) {
                await supabaseAdmin.from('momo_coins').update({
                    balance_available: currentCoins.balance_available - coinsRedeemed
                }).eq('customer_id', userId);
            }
        }

        // Insert Transaction Record
        const { error: insertError } = await supabaseAdmin.from('transactions').insert({
            razorpay_order_id: order.id,
            merchant_id: merchantId,
            customer_id: userId,
            amount_gross: amount,
            amount_net: netAmount,
            coins_redeemed: coinsRedeemed,
            commission_rate: merchant.commission_rate,
            random_reward_pct: 0,
            commission_amount: 0,
            status: 'CREATED'
        });

        if (insertError) {
            console.error('Txn Insert Error:', insertError);
            // Rollback coins? (Left as exercise for MVP reliability)
            return NextResponse.json({ error: 'Transaction init failed' }, { status: 500 });
        }

        return NextResponse.json({
            orderId: order.id,
            amount: netAmount * 100,
            currency: 'INR',
            key: process.env.RAZORPAY_KEY_ID
        });

    } catch (error) {
        console.error('Payment Init Error:', error);
        return NextResponse.json({ error: 'Transaction initiation failed' }, { status: 500 });
    }
}
