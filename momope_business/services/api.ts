import axios from 'axios';
import { Platform } from 'react-native';

// LAN IP for Physical Device & Emulator
const API_URL = 'http://192.168.55.101:3000/api';

const api = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

export const authService = {
    sendOtp: (mobile: string, role: 'CUSTOMER' | 'MERCHANT' | 'SALES') => api.post('/auth/otp/send', { mobile, role }),
    verifyOtp: (mobile: string, otp: string, role: string) => api.post('/auth/otp/verify', { mobile, otp, role }),
};

export const merchantService = {
    getProfile: () => api.get('/merchant/profile'), // Will need to implement this endpoint if missing
    updateProfile: (data: any) => api.post('/merchant/profile', data),
    getTransactions: () => api.get('/merchant/transactions'),
};

// Interceptor to inject token
import { useMerchantStore } from '../store/merchantStore'; // We will create this next

api.interceptors.request.use(async (config) => {
    const token = useMerchantStore.getState().token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
