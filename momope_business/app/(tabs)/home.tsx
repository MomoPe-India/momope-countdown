import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS } from '../../constants/theme';
import { useMerchantStore } from '../../store/merchantStore';
import api from '../../services/api';

// New Premium Components
import GradientBackground from '../../components/ui/GradientBackground';
import GlassCard from '../../components/ui/GlassCard';
import ActionPill from '../../components/ui/ActionPill';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
    const router = useRouter();
    const { merchant, token, setAuth, logout } = useMerchantStore();
    const [refreshing, setRefreshing] = useState(false);

    // Initial Load
    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await api.get('/merchant/profile');
            if (res.data.success) {
                const data = res.data.data;
                const combined = {
                    ...data.profile,
                    stats: data.stats
                };
                if (token) setAuth(token, combined);
            }
        } catch (error: any) {
            console.error('Fetch Profile Error:', error);
            if (error.response?.status === 401) logout();
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchProfile();
        setRefreshing(false);
    };

    const handleLogout = () => {
        logout();
        router.replace('/(auth)/welcome');
    };

    // Construct QR Value
    const qrValue = JSON.stringify({
        type: 'MERCHANT_PAY',
        merchantId: merchant?.id,
        name: merchant?.business_name,
        mobile: merchant?.mobile
    });

    // Safety check for stats
    const stats = merchant?.stats || { todays_collection: 0, todays_count: 0 };

    return (
        <GradientBackground>
            <ScrollView
                style={styles.container}
                contentContainerStyle={{ paddingBottom: 100 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
            >
                {/* Header Section */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.greeting}>Welcome back,</Text>
                        <Text style={styles.businessName}>{merchant?.business_name || 'Merchant'}</Text>
                        <View style={styles.verifiedBadge}>
                            <Feather name="check-circle" size={12} color="#10B981" />
                            <Text style={styles.verifiedText}>Verified Merchant</Text>
                        </View>
                    </View>
                    <TouchableOpacity onPress={handleLogout} style={styles.profileBtn}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>{(merchant?.business_name?.[0] || 'M').toUpperCase()}</Text>
                        </View>
                    </TouchableOpacity>
                </View>

                {/* Premium QR Card */}
                <GlassCard style={styles.qrCard} intensity={40}>
                    <View style={styles.qrHeader}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <FontAwesome5 name="qrcode" size={18} color={COLORS.primary} style={{ marginRight: 8 }} />
                            <Text style={styles.cardTitle}>My QR Code</Text>
                        </View>
                        <View style={styles.liveIndicator}>
                            <View style={styles.dot} />
                            <Text style={styles.liveText}>Active</Text>
                        </View>
                    </View>

                    <View style={styles.qrContent}>
                        <View style={styles.qrBorder}>
                            {merchant?.id ? (
                                <QRCode
                                    value={qrValue}
                                    size={180}
                                    color="#1f2937"
                                    backgroundColor="white"
                                    logoBackgroundColor='white'
                                />
                            ) : (
                                <Text style={{ color: COLORS.textSecondary }}>Loading QR...</Text>
                            )}
                        </View>
                        <Text style={styles.qrHint}>Show this code to accept payments</Text>
                    </View>
                </GlassCard>

                {/* Today's Deep Stats - Dark Mode Style */}
                <GlassCard style={styles.statsCard} variant="dark" intensity={60}>
                    <View style={styles.statsHeader}>
                        <View style={styles.statsIconBox}>
                            <Feather name="bar-chart-2" size={20} color="white" />
                        </View>
                        <View>
                            <Text style={styles.statsLabel}>Today's Collection</Text>
                            <Text style={styles.statsDate}>{new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' })}</Text>
                        </View>
                    </View>

                    <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statCurrency}>₹</Text>
                            <Text style={styles.statValue}>{stats.todays_collection?.toLocaleString('en-IN') || '0'}</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                            <Text style={styles.statCount}>{stats.todays_count || 0}</Text>
                            <Text style={styles.statSub}>Transactions</Text>
                        </View>
                    </View>
                </GlassCard>

                {/* Quick Actions Grid */}
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.actionGrid}>
                    <ActionPill
                        label="Settlements"
                        subtitle="View Payouts"
                        icon="dollar-sign"
                        color="#8B5CF6"
                        onPress={() => router.push('/(tabs)/settlements')} // Assuming this route exists
                    />
                    <ActionPill
                        label="History"
                        subtitle="All Transactions"
                        icon="clock"
                        color="#F59E0B"
                        onPress={() => router.push('/(tabs)/history')} // Assuming this route exists
                    />
                    <ActionPill
                        label="Support"
                        subtitle="Get Help"
                        icon="headphones"
                        color="#3B82F6"
                        onPress={() => { }}
                    />
                    <ActionPill
                        label="Settings"
                        subtitle="Profile & Security"
                        icon="settings"
                        color="#6B7280"
                        onPress={() => { }}
                    />
                </View>

            </ScrollView>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: SPACING.m },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: SPACING.xl + 10, // More top margin for status bar
        marginBottom: SPACING.l,
        alignItems: 'center'
    },
    greeting: { color: COLORS.textSecondary, fontSize: FONT_SIZE.s, marginBottom: 2 },
    businessName: { color: COLORS.textPrimary, fontSize: FONT_SIZE.xl, fontWeight: 'bold' },
    verifiedBadge: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
    verifiedText: { color: COLORS.textSecondary, fontSize: 12, marginLeft: 4, fontWeight: '500' },

    profileBtn: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: COLORS.surface
    },
    avatarText: { fontSize: 18, fontWeight: 'bold', color: COLORS.primary },

    qrCard: {
        marginBottom: SPACING.l,
        backgroundColor: 'rgba(255,255,255,0.7)', // Fallback tint
        borderWidth: 1,
        borderColor: 'white'
    },
    qrHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.l },
    cardTitle: { fontSize: FONT_SIZE.m, fontWeight: 'bold', color: COLORS.textPrimary },
    liveIndicator: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ECFDF5', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 },
    dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#10B981', marginRight: 6 },
    liveText: { fontSize: 10, color: '#059669', fontWeight: 'bold' },

    qrContent: { alignItems: 'center' },
    qrBorder: {
        padding: 16,
        backgroundColor: 'white',
        borderRadius: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2
    },
    qrHint: { marginTop: SPACING.m, color: COLORS.textSecondary, fontSize: FONT_SIZE.s, fontStyle: 'italic' },

    statsCard: {
        marginBottom: SPACING.xl,
        backgroundColor: '#1f2937', // Dark fallback
        borderWidth: 0,
    },
    statsHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.l },
    statsIconBox: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.m
    },
    statsLabel: { color: 'rgba(255,255,255,0.7)', fontSize: FONT_SIZE.s },
    statsDate: { color: 'white', fontWeight: 'bold', fontSize: FONT_SIZE.m },

    statsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
    statItem: { alignItems: 'center' },
    statCurrency: { fontSize: 24, color: '#34D399', fontWeight: 'bold', marginBottom: -4 },
    statValue: { fontSize: 32, color: 'white', fontWeight: 'bold' },
    statDivider: { width: 1, height: 40, backgroundColor: 'rgba(255,255,255,0.1)' },
    statCount: { fontSize: 32, color: 'white', fontWeight: 'bold' },
    statSub: { color: 'rgba(255,255,255,0.5)', fontSize: FONT_SIZE.s },

    sectionTitle: { fontSize: FONT_SIZE.l, fontWeight: 'bold', color: COLORS.textPrimary, marginBottom: SPACING.m, marginLeft: SPACING.s },
    actionGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
});
