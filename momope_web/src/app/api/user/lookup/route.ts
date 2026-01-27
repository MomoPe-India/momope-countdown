import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { verifyJWT } from '@/middleware/authMiddleware';

export async function POST(request: NextRequest) {
    const auth = await verifyJWT(request);
    if (!auth.success) return auth.response;

    try {
        const body = await request.json();
        const { mobile } = body;

        if (!mobile) return NextResponse.json({ success: false, message: 'Mobile required' }, { status: 400 });

        const { data: user } = await supabaseAdmin
            .from('users')
            .select('id, full_name, mobile')
            .eq('mobile', mobile)
            .single();

        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' });
        }

        return NextResponse.json({
            success: true,
            data: {
                id: user.id,
                name: user.full_name,
                mobile: user.mobile
            }
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}
