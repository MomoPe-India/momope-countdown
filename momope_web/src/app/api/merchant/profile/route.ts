import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { verifyJWT } from '@/middleware/authMiddleware';

export async function GET(request: NextRequest) {
    // 1. Verify JWT
    const auth = await verifyJWT(request);
    if (!auth.success) return auth.response;
    const userId = auth.user.userId;

    try {
        // 2. Fetch Profile
        const { data: profile, error: profileError } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();

        if (profileError) {
            return NextResponse.json({ success: false, message: 'Profile not found' }, { status: 404 });
        }

        // 3. Calculate Today's Collections (Instead of Wallet)
        // Get start of today (UTC or Local? simplified to simple date check for now)
        const todayStr = new Date().toISOString().split('T')[0];

        const { data: todaysTxns } = await supabaseAdmin
            .from('transactions')
            .select('amount')
            .eq('receiver_id', userId)
            .gte('created_at', todayStr);

        const todays_collection = todaysTxns?.reduce((sum, tx) => sum + Number(tx.amount), 0) || 0;
        const todays_count = todaysTxns?.length || 0;

        // Determine onboarding step
        let onboarding_step = 'REGISTRATION';
        if (profile.business_name) onboarding_step = 'COMPLETED';

        // Construct Response
        return NextResponse.json({
            success: true,
            data: {
                profile: {
                    ...profile,
                    is_pin_set: !!profile.pin_hash,
                    onboarding_step
                },
                stats: {
                    todays_collection,
                    todays_count
                }
            }
        });

    } catch (error) {
        console.error('Merchant Profile Error:', error);
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    // 1. Verify JWT
    const auth = await verifyJWT(request);
    if (!auth.success) return auth.response;
    const userId = auth.user.userId;

    try {
        const body = await request.json();
        const { business_name, category } = body;

        console.log(`[MERCHANT_UPDATE] User: ${userId}`, body);

        // 2. Update User Profile
        const { error: updateError } = await supabaseAdmin
            .from('users')
            .update({ business_name, category })
            .eq('id', userId);

        if (updateError) {
            console.error('Merchant Update Error:', updateError);
            return NextResponse.json({ success: false, message: 'Update failed' }, { status: 500 });
        }

        // 3. Ensure Wallet Exists (Merchants need to receive money)
        await supabaseAdmin
            .from('momo_coins')
            .upsert({ customer_id: userId }, { onConflict: 'customer_id', ignoreDuplicates: true });

        return NextResponse.json({ success: true, message: 'Merchant Profile updated' });

    } catch (error) {
        console.error('Merchant POST Error:', error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}
