
import axios from 'axios';

const API_URL = 'http://localhost:3000';

async function testPinFlow() {
    console.log('Testing PIN Flow...');

    try {
        // 1. Send OTP
        console.log('1. Sending OTP...');
        await axios.post(`${API_URL}/auth/otp/send`, { mobile: '9988776655', role: 'CUSTOMER' });

        // 2. Verify OTP
        console.log('2. Verifying OTP...');
        const verifyRes = await axios.post(`${API_URL}/auth/otp/verify`, { mobile: '9988776655', otp: '123456', role: 'CUSTOMER' });
        const user = verifyRes.data.user;
        const userId = user.id;
        console.log('   User ID:', userId);

        // 3. Set PIN
        console.log('3. Setting PIN...');
        await axios.post(`${API_URL}/auth/pin/set`, { userId: userId, pin: '9999' }); // This endpoint might fail if token is needed? No, it takes userId directly.
        console.log('   PIN Set.');

        // 4. Verify PIN (Unlock mode)
        console.log('4. Verifying PIN (Local)...');
        await axios.post(`${API_URL}/auth/pin/verify`, { userId: userId, pin: '9999' });
        console.log('   PIN Verified.');

        // 5. Login with PIN
        console.log('5. Login with PIN (Remote)...');
        const loginRes = await axios.post(`${API_URL}/auth/pin/login`, { mobile: '9988776655', pin: '9999', role: 'CUSTOMER' });
        console.log('   Login Successful. Token:', loginRes.data.token ? 'YES' : 'NO');

        console.log('✅ ALL TESTS PASSED');
    } catch (error: any) {
        console.error('❌ TEST FAILED:', error.response?.data || error.message);
    }
}

testPinFlow();
