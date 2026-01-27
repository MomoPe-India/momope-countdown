import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS } from '../../constants/theme';
import { userService } from '../../services/api'; // We'll assume userService.updateProfile exists or we use api.post
import api from '../../services/api';
import { useAuthStore } from '../../store/authStore';

export default function SetupProfileScreen() {
    const router = useRouter();
    const { user, token, setAuth, logout } = useAuthStore();

    // Form State
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [pin, setPin] = useState('');
    const [loading, setLoading] = useState(false);

    // Verify or Fetch Session on Mount
    React.useEffect(() => {
        if (!user || !token) {
            console.log('User data missing in Setup. Waiting for user input or manual reset.');
            // fetchProfile(); // DISABLE: Causing 401 loop for new users. Rely on manual Logout if stuck.
        }
    }, [user, token]);

    const fetchProfile = async () => {
        try {
            setLoading(true);
            const res = await userService.getProfile();
            if (res.data.success) {
                const currentToken = useAuthStore.getState().token;
                if (currentToken) {
                    const profileData = res.data.data.profile;
                    // Note: Coins might be missing via this route if not initialized, but handle gracefully
                    const coinsData = res.data.data.coins || { balance_available: 0 };
                    const combinedUser = { ...profileData, wallet_balance: coinsData.balance_available };
                    setAuth(currentToken, combinedUser);
                }
            } else {
                throw new Error('Profile fetch failed');
            }
        } catch (error: any) {
            console.error('Session restore attempt:', error);

            // CRITICAL FIX: 
            // 404 means "User Not Found" -> This is EXPECTED for a new user!
            // We should only Logout if it's 401 (Unauthorized - i.e., Bad Token)
            if (error.response && error.response.status === 404) {
                console.log('User profile not found (404). This is a new user. Staying on Setup Screen.');
                return; // Allow user to fill the form!
            }

            // For other errors (401, 500), we might need to re-login
            if (error.response && error.response.status === 401) {
                logout();
                Alert.alert('Session Expired', 'Please login again.', [
                    { text: 'OK', onPress: () => router.replace('/(auth)/login') }
                ]);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        console.log('Attempting Save with:', { fullName, email, pin: pin.length, token: !!token, mobile: user?.mobile });

        if (!user || !token) {
            Alert.alert('Error', 'User session invalid. Please re-login.');
            router.replace('/(auth)/login');
            return;
        }

        if (!fullName.trim() || !email.trim() || pin.length !== 4) {
            Alert.alert('Incomplete Details', 'Please fill all fields correctly. PIN must be 4 digits.');
            return;
        }

        setLoading(true);
        try {
            // 1. Update Profile (Name & Email)
            // Using POST /customer/profile as seen in backend route
            const updateRes = await api.post('/customer/profile', {
                full_name: fullName,
                email: email
            });

            if (!updateRes.data.success) {
                throw new Error(updateRes.data.message || 'Failed to update profile');
            }

            // 3. Set PIN
            const pinRes = await api.post('/auth/pin/set', {
                mobile: user.mobile,
                pin: pin,
                role: 'CUSTOMER'
            });

            if (!pinRes.data.success) {
                throw new Error(pinRes.data.message || 'Failed to set PIN');
            }

            // 4. Synchronization: Fetch fresh profile to ensure Store matches Backend
            // This is critical so _layout.tsx sees 'full_name' and lets us into Home
            await fetchProfile();

            Alert.alert('Success', 'Profile Setup Complete!', [
                { text: 'OK', onPress: () => router.replace('/(tabs)/home') }
            ]);

        } catch (error: any) {
            console.error('Setup Error:', error);
            const msg = error.response?.data?.message || error.message || 'Network Error';
            Alert.alert('Error', msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.inner}>
                    <StatusBar style="light" />

                    <View style={styles.header}>
                        <View>
                            <Text style={styles.title}>Setup Profile</Text>
                            <Text style={styles.subtitle}>Let's get to know you better</Text>
                        </View>
                        <TouchableOpacity onPress={() => {
                            logout();
                            router.replace('/(auth)/login');
                        }} style={styles.logoutBtn}>
                            <Feather name="log-out" size={24} color={COLORS.error} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.form}>
                        {/* Name Input */}
                        <Text style={styles.label}>Full Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="John Doe"
                            placeholderTextColor={COLORS.textTertiary}
                            value={fullName}
                            onChangeText={setFullName}
                        />

                        {/* Email Input */}
                        <Text style={styles.label}>Email Address</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="john@example.com"
                            placeholderTextColor={COLORS.textTertiary}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={email}
                            onChangeText={setEmail}
                        />

                        {/* PIN Input */}
                        <Text style={styles.label}>Create 4-Digit Security PIN</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="••••"
                            placeholderTextColor={COLORS.textTertiary}
                            keyboardType="number-pad"
                            secureTextEntry
                            maxLength={4}
                            value={pin}
                            onChangeText={setPin}
                        />

                        <TouchableOpacity
                            style={[styles.button, loading && styles.buttonDisabled]}
                            onPress={handleSave}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color={COLORS.textPrimary} />
                            ) : (
                                <Text style={styles.buttonText}>Complete Setup</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

import { Feather } from '@expo/vector-icons';
// ... imports

// Update styles
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    inner: { flex: 1, justifyContent: 'center', padding: SPACING.l },
    header: {
        marginBottom: SPACING.xxl,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start'
    },
    logoutBtn: {
        padding: SPACING.s,
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.m,
        borderWidth: 1,
        borderColor: COLORS.border
    },
    title: { fontSize: FONT_SIZE.xxl, fontWeight: 'bold', color: COLORS.primary, marginBottom: SPACING.s },
    subtitle: { fontSize: FONT_SIZE.m, color: COLORS.textSecondary },
    form: { width: '100%' },
    label: { fontSize: FONT_SIZE.s, color: COLORS.textSecondary, marginBottom: SPACING.s, fontWeight: '600' },
    input: {
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.m,
        borderWidth: 1,
        borderColor: COLORS.border,
        padding: SPACING.m,
        color: COLORS.textPrimary,
        fontSize: FONT_SIZE.m,
        marginBottom: SPACING.l,
    },
    button: {
        backgroundColor: COLORS.primary,
        height: 56,
        borderRadius: BORDER_RADIUS.m,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: SPACING.m,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonDisabled: { opacity: 0.7 },
    buttonText: { color: COLORS.textPrimary, fontSize: FONT_SIZE.l, fontWeight: 'bold' },
});
