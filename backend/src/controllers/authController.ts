import { Request, Response } from 'express';
import { supabase } from '../config/supabaseClient'; // Use Supabase Client
import { generateToken } from '../utils/jwt';
import bcrypt from 'bcryptjs';

// MOCK CONSTANTS
const MOCK_OTP = '123456';

export const sendOtp = async (req: Request, res: Response) => {
    const { mobile, role } = req.body;

    if (!mobile || !role) {
        return res.status(400).json({ error: 'Mobile and Role are required' });
    }

    if (role !== 'MERCHANT' && role !== 'CUSTOMER') {
        return res.status(400).json({ error: 'Invalid role. Must be MERCHANT or CUSTOMER' });
    }

    // Check if user exists
    const { data: users, error } = await supabase
        .from('users')
        .select('*')
        .eq('mobile', mobile);

    if (error) {
        console.error('Supabase Error (sendOtp):', error);
        return res.status(500).json({ error: 'Database error' });
    }

    if (users.length === 0) {
        // New User logic (placeholder)
    }

    // In production, integrate SMS gateway here
    console.log(`[MOCK SMS] OTP for ${mobile} is ${MOCK_OTP}`);

    res.json({ message: 'OTP sent successfully', mockOtp: MOCK_OTP });
};

export const verifyOtp = async (req: Request, res: Response) => {
    const { mobile, otp, role } = req.body;

    if (otp !== MOCK_OTP) {
        return res.status(400).json({ error: 'Invalid OTP' });
    }

    if (role !== 'MERCHANT' && role !== 'CUSTOMER') {
        return res.status(400).json({ error: 'Invalid role. Must be MERCHANT or CUSTOMER' });
    }

    try {
        // Find User
        let user;
        const { data: existingUsers, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('mobile', mobile);

        if (fetchError) throw fetchError;

        if (existingUsers.length === 0) {
            // Create New User
            const { data: newUsers, error: insertError } = await supabase
                .from('users')
                .insert({ mobile, role })
                .select();

            if (insertError) throw insertError;
            user = newUsers[0];

            // Create Profile based on Role
            if (role === 'CUSTOMER') {
                await supabase.from('customers').insert({
                    user_id: user.id,
                    full_name: 'New Customer'
                });
            } else if (role === 'MERCHANT') {
                await supabase.from('merchants').insert({
                    user_id: user.id,
                    business_name: 'New Business',
                    commission_rate: 5.0
                });
            }
        } else {
            user = existingUsers[0];
            // Check role match
            if (user.role !== role) {
                return res.status(403).json({ error: 'Mobile number registered with different role' });
            }
        }

        // SELF-REPAIR: Ensure profile exists
        if (role === 'CUSTOMER') {
            const { data: profiles } = await supabase.from('customers').select('*').eq('user_id', user.id);
            if (!profiles || profiles.length === 0) {
                await supabase.from('customers').insert({ user_id: user.id, full_name: 'New Customer' });
            }
        } else if (role === 'MERCHANT') {
            const { data: profiles } = await supabase.from('merchants').select('*').eq('user_id', user.id);
            if (!profiles || profiles.length === 0) {
                await supabase.from('merchants').insert({ user_id: user.id, business_name: 'New Business', commission_rate: 5.0 });
            }
        }

        // Generate Token
        // NOTE: Standard JWT generation stays the same
        const token = generateToken(user.id, user.role);

        // Create Session
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30); // 30 days

        await supabase.from('sessions').insert({
            user_id: user.id,
            token: token,
            expires_at: expiresAt
        });

        // Fetch Profile Status
        let onboarding_step = 'REGISTRATION';
        let business_name = null;

        // Initialize profile data
        let full_name = null;

        if (role === 'MERCHANT') {
            const { data: merchantProfile } = await supabase
                .from('merchants')
                .select('is_onboarding_complete, business_name')
                .eq('user_id', user.id)
                .single();

            if (merchantProfile?.is_onboarding_complete) {
                onboarding_step = 'COMPLETED';
            }
            business_name = merchantProfile?.business_name;
        } else if (role === 'CUSTOMER') {
            const { data: customerProfile } = await supabase
                .from('customers')
                .select('full_name')
                .eq('user_id', user.id)
                .single();

            // If name is set, consider onboarding complete
            if (customerProfile?.full_name && customerProfile.full_name !== 'New Customer') {
                onboarding_step = 'COMPLETED';
                full_name = customerProfile.full_name;
            }
        }

        res.json({
            token,
            user: {
                id: user.id,
                mobile: user.mobile,
                role: user.role,
                is_pin_set: !!user.pin_hash,
                onboarding_step,
                full_name, // Include full_name for Customer App Persistence
                business_name
            }
        });

    } catch (e: any) {
        console.error('Verify OTP Error:', e);
        res.status(500).json({ error: 'Login failed: ' + e.message });
    }
};

