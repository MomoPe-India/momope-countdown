import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

interface AuthState {
    token: string | null;
    user: any | null;
    isAuthenticated: boolean;
    isBiometricEnabled: boolean;
    lastMobileNumber: string | null; // For Smart Login
    setAuth: (token: string, user: any) => Promise<void>;
    setBiometric: (enabled: boolean) => void;
    logout: (forceFull?: boolean) => Promise<void>;
    loadToken: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            token: null,
            user: null,
            isAuthenticated: false,
            isBiometricEnabled: false,
            lastMobileNumber: null,

            setAuth: async (token, user) => {
                await SecureStore.setItemAsync('auth_token', token);
                // Also save mobile for convenience
                const mobile = user?.mobile ? String(user.mobile) : null;
                set((state) => ({
                    token,
                    user,
                    isAuthenticated: true,
                    lastMobileNumber: mobile || state.lastMobileNumber
                }));
            },

            setBiometric: (enabled) => set({ isBiometricEnabled: enabled }),

            logout: async (forceFull = false) => {
                const state = get();
                // 1. App Lock (Biometric Enabled + Not Forced)
                if (!forceFull && state.isBiometricEnabled && state.token && state.user) {
                    set({ isAuthenticated: false });
                    return;
                }

                // 2. Full Logout
                await SecureStore.deleteItemAsync('auth_token');
                set({
                    token: null,
                    user: null,
                    isAuthenticated: false,
                    // Persist isBiometricEnabled & lastMobileNumber
                });
            },

            loadToken: async () => {
                try {
                    const token = await SecureStore.getItemAsync('auth_token');
                    if (token) {
                        set({ token });
                    }
                } catch (error) {
                    console.error('Failed to load token', error);
                }
            }
        }),
        {
            name: 'auth-storage-v4', // Intecremented version
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                user: state.user,
                isBiometricEnabled: state.isBiometricEnabled,
                lastMobileNumber: state.lastMobileNumber,
                // Exclude token from AsyncStorage, we manage it manually via SecureStore
            }),
            onRehydrateStorage: () => (state) => {
                state?.loadToken();
            },
        }
    )
);
