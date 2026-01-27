import { NextResponse } from 'next/server';

// In-memory OTP storage (shared with verify endpoint)
const otpStore = new Map<string, { otp: string; timestamp: number }>();

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { mobile, role } = body;

        console.log(`[API] Sending OTP to ${mobile} for role ${role}`);

        if (!mobile || String(mobile).length !== 10) {
            return NextResponse.json({ success: false, message: 'Invalid mobile number' }, { status: 400 });
        }

        // Generate OTP
        const mockOtp = '123456'; // In production, generate random 6-digit

        // Store OTP with timestamp
        otpStore.set(mobile, {
            otp: mockOtp,
            timestamp: Date.now()
        });

        console.log(`[API] Mock OTP for ${mobile}: ${mockOtp}`);

        // TODO: In production, call Msg91 API here
        // await sendSms(mobile, `Your MomoPe OTP is ${mockOtp}`);

        return NextResponse.json({
            success: true,
            message: 'OTP sent successfully',
            data: { mobile, otp: process.env.OTP_MOCK_MODE === 'true' ? mockOtp : undefined }
        });

    } catch (error) {
        console.error('Error in send-otp:', error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}

export { otpStore };

