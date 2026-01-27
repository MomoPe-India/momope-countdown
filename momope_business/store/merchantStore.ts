import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

interface MerchantState {
    token: string | null;
    merchant: any | null;
    isAuthenticated: boolean;
    isBiometricEnabled: boolean;
    lastMobileNumber: string | null;

    setAuth: (token: string, merchant: any) => Promise<void>;
    setBiometric: (enabled: boolean) => void;
    logout: (forceFull?: boolean) => Promise<void>;
    loadToken: () => Promise<void>;
}

export const useMerchantStore = create<MerchantState>()(
    persist(
        (set, get) => ({
            token: null,
            merchant: null,
            isAuthenticated: false,
            isBiometricEnabled: false,
            lastMobileNumber: null,

            setAuth: async (token, merchant) => {
                await SecureStore.setItemAsync('merchant_token', token);
                const mobile = merchant?.mobile ? String(merchant.mobile) : null;
                set((state) => ({
                    token,
                    merchant,
                    isAuthenticated: true,
                    lastMobileNumber: mobile || state.lastMobileNumber
                }));
            },

            setBiometric: (enabled) => set({ isBiometricEnabled: enabled }),

            logout: async (forceFull = false) => {
                const state = get();
                // 1. App Lock (Biometric Enabled + Not Forced)
                if (!forceFull && state.isBiometricEnabled && state.token && state.merchant) {
                    set({ isAuthenticated: false }); // Just hide UI
                    return;
                }

                // 2. Full Logout
                await SecureStore.deleteItemAsync('merchant_token');
                set({
                    token: null,
                    merchant: null,
                    isAuthenticated: false,
                    // Persist isBiometricEnabled & lastMobileNumber
                });
            },

            loadToken: async () => {
                try {
                    const token = await SecureStore.getItemAsync('merchant_token');
                    if (token) {
                        set({ token });
                    }
                } catch (error) {
                    console.error('Failed to load merchant token', error);
                }
            }
        }),
        {
            name: 'merchant-storage-v1', // Bump version if needed
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                merchant: state.merchant,
                isBiometricEnabled: state.isBiometricEnabled,
                lastMobileNumber: state.lastMobileNumber,
                // Exclude token, it's in SecureStore
            }),
            onRehydrateStorage: () => (state) => {
                state?.loadToken();
            },
        }
    )
);
