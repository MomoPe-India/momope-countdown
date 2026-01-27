import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS } from '../../constants/theme';
import { authService } from '../../services/api';
import { useMerchantStore } from '../../store/merchantStore';

export default function OtpScreen() {
    const router = useRouter();
    const { mobile } = useLocalSearchParams();
    const [otp, setOtp] = useState(['', '', '', '', '', '']); // 6-digit OTP
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(30);
    const inputRefs = useRef<Array<TextInput | null>>([]);

    // Store
    const setAuth = useMerchantStore((state) => state.setAuth);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleChange = (text: string, index: number) => {
        if (text.length > 1) {
            // Handle paste logic if needed, for now simplistic
            return;
        }

        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        if (text && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleBackspace = (text: string, index: number) => {
        if (!text && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = async () => {
        const otpString = otp.join('');
        if (otpString.length !== 6) {
            Alert.alert('Invalid OTP', 'Please enter a 6-digit OTP');
            return;
        }

        setLoading(true);
        try {
            const res = await authService.verifyOtp(mobile as string, otpString, 'MERCHANT');

            if (res.data.success) {
                const { token, user } = res.data; // Backend returns 'user' object even for merchants

                if (!token || !user) {
                    Alert.alert('Error', 'Invalid server response: Missing token or user data.');
                    return;
                }

                // Store in Zustand
                await setAuth(token, user);

                // Check Onboarding
                if (user.onboarding_step === 'REGISTRATION' || !user.business_name) {
                    router.replace('/(auth)/setup-business');
                } else {
                    router.replace('/(tabs)/home');
                }
            } else {
                Alert.alert('Verification Failed', res.data.message || 'Invalid OTP');
            }
        } catch (error: any) {
            console.error(error);
            Alert.alert('Error', error.response?.data?.message || 'Network Error');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setTimer(30);
        await authService.sendOtp(mobile as string, 'MERCHANT');
        Alert.alert('Sent', 'OTP resent successfully');
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.inner}>
                    <StatusBar style="light" />

                    <View style={styles.header}>
                        <Text style={styles.title}>Verify Mobile</Text>
                        <Text style={styles.subtitle}>Enter OTP sent to +91 {mobile}</Text>
                    </View>

                    <View style={styles.otpContainer}>
                        {otp.map((digit, index) => (
                            <TextInput
                                key={index}
                                ref={(ref) => (inputRefs.current[index] = ref)}
                                style={[styles.otpInput, digit ? styles.otpInputFilled : null]}
                                keyboardType="number-pad"
                                maxLength={1}
                                value={digit}
                                onChangeText={(text) => handleChange(text, index)}
                                onKeyPress={({ nativeEvent }) => {
                                    if (nativeEvent.key === 'Backspace') {
                                        handleBackspace(digit, index);
                                    }
                                }}
                            />
                        ))}
                    </View>

                    <TouchableOpacity
                        style={[styles.button, loading && styles.disabled]}
                        onPress={handleVerify}
                        disabled={loading}
                    >
                        {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Verify</Text>}
                    </TouchableOpacity>

                    <View style={styles.resendContainer}>
                        <Text style={styles.resendText}>Didn't receive code? </Text>
                        <TouchableOpacity disabled={timer > 0} onPress={handleResend}>
                            <Text style={[styles.resendLink, timer > 0 && styles.disabledText]}>
                                {timer > 0 ? `Resend in ${timer}s` : 'Resend Now'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    inner: { flex: 1, padding: SPACING.l, justifyContent: 'center' },
    header: { marginBottom: SPACING.xl, alignItems: 'center' },
    title: { fontSize: FONT_SIZE.xl, color: COLORS.textPrimary, fontWeight: 'bold', marginBottom: SPACING.s },
    subtitle: { fontSize: FONT_SIZE.m, color: COLORS.textSecondary },

    otpContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.xl },
    otpInput: {
        width: 45, height: 55,
        borderWidth: 1, borderColor: COLORS.border, borderRadius: BORDER_RADIUS.m,
        color: COLORS.textPrimary, fontSize: FONT_SIZE.l, textAlign: 'center', backgroundColor: COLORS.surface
    },
    otpInputFilled: { borderColor: COLORS.primary, backgroundColor: COLORS.primary + '20' },

    button: {
        backgroundColor: COLORS.primary, height: 50, borderRadius: BORDER_RADIUS.m,
        justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.l
    },
    disabled: { opacity: 0.7 },
    buttonText: { color: '#FFF', fontSize: FONT_SIZE.l, fontWeight: 'bold' },

    resendContainer: { flexDirection: 'row', justifyContent: 'center' },
    resendText: { color: COLORS.textSecondary },
    resendLink: { color: COLORS.primary, fontWeight: 'bold' },
    disabledText: { color: COLORS.textTertiary }
});
