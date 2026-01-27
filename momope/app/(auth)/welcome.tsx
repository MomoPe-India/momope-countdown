import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS } from '../../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

export default function WelcomeScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <StatusBar style="light" />

            {/* Top Section: Logo & Welcome */}
            <View style={styles.topSection}>
                <View style={styles.logoContainer}>
                    {/* Placeholder for Logo - You can add an Image here later */}
                    <Text style={styles.logoText}>MomoPe</Text>
                </View>
                <Text style={styles.heading}>The Rewarding Way to Pay</Text>
                <Text style={styles.subheading}>Secure payments, instant rewards, and seamless experience.</Text>
            </View>

            {/* Bottom Section: Actions */}
            <View style={styles.bottomSection}>
                {/* New User Action */}
                <TouchableOpacity
                    style={[styles.button, styles.primaryButton]}
                    onPress={() => router.push('/(auth)/login?mode=register')}
                >
                    <Text style={styles.primaryButtonText}>New User? Create Account</Text>
                </TouchableOpacity>

                {/* Existing User Action */}
                <TouchableOpacity
                    style={[styles.button, styles.secondaryButton]}
                    onPress={() => router.push('/(auth)/login?mode=login')}
                >
                    <Text style={styles.secondaryButtonText}>Existing User? Sign In</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        padding: SPACING.l,
        justifyContent: 'space-between'
    },
    topSection: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: SPACING.xxl
    },
    logoContainer: {
        marginBottom: SPACING.xl,
        alignItems: 'center'
    },
    logoText: {
        fontSize: 48,
        fontWeight: 'bold',
        color: COLORS.primary,
        letterSpacing: -1
    },
    heading: {
        fontSize: FONT_SIZE.xxl,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        textAlign: 'center',
        marginBottom: SPACING.s
    },
    subheading: {
        fontSize: FONT_SIZE.m,
        color: COLORS.textSecondary,
        textAlign: 'center',
        paddingHorizontal: SPACING.m,
        lineHeight: 24
    },
    bottomSection: {
        marginBottom: SPACING.xxl
    },
    button: {
        height: 56,
        borderRadius: BORDER_RADIUS.l,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.m
    },
    primaryButton: {
        backgroundColor: COLORS.primary,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6
    },
    primaryButtonText: {
        color: '#FFF',
        fontSize: FONT_SIZE.l,
        fontWeight: 'bold'
    },
    secondaryButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: COLORS.primary
    },
    secondaryButtonText: {
        color: COLORS.primary,
        fontSize: FONT_SIZE.l,
        fontWeight: '600'
    }
});
