import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { verifyJWT } from '@/middleware/authMiddleware';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
    const auth = await verifyJWT(request);
    if (!auth.success) return auth.response;

    try {
        const body = await request.json();
        const {
            order_id,
            payment_id,
            signature,
            merchant_id,
            amount, // Gross Amount
            coins_burnt = 0, // New Field
            description
        } = body;

        // 1. Verify Signature
        const generated_signature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
            .update(order_id + '|' + payment_id)
            .digest('hex');

        if (generated_signature !== signature) {
            return NextResponse.json({ success: false, message: 'Invalid Signature' }, { status: 400 });
        }

        console.log(`[PAYMENT_SUCCESS] User: ${auth.user.userId} -> Merchant: ${merchant_id} | Amount: ${amount}`);

        // 2. Fetch Merchant Profile for Rates
        const { data: merchant } = await supabaseAdmin
            .from('users')
            .select('reward_rate, commission_rate') // Assuming columns. If not, we fallback.
            .eq('id', merchant_id)
            .single();

        // Defaults: Reward 5%, Commission 15%
        const rewardRate = merchant?.reward_rate || 5;
        const commissionRate = merchant?.commission_rate || 15;

        // 3. Application Logic

        // A. Burn Coins (If used)
        if (coins_burnt > 0) {
            const { data: userWallet } = await supabaseAdmin
                .from('momo_coins')
                .select('balance_available')
                .eq('customer_id', auth.user.userId)
                .single();

            if (userWallet) {
                await supabaseAdmin
                    .from('momo_coins')
                    .update({ balance_available: userWallet.balance_available - coins_burnt })
                    .eq('customer_id', auth.user.userId);
            }
        }



        // B. Commission Calculation (On GROSS Amount)
        const commissionAmount = amount * (commissionRate / 100);

        // 3.5. Ensure Customer Record Exists (Self-Healing for broken signups)
        // FK Violation Prevention: transactions -> customers(user_id)
        await supabaseAdmin
            .from('customers')
            .upsert({
                user_id: auth.user.userId,
                full_name: 'MomoPe Customer', // Default placeholder
                updated_at: new Date().toISOString()
            }, { onConflict: 'user_id', ignoreDuplicates: true });

        // C. Reward Calculation (On FIAT Amount Only - Anti-Loop Rule)
        const fiatAmount = amount - coins_burnt;
        // Cap Rate at 10%
        const activeRewardRate = Math.min(rewardRate, 10.0);
        const coinsEarned = Math.floor(fiatAmount * (activeRewardRate / 100));

        console.log(`[FINANCE] Gross: ${amount} | Fiat: ${fiatAmount} | Comm: ${commissionAmount} | Burn: ${coins_burnt} | Earn: ${coinsEarned}`);

        // 4. Record Transaction (Ledger)
        const { error: txError } = await supabaseAdmin
            .from('transactions')
            .insert({
                razorpay_order_id: order_id,
                merchant_id: merchant_id,
                customer_id: auth.user.userId,
                amount_gross: amount,
                amount_net: amount - commissionAmount,
                coins_redeemed: coins_burnt,
                coins_earned: coinsEarned,
                commission_rate: commissionRate,
                random_reward_pct: activeRewardRate,
                commission_amount: commissionAmount,
                status: 'SUCCESS',
                // No description or metadata columns in schema
            });

        if (txError) {
            console.error('Tx Insert Error:', txError);
            return NextResponse.json({ success: false, message: 'Tx Insert Failed: ' + txError.message }, { status: 500 });
        }

        // 5. Mint Rewards
        if (coinsEarned > 0) {
            // Check if wallet exists
            const { data: wallet } = await supabaseAdmin
                .from('momo_coins')
                .select('*')
                .eq('customer_id', auth.user.userId)
                .single();

            if (wallet) {
                await supabaseAdmin
                    .from('momo_coins')
                    .update({ balance_available: wallet.balance_available + coinsEarned })
                    .eq('customer_id', auth.user.userId);
            } else {
                // If wallet doesn't exist (edge case), create it with initial coins
                await supabaseAdmin
                    .from('momo_coins')
                    .insert({ customer_id: auth.user.userId, balance_available: coinsEarned });
            }
        }

        return NextResponse.json({
            success: true,
            data: {
                message: 'Payment Verified',
                coins_earned: coinsEarned
            }
        });

    } catch (error) {
        console.error('Verify Error:', error);
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}
