import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as LocalAuthentication from 'expo-local-authentication';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../../constants/theme';
import { useAuthStore } from '../../store/authStore';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import * as SecureStore from 'expo-secure-store';

export default function UnlockScreen() {
    const router = useRouter();
    const { user, setAuth, token, logout } = useAuthStore();
    const [isAuthenticating, setIsAuthenticating] = useState(false);

    useEffect(() => {
        handleBiometricAuth();
    }, []);

    const handleBiometricAuth = async () => {
        setIsAuthenticating(true);
        try {
            const hasHardware = await LocalAuthentication.hasHardwareAsync();
            if (!hasHardware) {
                Alert.alert('Error', 'Biometrics not supported.');
                return;
            }

            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: 'Unlock MomoPe',
                disableDeviceFallback: false,
            });

            if (result.success) {
                // Restore Session
                let currentToken = token;
                if (!currentToken) {
                    currentToken = await SecureStore.getItemAsync('auth_token');
                }

                if (currentToken && user) {
                    setAuth(currentToken, user);
                    router.replace('/(tabs)/home');
                } else {
                    // Fallback if state is corrupted
                    Alert.alert('Session Expired', 'Please login again.');
                    fullLogout();
                }
            }
        } catch (error) {
            console.error('Biometric Error:', error);
        } finally {
            setIsAuthenticating(false);
        }
    };

    const fullLogout = () => {
        logout(true); // Force full logout
        router.replace('/(auth)/welcome');
    };

    return (
        <View style={styles.container}>
            <StatusBar style="light" />
            <View style={styles.content}>
                <View style={styles.iconContainer}>
                    <Ionicons name="lock-closed" size={50} color={COLORS.primary} />
                </View>

                <Text style={styles.welcomeText}>Welcome back,</Text>
                <Text style={styles.userName}>{user?.full_name || 'User'}</Text>

                <TouchableOpacity style={styles.unlockButton} onPress={handleBiometricAuth}>
                    <Ionicons name="finger-print" size={32} color="white" style={styles.fingerIcon} />
                    <Text style={styles.unlockText}>Tap to Unlock</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.logoutButton} onPress={fullLogout}>
                    <Text style={styles.logoutText}>Switch Account</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        alignItems: 'center',
        width: '80%',
    },
    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: COLORS.surface,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.l,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    welcomeText: {
        fontSize: FONT_SIZE.l,
        color: COLORS.textSecondary,
        marginBottom: SPACING.s,
    },
    userName: {
        fontSize: FONT_SIZE.xxl,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: SPACING.xxl,
    },
    unlockButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.primary,
        paddingVertical: SPACING.m,
        paddingHorizontal: SPACING.xl,
        borderRadius: BORDER_RADIUS.l,
        marginBottom: SPACING.xl,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    fingerIcon: {
        marginRight: SPACING.m,
        width: 32, // Ensure icon dimensions
    },
    unlockText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: FONT_SIZE.l,
    },
    logoutButton: {
        padding: SPACING.m,
    },
    logoutText: {
        color: COLORS.textTertiary,
        fontSize: FONT_SIZE.m,
    },
});
