import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS } from '../../constants/theme';
import { useAuthStore } from '../../store/authStore';
import { authService } from '../../services/api';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { Ionicons } from '@expo/vector-icons';

export default function LoginScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { lastMobileNumber, isBiometricEnabled, setAuth } = useAuthStore();

    // Modes: MOBILE (OTP Flow) or PIN (Quick Login)
    const [mode, setMode] = useState<'MOBILE' | 'PIN'>('MOBILE');
    const [mobile, setMobile] = useState('');
    const [pin, setPin] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Auto-detect existing user
        if (lastMobileNumber && params.mode !== 'register') {
            setMobile(lastMobileNumber);
            setMode('PIN');
        }
    }, [lastMobileNumber, params.mode]);

    // Strict Hybrid Model: No auto-biometric on Login Screen.
    // Biometric is reserved for UnlockScreen (Resume) only.

    /* 
    useEffect(() => {
        if (mode === 'PIN' && isBiometricEnabled) {
            handleBiometricLogin();
        }
    }, [mode]);
    */

    const handleSendOtp = async () => {
        if (!mobile || mobile.length < 10) {
            Alert.alert('Invalid Number', 'Please enter a valid 10-digit mobile number.');
            return;
        }

        setLoading(true);
        try {
            const res = await authService.sendOtp(mobile, 'CUSTOMER');
            if (res.data.success) {
                router.push({ pathname: '/(auth)/otp', params: { mobile } });
            } else {
                Alert.alert('Error', res.data.message || 'Failed to send OTP');
            }
        } catch (error: any) {
            console.error('Login Error:', error);
            Alert.alert('Login Failed', error.response?.data?.message || 'Network Error');
        } finally {
            setLoading(false);
        }
    };

    const handlePinLogin = async () => {
        if (pin.length !== 4) {
            Alert.alert('Invalid PIN', 'Please enter your 4-digit PIN.');
            return;
        }

        setLoading(true);
        try {
            const res = await authService.loginWithPin(mobile, pin, 'CUSTOMER');
            if (res.data.success) {
                const { token, user } = res.data;
                await setAuth(token, user);
                router.replace('/(tabs)/home');
            } else {
                Alert.alert('Login Failed', res.data.message || 'Invalid PIN');
            }
        } catch (error: any) {
            console.error('PIN Login Error:', error);
            Alert.alert('Login Failed', error.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const handleBiometricLogin = async () => {
        try {
            const hasHardware = await LocalAuthentication.hasHardwareAsync();
            if (!hasHardware) return;

            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Login to MomoPe',
                disableDeviceFallback: false,
            });

            if (result.success) {
                setLoading(true);
                // Biometrics Verified -> Fetch Token from SecureStore
                const storedToken = await SecureStore.getItemAsync('auth_token');
                if (storedToken) {
                    // We need to fetch user profile since we only have the token
                    // But for now, let's try to just set the token and let Home fetch profile
                    // OR we can't really do this since setAuth needs user object.
                    // Actually, if we are here, it means we didn't logout fully (Switch Account),
                    // but the user wants to LOGIN. 

                    // Wait, correct "Smart Login" flow with biometrics usually requires a token exchange 
                    // or storing the PIN securely and re-submitting it.
                    // BUT, based on previous "Unlock" logic, we trusted the local token.
                    // Here, if it's a fresh app launch after "Logout-but-remember", the token is GONE from store.

                    // CRITICAL: We cannot login with BIOMETRICS ONLY unless we stored the token persistantly 
                    // OR we stored the PIN in SecureStore to replay it.

                    // For now, let's fall back to: Biometric success -> Auto-Unlock if token exists 
                    // OR prompt PIN if token is gone.

                    // Actually, if the user "Logged Out" (Standard), the token IS DELETED.
                    // So Biometric Login on "Login Screen" is impossible without a backend "Biometric Token".

                    // CHANGE OF PLAN: 
                    // Biometric on Login Screen (Cold Start after Logout) is tricky without backend support.
                    // I will DISABLE auto-biometric for now on this specific screen to avoid false hope,
                    // unless we implement the "Store PIN in SecureStore" strategy.

                    // Strategy: If Biometrics Enabled, we can store the PIN in SecureStore.
                    // But for this iteration, let's stick to PIN Login. Biometrics is for UNLOCKING (Resume).

                    Alert.alert('Biometrics', 'Please enter your PIN to login completely.');
                } else {
                    Alert.alert('Secure Login', 'Please use your PIN to login.');
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const switchAccount = () => {
        setMode('MOBILE');
        setMobile('');
        setPin('');
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.inner}>
                    <StatusBar style="light" />

                    <View style={styles.header}>
                        <Text style={styles.logo}>MomoPe</Text>
                        <Text style={styles.subtitle}>
                            {mode === 'PIN' ? 'Welcome Back!' : 'Pay & Earn Rewards'}
                        </Text>
                    </View>

                    {mode === 'MOBILE' ? (
                        // Mobile OTP Mode
                        <View style={styles.form}>
                            <Text style={styles.label}>Mobile Number</Text>
                            <View style={styles.inputContainer}>
                                <Text style={styles.prefix}>+91</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="80000 80000"
                                    placeholderTextColor={COLORS.textTertiary}
                                    keyboardType="number-pad"
                                    maxLength={10}
                                    value={mobile}
                                    onChangeText={setMobile}
                                    selectionColor={COLORS.primary}
                                />
                            </View>

                            <TouchableOpacity
                                style={[styles.button, loading && styles.buttonDisabled]}
                                onPress={handleSendOtp}
                                disabled={loading}
                            >
                                {loading ? <ActivityIndicator color={COLORS.textPrimary} /> : <Text style={styles.buttonText}>Continue</Text>}
                            </TouchableOpacity>
                        </View>
                    ) : (
                        // PIN Mode
                        <View style={styles.form}>
                            <Text style={styles.welcomeMobile}>+91 {mobile}</Text>

                            <Text style={styles.label}>Enter 4-Digit PIN</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="lock-closed-outline" size={20} color={COLORS.textTertiary} style={{ marginRight: 10 }} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="• • • •"
                                    placeholderTextColor={COLORS.textTertiary}
                                    keyboardType="number-pad"
                                    maxLength={4}
                                    value={pin}
                                    onChangeText={setPin}
                                    secureTextEntry
                                    selectionColor={COLORS.primary}
                                    autoFocus
                                />
                            </View>

                            <TouchableOpacity
                                style={[styles.button, loading && styles.buttonDisabled]}
                                onPress={handlePinLogin}
                                disabled={loading}
                            >
                                {loading ? <ActivityIndicator color={COLORS.textPrimary} /> : <Text style={styles.buttonText}>Login</Text>}
                            </TouchableOpacity>

                            {/* Biometric Button (Optional Hook) */}
                            {/* {isBiometricEnabled && (
                                <TouchableOpacity style={styles.bioButton} onPress={handleBiometricLogin}>
                                    <Ionicons name="finger-print" size={24} color={COLORS.primary} />
                                    <Text style={styles.bioText}>Use Biometrics</Text>
                                </TouchableOpacity>
                            )} */}

                            <View style={styles.actions}>
                                <TouchableOpacity onPress={() => setMode('MOBILE')}>
                                    <Text style={styles.linkText}>Login via OTP</Text>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={switchAccount}>
                                    <Text style={[styles.linkText, { color: COLORS.error }]}>Use another account</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}

                    <Text style={styles.footerText}>
                        By continuing, you agree to our Terms & Privacy Policy.
                    </Text>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    inner: {
        flex: 1,
        justifyContent: 'center',
        padding: SPACING.l,
    },
    header: {
        alignItems: 'center',
        marginBottom: SPACING.xxl,
    },
    logo: {
        fontSize: FONT_SIZE.xxl,
        fontWeight: 'bold',
        color: COLORS.primary,
        letterSpacing: -1,
    },
    subtitle: {
        fontSize: FONT_SIZE.m,
        color: COLORS.textSecondary,
        marginTop: SPACING.s,
    },
    form: {
        width: '100%',
    },
    label: {
        fontSize: FONT_SIZE.s,
        color: COLORS.textSecondary,
        marginBottom: SPACING.s,
        fontWeight: '600',
    },
    welcomeMobile: {
        fontSize: FONT_SIZE.xl,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        textAlign: 'center',
        marginBottom: SPACING.l,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.m,
        borderWidth: 1,
        borderColor: COLORS.border,
        paddingHorizontal: SPACING.m,
        height: 56,
        marginBottom: SPACING.l,
    },
    prefix: {
        fontSize: FONT_SIZE.l,
        color: COLORS.textPrimary,
        marginRight: SPACING.s,
        fontWeight: '500',
    },
    input: {
        flex: 1,
        fontSize: FONT_SIZE.l,
        color: COLORS.textPrimary,
        height: '100%',
    },
    button: {
        backgroundColor: COLORS.primary,
        height: 56,
        borderRadius: BORDER_RADIUS.m,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        color: COLORS.textPrimary,
        fontSize: FONT_SIZE.l,
        fontWeight: 'bold',
    },
    bioButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: SPACING.m,
        padding: SPACING.s,
    },
    bioText: {
        color: COLORS.primary,
        marginLeft: SPACING.s,
        fontWeight: '600',
    },
    actions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: SPACING.l,
    },
    linkText: {
        color: COLORS.textTertiary,
        fontSize: FONT_SIZE.s,
        textDecorationLine: 'underline',
    },
    footerText: {
        textAlign: 'center',
        color: COLORS.textTertiary,
        fontSize: FONT_SIZE.xs,
        marginTop: SPACING.l,
        position: 'absolute',
        bottom: SPACING.l,
        left: 0,
        right: 0,
    },
});
