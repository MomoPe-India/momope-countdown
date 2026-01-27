import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function AboutScreen() {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.title}>About MomoPe</Text>
            </View>

            <View style={styles.content}>
                <View style={styles.logoContainer}>
                    <Image
                        source={require('../assets/images/logo.png')}
                        style={styles.logoImage}
                    />
                    <Text style={styles.appName}>MomoPe</Text>
                    <Text style={styles.version}>Version 1.0.0 (Beta)</Text>
                </View>

                <View style={styles.infoCard}>
                    <Text style={styles.infoTitle}>Our Mission</Text>
                    <Text style={styles.infoText}>
                        MomoPe is dedicated to making digital payments simple, secure, and accessible for everyone.
                        Whether you are sending money to a friend or paying at your favorite local store, we ensure
                        your transaction is fast and safe.
                    </Text>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.footerText}>© 2026 MomoPe Digital Hub Pvt. Ltd</Text>
                    <Text style={styles.footerLink}>Terms of Service • Privacy Policy</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.m,
        paddingTop: SPACING.xl,
        backgroundColor: COLORS.surface,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    backButton: {
        marginRight: SPACING.m,
    },
    title: {
        fontSize: FONT_SIZE.l,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    content: {
        flex: 1,
        padding: SPACING.xl,
        alignItems: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: SPACING.xxl,
        marginTop: SPACING.xl,
    },
    logoImage: {
        width: 100,
        height: 100,
        marginBottom: SPACING.m,
        resizeMode: 'contain',
        borderRadius: 20,
    },
    appName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: SPACING.s,
    },
    version: {
        fontSize: FONT_SIZE.m,
        color: COLORS.textTertiary,
    },
    infoCard: {
        width: '100%',
        backgroundColor: COLORS.surface,
        padding: SPACING.l,
        borderRadius: BORDER_RADIUS.l,
        marginBottom: SPACING.xl,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    infoTitle: {
        fontSize: FONT_SIZE.l,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: SPACING.m,
    },
    infoText: {
        fontSize: FONT_SIZE.m,
        color: COLORS.textSecondary,
        lineHeight: 24,
    },
    footer: {
        marginTop: 'auto',
        alignItems: 'center',
    },
    footerText: {
        fontSize: FONT_SIZE.s,
        color: COLORS.textTertiary,
        marginBottom: SPACING.s,
    },
    footerLink: {
        fontSize: FONT_SIZE.s,
        color: COLORS.primary,
        fontWeight: '500',
    },
});
