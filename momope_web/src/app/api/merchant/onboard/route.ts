import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

export async function POST(request: Request) {
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (error || !user) return NextResponse.json({ success: false, message: 'Invalid Token' }, { status: 401 });

        const body = await request.json();
        const { business_name, owner_name, email } = body;

        console.log(`[API] Onboarding Merchant: ${business_name}`);

        const { error: updateError } = await supabase
            .from('users')
            .update({
                business_name,
                full_name: owner_name,
                email, // Update public email too
                updated_at: new Date().toISOString()
            })
            .eq('id', user.id);

        if (updateError) {
            return NextResponse.json({ success: false, message: 'Update failed' }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'Onboarding complete' });

    } catch (error) {
        return NextResponse.json({ success: false, message: 'Server Error' }, { status: 500 });
    }
}
