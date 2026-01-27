import axios from 'axios';
import { useAuthStore } from '../store/authStore';

import * as SecureStore from 'expo-secure-store';

// LAN IP for Physical Device & Emulator
const API_URL = 'http://192.168.55.101:5000/api';

const api = axios.create({
    baseURL: API_URL,
    timeout: 10000,
});

api.interceptors.request.use(async (config) => {
    let token = useAuthStore.getState().token;
    if (!token) {
        token = await SecureStore.getItemAsync('auth_token');
    }
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export const authService = {
    sendOtp: (mobile: string, role: string) => api.post('/auth/otp/send', { mobile, role }),
    verifyOtp: (mobile: string, otp: string, role: string) => api.post('/auth/otp/verify', { mobile, otp, role }),
    loginWithPin: (mobile: string, pin: string, role: string) => api.post('/auth/pin/login', { mobile, pin, role }),
};

export const userService = {
    getProfile: () => api.get('/customer/profile'),
    updatePin: (oldPin: string, newPin: string) => api.post('/auth/pin/update', { oldPin, newPin }),
};

export default api;