export const setPin = async (req: Request, res: Response) => {
    const { userId, pin } = req.body;

    if (!pin || pin.length < 4) {
        return res.status(400).json({ error: 'Invalid PIN' });
    }

    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(pin, salt);

        const { error } = await supabase
            .from('users')
            .update({ pin_hash: hash })
            .eq('id', userId);

        if (error) throw error;

        res.json({ message: 'PIN set successfully' });
    } catch (e: any) {
        console.error(e);
        res.status(500).json({ error: 'Failed to set PIN' });
    }
};

export const verifyPin = async (req: Request, res: Response) => {
    const { userId, pin } = req.body;

    try {
        const { data: users, error } = await supabase
            .from('users')
            .select('pin_hash')
            .eq('id', userId);

        if (error) throw error;

        if (!users || users.length === 0 || !users[0].pin_hash) {
            return res.status(400).json({ error: 'PIN not set' });
        }

        const isValid = await bcrypt.compare(pin, users[0].pin_hash);

        if (!isValid) {
            return res.status(401).json({ error: 'Incorrect PIN' });
        }

        res.json({ success: true });
    } catch (e: any) {
        console.error(e);
        res.status(500).json({ error: 'Verification failed' });
    }
};

export const loginWithPin = async (req: Request, res: Response) => {
    const { mobile, pin, role } = req.body;

    if (!mobile || !pin) {
        return res.status(400).json({ error: 'Mobile and PIN are required' });
    }

    // STRICT: Role is required for context security
    if (!role || (role !== 'MERCHANT' && role !== 'CUSTOMER')) {
        return res.status(400).json({ error: 'Valid Role is required for login' });
    }

    try {
        const { data: users, error } = await supabase
            .from('users')
            .select('*')
            .eq('mobile', mobile);

        if (error) throw error;

        if (!users || users.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = users[0];

        if (!user.pin_hash) {
            return res.status(400).json({ error: 'PIN not set. Please login with OTP.' });
        }

        // Validate Role (Mandatory Match)
        if (user.role !== role) {
            return res.status(403).json({ error: `Mobile number is registered as ${user.role}, not ${role}` });
        }

        // Verify PIN
        const isValid = await bcrypt.compare(pin, user.pin_hash);
        if (!isValid) {
            return res.status(401).json({ error: 'Incorrect PIN' });
        }

        // Generate Token
        const token = generateToken(user.id, user.role);

        // Create Session
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);

        await supabase.from('sessions').insert({
            user_id: user.id,
            token: token,
            expires_at: expiresAt
        });

        // Fetch Merchant Profile for Onboarding Status
        // Fetch Profile Status & Business Name
        let onboarding_step = 'REGISTRATION';
        let full_name = null;
        let business_name = null;

        if (role === 'MERCHANT') {
            const { data: merchantProfile } = await supabase
                .from('merchants')
                .select('is_onboarding_complete, business_name')
                .eq('user_id', user.id)
                .single();

            onboarding_step = merchantProfile?.is_onboarding_complete ? 'COMPLETED' : 'REGISTRATION';
            business_name = merchantProfile?.business_name;
        } else if (role === 'CUSTOMER') {
            const { data: customerProfile } = await supabase
                .from('customers')
                .select('full_name')
                .eq('user_id', user.id)
                .single();

            if (customerProfile?.full_name && customerProfile.full_name !== 'New Customer') {
                onboarding_step = 'COMPLETED';
                full_name = customerProfile.full_name;
            }
        }

        res.json({
            token,
            user: {
                id: user.id,
                mobile: user.mobile,
                role: user.role,
                is_pin_set: true,
                onboarding_step,
                full_name,
                business_name
            }
        });
    } catch (e: any) {
        console.error(e);
        res.status(500).json({ error: 'Login failed' });
    }
};
