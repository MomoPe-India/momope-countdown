import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS } from '../../constants/theme';
import { authService } from '../../services/api';
import { useAuthStore } from '../../store/authStore';

export default function OtpScreen() {
    const router = useRouter();
    const { mobile } = useLocalSearchParams();
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const { setAuth } = useAuthStore();

    const handleVerifyOtp = async () => {
        if (!otp || otp.length !== 6) {
            Alert.alert('Invalid OTP', 'Please enter a valid 6-digit OTP.');
            return;
        }

        setLoading(true);
        try {
            const res = await authService.verifyOtp(mobile as string, otp, 'CUSTOMER');
            if (res.data.success) {
                const { token, user } = res.data;
                console.log('OTP Verify Success. Token:', token ? 'Present' : 'Missing');
                console.log('User Object:', JSON.stringify(user, null, 2));

                setAuth(token, user);

                // Verify store update immediately
                const currentStore = useAuthStore.getState();
                console.log('Immediate Store State:', {
                    token: !!currentStore.token,
                    user: !!currentStore.user
                });

                // Check onboarding status from backend
                if (user.onboarding_step === 'REGISTRATION' || !user.full_name) {
                    router.replace('/(auth)/setup-profile');
                } else {
                    router.replace('/(tabs)/home');
                }
            } else {
                Alert.alert('Error', res.data.message || 'Invalid OTP');
            }
        } catch (error: any) {
            console.error('OTP Verify Error:', error);
            const msg = error.response?.data?.message || 'Verification Failed';
            Alert.alert('Error', msg);
        } finally {
            setLoading(false);
        }
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
                        <Text style={styles.title}>Verify OTP</Text>
                        <Text style={styles.subtitle}>Enter the 6-digit code sent to +91 {mobile}</Text>
                    </View>

                    <View style={styles.form}>
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="000000"
                                placeholderTextColor={COLORS.textTertiary}
                                keyboardType="number-pad"
                                maxLength={6}
                                value={otp}
                                onChangeText={setOtp}
                                selectionColor={COLORS.primary}
                                autoFocus
                            />
                        </View>

                        <TouchableOpacity
                            style={[styles.button, loading && styles.buttonDisabled]}
                            onPress={handleVerifyOtp}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color={COLORS.textPrimary} />
                            ) : (
                                <Text style={styles.buttonText}>Verify & Continue</Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                            <Text style={styles.backButtonText}>Change Mobile Number</Text>
                        </TouchableOpacity>
                    </View>
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
    title: {
        fontSize: FONT_SIZE.xxl,
        fontWeight: 'bold',
        color: COLORS.primary,
        marginBottom: SPACING.s,
    },
    subtitle: {
        fontSize: FONT_SIZE.m,
        color: COLORS.textSecondary,
    },
    form: {
        width: '100%',
    },
    inputContainer: {
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.m,
        borderWidth: 1,
        borderColor: COLORS.border,
        paddingHorizontal: SPACING.m,
        height: 56,
        marginBottom: SPACING.l,
        justifyContent: 'center',
    },
    input: {
        fontSize: FONT_SIZE.xl,
        color: COLORS.textPrimary,
        textAlign: 'center',
        letterSpacing: 5,
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
    backButton: {
        marginTop: SPACING.l,
        alignItems: 'center',
    },
    backButtonText: {
        color: COLORS.textSecondary,
        fontSize: FONT_SIZE.s,
    },
});
