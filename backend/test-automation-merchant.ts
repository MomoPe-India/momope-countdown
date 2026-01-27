import axios from 'axios';
import dotenv from 'dotenv';
import { supabase } from './src/config/supabaseClient';

dotenv.config();

const API_URL = `http://localhost:${process.env.PORT || 3000}`;
const TEST_MOBILE = '9999999999';
const TEST_OTP = '123456';
const TEST_PIN = '1234';

async function runTest() {
    console.log('🚀 Starting Automation Test for Merchant App Flow...\n');

    try {
        // 1. Cleanup Old Test Data
        console.log('🧹 Cleaning up old test data...');
        const { data: user } = await supabase.from('users').select('id').eq('mobile', TEST_MOBILE).maybeSingle();
        if (user) {
            await supabase.from('merchants').delete().eq('user_id', user.id);
            await supabase.from('users').delete().eq('id', user.id);
            console.log('   Found and deleted old test user.');
        } else {
            console.log('   No old test user found.');
        }

        // 2. Send OTP
        console.log('\n📡 STEP 1: Send OTP');
        const sendOtpRes = await axios.post(`${API_URL}/auth/otp/send`, {
            mobile: TEST_MOBILE,
            role: 'MERCHANT'
        });
        console.log('   ✅ OTP Sent:', sendOtpRes.data);

        // 3. Verify OTP (Login/Signup)
        console.log('\n🔐 STEP 2: Verify OTP (Signup/Login)');
        const verifyRes = await axios.post(`${API_URL}/auth/otp/verify`, {
            mobile: TEST_MOBILE,
            otp: TEST_OTP,
            role: 'MERCHANT'
        });
        const token = verifyRes.data.token;
        const userId = verifyRes.data.user.id;
        console.log('   ✅ Logged In. User ID:', userId);
        console.log('   🔑 Token obtained.');

        // 4. Set PIN
        console.log('\n📌 STEP 3: Set PIN');
        await axios.post(`${API_URL}/auth/pin/set`, {
            userId: userId,
            pin: TEST_PIN
        }, { headers: { Authorization: `Bearer ${token}` } });
        console.log('   ✅ PIN Set to', TEST_PIN);

        // 5. Login with PIN
        console.log('\n🔢 STEP 4: Login with PIN');
        const pinLoginRes = await axios.post(`${API_URL}/auth/pin/login`, {
            mobile: TEST_MOBILE,
            pin: TEST_PIN,
            role: 'MERCHANT'
        });
        const pinToken = pinLoginRes.data.token;
        console.log('   ✅ PIN Login Successful. New Token obtained.');

        // 6. Get Profile (Initially Empty/New)
        console.log('\n👤 STEP 5: Fetch Initial Profile');
        const profileRes = await axios.get(`${API_URL}/merchant/profile`, {
            headers: { Authorization: `Bearer ${pinToken}` }
        });
        console.log('   ℹ️  Current Profile Status:', profileRes.data.onboarding_step);
        if (profileRes.data.onboarding_step !== 'REGISTRATION') {
            console.warn('   ⚠️  Expected REGISTRATION step for new user.');
        } else {
            console.log('   ✅ Correctly in REGISTRATION step.');
        }

        // 7. Create/Update Profile
        console.log('\n📝 STEP 6: Complete Registration (Create Profile)');
        const updateRes = await axios.post(`${API_URL}/merchant/onboard`, {
            business_name: 'Automation Test Biz',
            full_name: 'Test Robot',
            email: 'robot@momope.dev',
            commission_rate: 15
        }, {
            headers: { Authorization: `Bearer ${pinToken}` }
        });
        console.log('   ✅ Profile Updated:', updateRes.data.profile.business_name);

        // 8. Fetch Profile Again
        console.log('\n🔍 STEP 7: Verify Profile Persistence');
        const finalProfileRes = await axios.get(`${API_URL}/merchant/profile`, {
            headers: { Authorization: `Bearer ${pinToken}` }
        });
        const p = finalProfileRes.data.profile;
        console.log(`   ✅ Fetched: ${p.business_name} (${p.full_name})`);

        if (p.business_name === 'Automation Test Biz' && p.full_name === 'Test Robot') {
            console.log('   ✅ DATA INTEGRITY VERIFIED.');
        } else {
            throw new Error('Data mismatch in fetched profile.');
        }

        console.log('\n🎉 Automation Test Completed Successfully!');

    } catch (error: any) {
        console.error('\n❌ Test Failed:', error.message);
        if (error.response) {
            console.error('   Status:', error.response.status);
            console.error('   Data:', error.response.data);
        }
    }
}

runTest();
