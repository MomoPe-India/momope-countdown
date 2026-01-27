const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase Credentials in .env');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// --- Auth Routes ---

app.post('/auth/otp/send', (req, res) => {
    const { mobile, role } = req.body;
    console.log(`[OTP] Sending to ${mobile} (${role})`);
    // Mock OTP
    res.json({ success: true, message: 'OTP sent', data: { otp: '123456' } });
});

app.post('/auth/otp/verify', async (req, res) => {
    const { mobile, otp, role } = req.body;
    console.log(`[OTP] Verifying ${mobile} code ${otp}`);

    if (otp !== '123456') {
        return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    const email = `${mobile}@momope.local`;
    const dummyPassword = `MomoPe@${mobile}`;

    try {
        console.log(`[Auth] Attempting login with email: ${email}`);

        let { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
            email: email,
            password: dummyPassword
        });

        if (signInError) {
            console.log('Sign in failed, creating new user...');

            // Check if user exists but with different password (optional, but good for stability)
            // For now, just try create
            const { data: createData, error: createError } = await supabase.auth.admin.createUser({
                email: email,
                password: dummyPassword,
                email_confirm: true,
                user_metadata: { role, mobile, phone: mobile } // Store mobile in metadata
            });

            if (createError) {
                console.error('Create User Error:', createError);
                // If user already exists (e.g. created via dashboard manually), verify password
                if (createError.code === 'email_exists') {
                    // Check strictly if we can get ID to reset password?
                    // We can't easily get ID without Admin List Users which is slow, BUT
                    // let's try to just sign in again, maybe it was a transient error?
                    // or actually, if email exists, we should have signed in above.
                    // The only case is if password changed.
                }
                throw createError;
            }

            console.log('User created, signing in...');
            const signInRes = await supabase.auth.signInWithPassword({ email, password: dummyPassword });
            if (signInRes.error) throw signInRes.error;
            authData = signInRes.data;
        }

        const user = authData.user;

        // Sync to public.users
        const { data: existingProfile } = await supabase.from('users').select('*').eq('id', user.id).single();

        if (!existingProfile) {
            await supabase.from('users').insert({
                id: user.id,
                mobile: mobile,
                role: role,
                created_at: new Date().toISOString()
            });
        }

        let onboarding_step = 'REGISTRATION';
        if (existingProfile?.business_name) onboarding_step = 'DASHBOARD';

        console.log('Login Successful');

        res.json({
            success: true,
            token: authData.session.access_token,
            user: {
                id: user.id,
                mobile,
                role,
                onboarding_step,
                ...existingProfile
            }
        });

    } catch (e) {
        console.error(e);
        res.status(500).json({ success: false, message: 'Server Error: ' + e.message });
    }
});

app.post('/auth/pin/login', async (req, res) => {
    const { mobile, pin } = req.body;
    console.log(`[PIN] Login ${mobile}`);

    try {
        const { data: userRecord } = await supabase.from('users').select('*').eq('mobile', mobile).single();
        if (!userRecord || String(userRecord.pin) !== String(pin)) {
            return res.status(403).json({ success: false, message: 'Invalid PIN' });
        }

        const email = `${mobile}@momope.local`;
        const dummyPassword = `MomoPe@${mobile}`;
        const { data: authData } = await supabase.auth.signInWithPassword({ email, password: dummyPassword });

        console.log('PIN Login Successful');
        res.json({
            success: true,
            token: authData.session.access_token,
            user: { ...userRecord, ...authData.user }
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ success: false });
    }
});

// --- Merchant Routes ---
app.get('/merchant/profile', async (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ success: false });

    // Validate token
    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error || !user) return res.status(401).json({ success: false });

    const { data: profile } = await supabase.from('users').select('*').eq('id', user.id).single();

    let onboarding_step = 'REGISTRATION';
    if (profile?.business_name) onboarding_step = 'DASHBOARD';

    res.json({ success: true, data: { profile, onboarding_step } });
});

app.post('/merchant/onboard', async (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    const { data: { user } } = await supabase.auth.getUser(token);
    if (!user) return res.status(401).send();

    const { business_name, owner_name, email } = req.body;
    await supabase.from('users').update({ business_name, full_name: owner_name, email }).eq('id', user.id);
    res.json({ success: true });
});

// Start
app.listen(port, '0.0.0.0', () => {
    console.log(`API Server running on port ${port}`);
});
