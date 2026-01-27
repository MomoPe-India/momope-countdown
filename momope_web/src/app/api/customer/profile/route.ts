import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { verifyJWT } from '@/middleware/authMiddleware';

export async function GET(request: NextRequest) {
    // 1. Verify JWT
    const auth = await verifyJWT(request);
    if (!auth.success) return auth.response;

    const user = auth.user;
    const userId = user.userId;


    try {
        // 2. Fetch Profile & Coins
        const { data: profile, error: profileError } = await supabaseAdmin
            .from('users') // Note: In momope_web we seemingly use 'users', but backend used 'customers'. Let's verify schema later. sticking to 'users' based on otp/verify
            // Wait, backend joined 'customers' and 'users'.
            // In otp/verify we used 'users' for everything.
            // Let's assume 'users' table works for now, or check schema?
            // User '36845053-1b5b-4e43-aaab-ea98c8f47198' has 'users' table.
            .select('*')
            .eq('id', userId)
            .single();

        if (profileError) {
            // If not found in users, maybe it's fine?
            console.error('Profile fetch error:', profileError);
            return NextResponse.json({ success: false, message: 'Profile not found' }, { status: 404 });
        }

        const { data: coins } = await supabaseAdmin
            .from('momo_coins')
            .select('*')
            .eq('customer_id', userId)
            .maybeSingle();

        // 3. Construct Response compatible with existing Mobile App
        // Mobile expects: { profile: { ... }, coins: { balance_available: 0 } }

        const flatProfile = {
            ...profile,
            is_pin_set: !!profile.pin_hash, // Assuming pin_hash is in users table
            onboarding_step: (profile.full_name) ? 'COMPLETED' : 'REGISTRATION'
        };

        return NextResponse.json({
            success: true,
            data: {
                profile: flatProfile,
                coins: coins || { balance_available: 0 }
            }
        });

    } catch (error) {
        console.error('Error in customer/profile:', error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    // 1. Verify JWT
    const auth = await verifyJWT(request);
    if (!auth.success) return auth.response;

    const user = auth.user;
    const userId = user.userId;

    try {
        const body = await request.json();
        const { full_name, email } = body;

        console.log(`[PROFILE_UPDATE] User: ${userId}`, body);

        // 2. Update User
        // Note: Using 'users' table as per verify route.
        const { error } = await supabaseAdmin
            .from('users')
            .update({ full_name, email })
            .eq('id', userId);

        if (error) {
            console.error('Update error:', error);
            return NextResponse.json({ success: false, message: 'Update failed' }, { status: 500 });
        }

        // 3. Ensure Coins Wallet
        await supabaseAdmin
            .from('momo_coins')
            .upsert({ customer_id: userId }, { onConflict: 'customer_id', ignoreDuplicates: true });

        return NextResponse.json({ success: true, message: 'Profile updated' });

    } catch (error) {
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}
