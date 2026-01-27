
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { verifyJWT } from '@/lib/jwt';
import bcrypt from 'bcryptjs';

export async function POST(req: Request) {
    try {
        // 1. Verify User
        const user = await verifyJWT(req);
        if (!user) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        const { oldPin, newPin } = await req.json();

        if (!oldPin || !newPin || newPin.length !== 4) {
            return NextResponse.json({ success: false, message: 'Invalid PIN data' }, { status: 400 });
        }

        // 2. Fetch Current PIN Hash
        const { data: userData, error: fetchError } = await supabase
            .from('users')
            .select('pin_hash')
            .eq('id', user.userId)
            .single();

        if (fetchError || !userData) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 });
        }

        // 3. Verify Old PIN
        if (userData.pin_hash) {
            const isMatch = await bcrypt.compare(oldPin, userData.pin_hash);
            if (!isMatch) {
                return NextResponse.json({ success: false, message: 'Incorrect old PIN' }, { status: 400 });
            }
        } else {
            // Optional: If no PIN set, maybe allow setting it directly? 
            // For now, assume PIN exists if they are changing it. 
            // Or if flow allows setting for first time here:
            // return NextResponse.json({ success: false, message: 'PIN not set. Use Setup.' }, { status: 400 });
        }

        // 4. Hash New PIN
        const salt = await bcrypt.genSalt(10);
        const newPinHash = await bcrypt.hash(newPin, salt);

        // 5. Update PIN
        const { error: updateError } = await supabase
            .from('users')
            .update({ pin_hash: newPinHash })
            .eq('id', user.userId);

        if (updateError) {
            console.error('Update PIN Error:', updateError);
            return NextResponse.json({ success: false, message: 'Failed to update PIN' }, { status: 500 });
        }

        return NextResponse.json({ success: true, message: 'PIN updated successfully' });

    } catch (error: any) {
        console.error('Change PIN API Error:', error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}
