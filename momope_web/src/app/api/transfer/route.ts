
import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Supabase Admin Client for generic operations if needed, 
// but we should try to use the user's context if possible.
// However, for sensitive transfers, relying on the verified JWT is crucial.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

import { verifyJWT } from '@/middleware/authMiddleware';

export async function POST(req: NextRequest) {
    try {
        // 1. Verify Authentication (Custom JWT)
        const authResult = await verifyJWT(req);
        if (!authResult.success) {
            return authResult.response;
        }

        const senderId = authResult.user.userId;

        // 2. Parse Request Body
        const body = await req.json();
        const { receiverId, amount } = body;

        if (!receiverId || !amount || amount <= 0) {
            return NextResponse.json({ error: 'Invalid request parameters' }, { status: 400 });
        }

        if (senderId === receiverId) {
            return NextResponse.json({ error: 'Cannot transfer to self' }, { status: 400 });
        }

        console.log(`[API P2P] Transfer request from ${senderId} to ${receiverId} for ${amount}`);

        // 3. Perform Transfer (Using Admin Client to bypass RLS for transaction integrity if needed, 
        // or just to ensure we can read both wallets)

        // A. Check Sender Balance
        const { data: senderWallet } = await supabaseAdmin
            .from('momo_coins')
            .select('balance_available')
            .eq('customer_id', senderId)
            .single();

        if (!senderWallet || senderWallet.balance_available < amount) {
            return NextResponse.json({ error: 'Insufficient Balance' }, { status: 402 });
        }

        // 🚨 ENFORCE RETENTION RULE (80% Cap)
        // User must leave 20% of their CURRENT balance in the wallet.
        // Wait, "Redeem 80% of balance" means: TransferAmount <= Balance * 0.8
        const maxTransferable = Math.floor(senderWallet.balance_available * 0.80);

        if (amount > maxTransferable) {
            return NextResponse.json({
                error: `Retention Limit Reached. You can only send up to ${maxTransferable} Coins (80% of balance).`
            }, { status: 400 });
        }

        // B. Debit Sender
        const { error: debitError } = await supabaseAdmin
            .from('momo_coins')
            .update({ balance_available: senderWallet.balance_available - amount })
            .eq('customer_id', senderId);

        if (debitError) {
            console.error('Debit failed', debitError);
            return NextResponse.json({ error: 'Transfer failed' }, { status: 500 });
        }

        // C. Credit Receiver
        // Fetch receiver wallet first to ensure existence
        const { data: receiverWallet } = await supabaseAdmin
            .from('momo_coins')
            .select('balance_available')
            .eq('customer_id', receiverId)
            .single();

        if (!receiverWallet) {
            // Rollback logic would go here (credit sender back)
            // For now, simpler implementation:
            console.error('Receiver wallet not found');
            // Refund sender
            await supabaseAdmin.from('momo_coins').update({ balance_available: senderWallet.balance_available }).eq('customer_id', senderId);

            return NextResponse.json({ error: 'Receiver not found' }, { status: 404 });
        }

        const { error: creditError } = await supabaseAdmin
            .from('momo_coins')
            .update({ balance_available: receiverWallet.balance_available + amount })
            .eq('customer_id', receiverId);

        if (creditError) {
            // Refund sender
            await supabaseAdmin.from('momo_coins').update({ balance_available: senderWallet.balance_available }).eq('customer_id', senderId);
            return NextResponse.json({ error: 'Transfer failed during credit' }, { status: 500 });
        }

        // 4. Log Transaction (Optional but recommended)
        // const { error: logError } = await supabaseAdmin.from('transactions').insert({...})

        return NextResponse.json({ success: true, message: 'Transfer successful', amount });

    } catch (e: any) {
        console.error('API Error:', e);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
