import { NextRequest, NextResponse } from 'next/server';
import { razorpay } from '@/lib/razorpay';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { verifyJWT } from '@/middleware/authMiddleware';

export async function POST(request: NextRequest) {
    // 1. Authenticate
    const auth = await verifyJWT(request);
    if (!auth.success) return auth.response;

    try {
        const body = await request.json();
        const { amount, description, use_coins } = body;

        if (!amount || amount < 1) {
            return NextResponse.json({ success: false, message: 'Invalid amount' }, { status: 400 });
        }

        let fiatAmount = amount;
        let coinsToBurn = 0;

        // 2. Calculate Redemption (Hybrid Model)
        if (use_coins) {
            // Fetch Wallet Balance
            const { data: wallet } = await supabaseAdmin
                .from('momo_coins')
                .select('balance_available')
                .eq('customer_id', auth.user.userId)
                .single();

            const balance = wallet?.balance_available || 0;

            // Rule 1: Retention Cap (Max 80% of Wallet)
            const retentionCap = Math.floor(balance * 0.8);

            // Rule 2: Revenue Cap (Max 50% of Bill)
            const revenueCap = Math.floor(amount * 0.5);

            // Effective Cap
            const maxRedeemable = Math.min(retentionCap, revenueCap);

            // Apply
            if (maxRedeemable > 0) {
                coinsToBurn = maxRedeemable;
                fiatAmount = amount - coinsToBurn;
            }
        }

        // Safety: Fiat amount must be at least ₹1 for Razorpay
        if (fiatAmount < 1) {
            return NextResponse.json({ success: false, message: 'Payment amount too low for Razorpay' }, { status: 400 });
        }

        // 3. Create Razorpay Order
        const options = {
            amount: fiatAmount * 100, // Convert to Paise
            currency: 'INR',
            receipt: `rcpt_${Date.now()}`,
            notes: {
                user_id: auth.user.userId,
                description: description || 'MomoPe Payment',
                gross_amount: amount,
                coins_used: coinsToBurn
            }
        };

        const order = await razorpay.orders.create(options);

        // 4. Return Order ID to Frontend
        return NextResponse.json({
            success: true,
            data: {
                id: order.id,
                currency: order.currency,
                amount: order.amount, // Fiat Paise
                gross_amount: amount, // Original Request
                coins_used: coinsToBurn,
                key_id: process.env.RAZORPAY_KEY_ID
            }
        });

    } catch (error) {
        console.error('Razorpay Order Error:', error);
        return NextResponse.json({ success: false, message: 'Order creation failed' }, { status: 500 });
    }
}
