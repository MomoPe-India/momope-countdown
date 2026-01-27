import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { generateToken } from '@/lib/jwt';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

// In-memory OTP storage for development (use Redis in production)
const otpStore = new Map<string, { otp: string; timestamp: number }>();

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { mobile, otp, role } = body;

        console.log(`[API_DEBUG] Verify OTP request:`, { mobile, otp, role });
        console.log(`[API_DEBUG] Env OTP_MOCK_MODE: '${process.env.OTP_MOCK_MODE}'`);

        if (!mobile || !otp) {
            console.log('[API_DEBUG] Missing mobile or otp');
            return NextResponse.json({ success: false, message: 'Missing mobile or OTP' }, { status: 400 });
        }

        // 1. Verify OTP (mock for development, or check otpStore)
        const storedOtp = otpStore.get(mobile);
        const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

        // Force Mock Mode in Development if env var is missing
        const isMockMode = process.env.OTP_MOCK_MODE === 'true' || process.env.NODE_ENV === 'development';

        if (isMockMode) {
            // Development mode: accept 123456
            if (otp !== '123456') {
                console.log(`[API_DEBUG] Invalid Mock OTP: ${otp}`);
                return NextResponse.json({ success: false, message: 'Invalid OTP' }, { status: 400 });
            }
        } else {
            // Production mode: verify from storage
            if (!storedOtp) {
                return NextResponse.json({ success: false, message: 'OTP not found or expired' }, { status: 400 });
            }

            if (Date.now() - storedOtp.timestamp > OTP_EXPIRY_MS) {
                otpStore.delete(mobile);
                return NextResponse.json({ success: false, message: 'OTP expired' }, { status: 400 });
            }

            if (storedOtp.otp !== otp) {
                return NextResponse.json({ success: false, message: 'Invalid OTP' }, { status: 400 });
            }

            // Clear OTP after successful verification
            otpStore.delete(mobile);
        }

        // 2. Check if user exists in our database
        const { data: existingUser, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('mobile', mobile)
            .single();

        let userId: string;
        let userRole: string = role || 'CUSTOMER';
        let onboardingStep = 'REGISTRATION';
        let userData: any = {};

        if (existingUser) {
            // STRICT ROLE GUARD: Prevent Cross-Login
            // If registered as CUSTOMER, cannot login as MERCHANT (and vice versa)
            if (existingUser.role !== role) {
                console.warn(`[AUTH_GUARD] Blocked cross-role login. User: ${existingUser.role}, Requested: ${role}`);
                return NextResponse.json({
                    success: false,
                    message: `This number is registered as a ${existingUser.role}. Please use a different number.`
                }, { status: 403 });
            }

            // Existing user
            userId = existingUser.id;
            userRole = existingUser.role; // Trust DB role
            userData = existingUser;

            // Determine onboarding step
            if (existingUser.full_name || existingUser.business_name) {
                onboardingStep = existingUser.is_pin_set ? 'COMPLETED' : 'PIN_SETUP';
            }
        } else {
            // New user - create in database
            // ARCHITECTURE FIX: Create a real Supabase Auth user to satisfy Foreign Keys (e.g. momo_coins)
            // We use the mobile number as a dummy email to satisfy unique constraints if needed, or just let Supabase generate ID.

            console.log(`[AUTH] Creating new Supabase Auth user for ${mobile}...`);

            // Use a deterministic email format for phone-based auth users
            const dummyEmail = `${mobile}@momope.user`;

            // 1. Create Auth User
            const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
                email: dummyEmail,
                email_confirm: true,
                user_metadata: { mobile, role: userRole }
            });

            if (authError) {
                console.error('Auth User Creation Error:', authError);
                return NextResponse.json({ success: false, message: 'Failed to create auth identity' }, { status: 500 });
            }

            const newUserId = authUser.user.id;
            console.log(`[AUTH] New Auth ID: ${newUserId}`);

            // 2. Create Public User Record
            const { data: newUser, error: createError } = await supabase
                .from('users')
                .insert({
                    id: newUserId,
                    mobile: mobile,
                    role: userRole,
                    created_at: new Date().toISOString()
                })
                .select()
                .single();

            if (createError) {
                console.error('Create user error:', createError);
                // Rollback auth user? Ideally yes, but for MVP we log it.
                return NextResponse.json({ success: false, message: 'Failed to create user profile' }, { status: 500 });
            }

            // 2.5. Create Role-Specific Profile (Required for FKs)
            if (userRole === 'CUSTOMER') {
                const { error: custError } = await supabaseAdmin
                    .from('customers')
                    .insert({
                        user_id: newUserId,
                        full_name: 'New Customer', // Placeholder
                        email: dummyEmail
                    });
                if (custError) console.error('Customer profile creation failed:', custError);
            }
            // Merchants are handled in 'merchant_profile' setup or we should create a stub here?
            // For now, assume merchant onboarding flow handles 'merchants' table.

            // 3. Initialize Empty Wallet (Crucial for Payments)
            const { error: walletError } = await supabaseAdmin
                .from('momo_coins')
                .insert({ customer_id: newUserId, balance_available: 0 });

            if (walletError) console.warn('Wallet initialization warning:', walletError);

            userId = newUserId;
            userData = newUser;
            onboardingStep = 'REGISTRATION';
        }

        // 3. Generate JWT Token
        const token = generateToken(userId, mobile, userRole);

        console.log('Login successful, returning JWT token.');

        return NextResponse.json({
            success: true,
            token: token,
            user: {
                id: userId,
                mobile: mobile,
                role: userRole,
                onboarding_step: onboardingStep,
                ...userData
            }
        });

    } catch (error) {
        console.error('Error in verify-otp:', error);
        return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
    }
}

// Export otpStore for send endpoint to use
export { otpStore };

