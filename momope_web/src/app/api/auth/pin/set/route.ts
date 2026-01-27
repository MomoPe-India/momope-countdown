import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { verifyJWT } from '@/middleware/authMiddleware';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
    const auth = await verifyJWT(request);
    if (!auth.success) return auth.response;

    const userId = auth.user.userId;

    try {
        const body = await request.json();
        const { pin } = body;

        if (!pin || pin.length !== 4) {
            return NextResponse.json({ success: false, message: 'Invalid PIN format' }, { status: 400 });
        }

        // Hash PIN
        const salt = await bcrypt.genSalt(10);
        const pinHash = await bcrypt.hash(pin, salt);

        // Update User
        const { error } = await supabaseAdmin
            .from('users')
            .update({ pin_hash: pinHash })
            .eq('id', userId);

        if (error) {
            console.error('PIN Set Error:', error);
            return NextResponse.json({ success: false, message: 'Failed to set PIN' }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'PIN set successfully' });

    } catch (error) {
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}
