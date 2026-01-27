import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { generateToken } from '@/lib/jwt';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { mobile, pin, role } = body;

        console.log(`[API] PIN Login for ${mobile}`);

        if (!mobile || !pin) {
            return NextResponse.json({ success: false, message: 'Mobile and PIN required' }, { status: 400 });
        }

        // 1. Fetch User by Mobile
        const { data: user, error } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('mobile', mobile)
            .single();

        if (error || !user) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }

        if (!user.pin_hash) {
            return NextResponse.json({ success: false, message: 'PIN not set for this user' }, { status: 400 });
        }

        // 2. Verify PIN
        const isValid = await bcrypt.compare(pin, user.pin_hash);

        if (!isValid) {
            return NextResponse.json({ success: false, message: 'Invalid PIN' }, { status: 401 });
        }

        // 3. Generate JWT
        const userRole = user.role || role || 'CUSTOMER';
        const token = generateToken(user.id, user.mobile, userRole);

        let onboardingStep = 'REGISTRATION';
        if (user.full_name) {
            onboardingStep = user.pin_hash ? 'COMPLETED' : 'PIN_SETUP';
        }

        return NextResponse.json({
            success: true,
            token: token,
            user: {
                ...user,
                onboarding_step: onboardingStep
            }
        });

    } catch (error) {
        console.error('PIN Login Error:', error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}
