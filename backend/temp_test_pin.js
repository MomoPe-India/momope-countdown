"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const API_URL = 'http://localhost:3000';
async function testPinFlow() {
    console.log('Testing PIN Flow...');
    try {
        // 1. Send OTP
        console.log('1. Sending OTP...');
        await axios_1.default.post(`${API_URL}/auth/otp/send`, { mobile: '9988776655', role: 'CUSTOMER' });
        // 2. Verify OTP
        console.log('2. Verifying OTP...');
        const verifyRes = await axios_1.default.post(`${API_URL}/auth/otp/verify`, { mobile: '9988776655', otp: '123456', role: 'CUSTOMER' });
        const user = verifyRes.data.user;
        const userId = user.id;
        console.log('   User ID:', userId);
        // 3. Set PIN
        console.log('3. Setting PIN...');
        await axios_1.default.post(`${API_URL}/auth/pin/set`, { userId: userId, pin: '9999' });
        console.log('   PIN Set.');
        // 4. Verify PIN (Unlock mode)
        console.log('4. Verifying PIN (Local)...');
        await axios_1.default.post(`${API_URL}/auth/pin/verify`, { userId: userId, pin: '9999' });
        console.log('   PIN Verified.');
        // 5. Login with PIN
        console.log('5. Login with PIN (Remote)...');
        const loginRes = await axios_1.default.post(`${API_URL}/auth/pin/login`, { mobile: '9988776655', pin: '9999', role: 'CUSTOMER' });
        console.log('   Login Successful. Token:', loginRes.data.token ? 'YES' : 'NO');
        console.log('✅ ALL TESTS PASSED');
    }
    catch (error) {
        console.error('❌ TEST FAILED:', error.response?.data || error.message);
    }
}
testPinFlow();
