import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Modal } from 'react-native';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';
import { useAuthStore } from '../store/authStore';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import * as LocalAuthentication from 'expo-local-authentication';

export default function ProfileScreen() {
    const { user, logout, isBiometricEnabled, setBiometric } = useAuthStore();
    const router = useRouter();
    const [qrVisible, setQrVisible] = useState(false);

    const toggleBiometric = async () => {
        if (isBiometricEnabled) {
            // Turning OFF
            setBiometric(false);
            Alert.alert('Disabled', 'Biometric login disabled.');
            return;
        }

        // Turning ON
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();

        if (!hasHardware || !isEnrolled) {
            Alert.alert('Unsupported', 'Biometrics not available on this device.');
            return;
        }

        const result = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Confirm Identity to Enable',
        });

        if (result.success) {
            setBiometric(true);
            Alert.alert('Success', 'Biometric Login Enabled!');
        } else {
            Alert.alert('Failed', 'Authentication failed.');
        }
    };

    const handleLogout = () => {
        Alert.alert('Logout', 'Are you sure you want to logout?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Logout',
                style: 'destructive',
                onPress: () => {
                    logout();
                    router.replace('/(auth)/welcome');
                }
            }
        ]);
    };

    const getInitials = (name: string) => {
        return name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'U';
    };

    // QR Data Payload (P2P Standard)
    const qrData = JSON.stringify({
        type: 'P2P_PAY',
        id: user?.id,
        name: user?.full_name,
        mobile: user?.mobile
    });

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            {/* Header Section */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={28} color={COLORS.textPrimary} />
                </TouchableOpacity>

                <View style={styles.avatarContainer}>
                    <Text style={styles.avatarText}>{getInitials(user?.full_name || 'User')}</Text>
                    <View style={styles.verifiedBadge}>
                        <Ionicons name="checkmark-circle" size={20} color={COLORS.primary} />
                    </View>
                </View>
                <Text style={styles.userName}>{user?.full_name || 'Momo User'}</Text>
                <Text style={styles.userPhone}>+91 {user?.mobile || '----------'}</Text>
                <Text style={styles.userEmail}>{user?.email || ''}</Text>
            </View>

            {/* Menu Sections */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Account</Text>
                <MenuItem
                    icon="person-outline"
                    title="Personal Details"
                    subtitle={user?.email || "Manage your info"}
                />
                <MenuItem
                    icon="qr-code-outline"
                    title="My QR Code"
                    subtitle="Share to receive money"
                    onPress={() => setQrVisible(true)}
                />
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Security</Text>
                <MenuItem icon="lock-closed-outline" title="Change PIN" onPress={() => router.push('/change-pin')} />
                <MenuItem
                    icon="finger-print-outline"
                    title="Biometric Login"
                    toggle
                    isActive={isBiometricEnabled}
                    onPress={toggleBiometric}
                />
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Support</Text>
                <MenuItem icon="help-buoy-outline" title="Help/Support" onPress={() => router.push('/help')} />
                <MenuItem icon="information-circle-outline" title="About MomoPe" onPress={() => router.push('/about')} />
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>

            <Text style={styles.versionText}>Version 1.0.0 (Beta)</Text>

            {/* QR Code Modal */}
            <Modal
                visible={qrVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setQrVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.qrCard}>
                        <Text style={styles.qrTitle}>My MomoPe QR</Text>
                        <Text style={styles.qrSubtitle}>Scan to pay me</Text>

                        <View style={styles.qrContainer}>
                            <QRCode
                                value={qrData}
                                size={200}
                                color="black"
                                backgroundColor="white"
                            />
                        </View>

                        <Text style={styles.qrName}>{user?.full_name}</Text>
                        <Text style={styles.qrMobile}>+91 {user?.mobile}</Text>

                        <TouchableOpacity style={styles.closeQrButton} onPress={() => setQrVisible(false)}>
                            <Text style={styles.closeQrText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
}

const MenuItem = ({ icon, title, subtitle, toggle, isActive, onPress }: { icon: any, title: string, subtitle?: string, toggle?: boolean, isActive?: boolean, onPress?: () => void }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
        <View style={styles.menuIconContainer}>
            <Ionicons name={icon} size={22} color={COLORS.textSecondary} />
        </View>
        <View style={styles.menuTextContainer}>
            <Text style={styles.menuTitle}>{title}</Text>
            {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
        </View>
        {toggle ? (
            <Ionicons
                name={isActive ? "toggle" : "toggle-outline"}
                size={28}
                color={isActive ? COLORS.primary : COLORS.textTertiary}
            />
        ) : (
            <Ionicons name="chevron-forward" size={20} color={COLORS.textTertiary} />
        )}
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    content: {
        padding: SPACING.m,
        paddingBottom: 40,
    },
    header: {
        alignItems: 'center',
        marginVertical: SPACING.l,
        position: 'relative',
    },
    backButton: {
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 10,
        padding: SPACING.s,
    },
    avatarContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.surface,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: COLORS.border,
        marginBottom: SPACING.s,
    },
    avatarText: {
        fontSize: FONT_SIZE.xxl,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    verifiedBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: COLORS.background,
        borderRadius: 10,
    },
    userName: {
        fontSize: FONT_SIZE.l,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: 2,
    },
    userPhone: {
        fontSize: FONT_SIZE.m,
        color: COLORS.textSecondary,
    },
    userEmail: {
        fontSize: FONT_SIZE.s,
        color: COLORS.textTertiary,
        marginTop: 2,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    qrCard: {
        width: '85%',
        backgroundColor: 'white',
        borderRadius: BORDER_RADIUS.xl,
        padding: SPACING.xl,
        alignItems: 'center',
    },
    qrTitle: {
        fontSize: FONT_SIZE.xl,
        fontWeight: 'bold',
        color: COLORS.secondary,
        marginBottom: SPACING.s,
    },
    qrSubtitle: {
        fontSize: FONT_SIZE.m,
        color: COLORS.textTertiary,
        marginBottom: SPACING.l,
    },
    qrContainer: {
        marginBottom: SPACING.l,
        padding: SPACING.s,
        backgroundColor: 'white',
    },
    qrName: {
        fontSize: FONT_SIZE.l,
        fontWeight: 'bold',
        color: COLORS.secondary,
        marginTop: SPACING.m,
    },
    qrMobile: {
        fontSize: FONT_SIZE.m,
        color: COLORS.textTertiary,
        marginTop: 2,
    },
    closeQrButton: {
        marginTop: SPACING.xl,
        paddingVertical: SPACING.m,
        paddingHorizontal: SPACING.xl,
        backgroundColor: COLORS.secondary,
        borderRadius: BORDER_RADIUS.m,
    },
    closeQrText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: FONT_SIZE.m,
    },
    section: {
        marginBottom: SPACING.l,
    },
    sectionTitle: {
        color: COLORS.textTertiary,
        fontSize: FONT_SIZE.s,
        fontWeight: 'bold',
        marginBottom: SPACING.s,
        marginLeft: SPACING.s,
        textTransform: 'uppercase',
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        padding: SPACING.m,
        marginBottom: 2,
        borderRadius: BORDER_RADIUS.m,
    },
    menuIconContainer: {
        width: 32,
        alignItems: 'center',
        marginRight: SPACING.s,
    },
    menuTextContainer: {
        flex: 1,
    },
    menuTitle: {
        fontSize: FONT_SIZE.m,
        color: COLORS.textPrimary,
    },
    menuSubtitle: {
        fontSize: FONT_SIZE.s,
        color: COLORS.textTertiary,
    },
    logoutButton: {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        padding: SPACING.m,
        borderRadius: BORDER_RADIUS.m,
        alignItems: 'center',
        marginTop: SPACING.s,
        borderWidth: 1,
        borderColor: COLORS.error,
    },
    logoutText: {
        color: COLORS.error,
        fontWeight: 'bold',
        fontSize: FONT_SIZE.m,
    },
    switchAccountButton: {
        alignItems: 'center',
        marginTop: SPACING.m,
        padding: SPACING.s,
    },
    switchAccountText: {
        color: COLORS.textTertiary,
        fontSize: FONT_SIZE.s,
        textDecorationLine: 'underline',
    },
    versionText: {
        textAlign: 'center',
        color: COLORS.textTertiary,
        fontSize: FONT_SIZE.s,
        marginTop: SPACING.l,
    },
});
