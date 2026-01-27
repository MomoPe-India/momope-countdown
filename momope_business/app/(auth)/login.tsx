import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS } from '../../constants/theme';
import { authService } from '../../services/api';
import { useMerchantStore } from '../../store/merchantStore';
import { Feather } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';

export default function LoginScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const { lastMobileNumber, setAuth, isBiometricEnabled } = useMerchantStore();

    // Modes: 'MOBILE' (New/Switch) | 'PIN' (Existing)
    const [mode, setMode] = useState<'MOBILE' | 'PIN'>('MOBILE');
    const [mobile, setMobile] = useState('');
    const [pin, setPin] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Auto-detect existing merchant
        if (lastMobileNumber && params.mode !== 'register') {
            setMobile(lastMobileNumber);
            setMode('PIN');
        }
    }, [lastMobileNumber, params.mode]);

    // Strict Hybrid Model: No auto-biometric on Login Screen.
    // Biometric is reserved for UnlockScreen (Resume) only.

    const handleSendOtp = async () => {
        if (!mobile || mobile.length < 10) {
            Alert.alert('Invalid Mobile', 'Please enter a valid 10-digit number');
            return;
        }
        setLoading(true);
        try {
            const res = await authService.sendOtp(mobile, 'MERCHANT');
            if (res.data.success) {
                router.push({ pathname: '/(auth)/otp', params: { mobile } });
            } else {
                Alert.alert('Error', res.data.message || 'Failed to send OTP');
            }
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.message || 'Network Error');
        } finally {
            setLoading(false);
        }
    };

    const handlePinLogin = async () => {
        if (pin.length !== 4) {
            Alert.alert('Invalid PIN', 'Please enter your 4-digit PIN');
            return;
        }
        setLoading(true);
        try {
            const res = await authService.loginWithPin(mobile, pin, 'MERCHANT');
            if (res.data.success) {
                const { token, user } = res.data.data;
                // Assuming backend returns 'user' object, but store expects 'merchant'
                if (!token || !user) {
                    Alert.alert('Error', 'Invalid server response: Missing token.');
                    return;
                }

                // Ideally backend should return consistent structure.
                // For now, mapping user -> merchant if needed, or using as is.
                await setAuth(token, user);
                router.replace('/(tabs)/home');
            } else {
                Alert.alert('Login Failed', res.data.message);
            }
        } catch (error: any) {
            console.error('PIN Login Error:', error);
            Alert.alert('Error', error.response?.data?.message || 'Invalid PIN');
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
                            {mode === 'PIN' ? 'Welcome Back' : 'Merchant Partner'}
                        </Text>
                    </View>

                    <View style={styles.form}>
                        {mode === 'PIN' ? (
                            <>
                                <Text style={styles.greeting}>+91 {mobile}</Text>
                                <Text style={styles.label}>Enter 4-Digit PIN</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="••••"
                                    placeholderTextColor={COLORS.textTertiary}
                                    keyboardType="number-pad"
                                    maxLength={4}
                                    secureTextEntry
                                    value={pin}
                                    onChangeText={setPin}
                                    autoFocus
                                />
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={handlePinLogin}
                                    disabled={loading}
                                >
                                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Login</Text>}
                                </TouchableOpacity>

                                <View style={styles.links}>
                                    <TouchableOpacity onPress={() => router.push({ pathname: '/(auth)/otp', params: { mobile } })}>
                                        <Text style={styles.linkText}>Forgot PIN? Login with OTP</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={switchAccount} style={{ marginTop: SPACING.m }}>
                                        <Text style={[styles.linkText, { color: COLORS.primary }]}>Use another account</Text>
                                    </TouchableOpacity>
                                </View>
                            </>
                        ) : (
                            <>
                                <Text style={styles.label}>Mobile Number</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="90000 90000"
                                    placeholderTextColor={COLORS.textTertiary}
                                    keyboardType="number-pad"
                                    maxLength={10}
                                    value={mobile}
                                    onChangeText={setMobile}
                                />
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={handleSendOtp}
                                    disabled={loading}
                                >
                                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Get OTP</Text>}
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    inner: { flex: 1, justifyContent: 'center', padding: SPACING.l },
    header: { alignItems: 'center', marginBottom: SPACING.xxl },
    logo: { fontSize: FONT_SIZE.xxl, fontWeight: 'bold', color: COLORS.primary },
    subtitle: { fontSize: FONT_SIZE.m, color: COLORS.textSecondary, marginTop: SPACING.s },

    form: { width: '100%' },
    greeting: { fontSize: FONT_SIZE.l, color: COLORS.textPrimary, textAlign: 'center', marginBottom: SPACING.l, fontWeight: 'bold' },
    label: { color: COLORS.textSecondary, marginBottom: SPACING.s, fontWeight: '600' },
    input: {
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.m,
        padding: SPACING.m,
        color: COLORS.textPrimary,
        marginBottom: SPACING.l,
        fontSize: FONT_SIZE.l,
        letterSpacing: 1
    },
    button: { backgroundColor: COLORS.primary, padding: SPACING.m, borderRadius: BORDER_RADIUS.m, alignItems: 'center' },
    buttonText: { color: "#fff", fontWeight: 'bold', fontSize: FONT_SIZE.l },

    links: { alignItems: 'center', marginTop: SPACING.l },
    linkText: { color: COLORS.textTertiary, fontSize: FONT_SIZE.m }
});
