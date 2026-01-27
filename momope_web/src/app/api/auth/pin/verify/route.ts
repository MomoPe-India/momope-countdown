import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { verifyJWT } from '@/middleware/authMiddleware';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
    // 1. Verify JWT (Optional? Mobile sends userID in body, but we should trust token)
    // Mobile sends: { userId, pin }
    // Ideally we ignore userId in body and use token.
    // Let's support both for now, but prioritize token.

    // AuthContext calls: api.post('/auth/pin/verify', { userId, pin })
    // It DOES NOT send token if locked? 
    // Wait, AuthContext.tsx: 
    // const res = await authService.verifyPin(user.id, pin);
    // And interceptor adds token IF it exists.
    // If locked, token exists.

    const authResult = await verifyJWT(request);
    let userId = '';

    if (authResult.success && authResult.user) {
        userId = authResult.user.userId;
    } else {
        // Fallback: If mobile sends userId and we trust it? NO.
        // PIN verification is SENSITIVE. Use Token.
        // If token is missing/invalid, fail.
        return authResult; // 401
    }

    try {
        const body = await request.json();
        const { pin } = body;
        // We ignore body.userId and use token.userId for security.

        if (!pin) return NextResponse.json({ success: false, message: 'PIN required' }, { status: 400 });

        // Fetch User's PIN Hash
        const { data: user, error } = await supabaseAdmin
            .from('users')
            .select('pin_hash')
            .eq('id', userId)
            .single();

        if (error || !user) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }

        if (!user.pin_hash) {
            return NextResponse.json({ success: false, message: 'PIN not set' }, { status: 400 });
        }

        // Compare PIN
        const isValid = await bcrypt.compare(pin, user.pin_hash);

        if (isValid) {
            return NextResponse.json({ success: true, message: 'PIN verified' });
        } else {
            return NextResponse.json({ success: false, message: 'Invalid PIN' }, { status: 401 });
        }

    } catch (error) {
        console.error('PIN Verify Error:', error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}
