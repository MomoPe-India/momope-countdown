import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS } from '../../constants/theme';
import { useAuthStore } from '../../store/authStore';
import { userService } from '../../services/api';
import GradientBackground from '../../components/ui/GradientBackground';
import GlassCard from '../../components/ui/GlassCard';
import ActionPill from '../../components/ui/ActionPill';

export default function HomeScreen() {
    const router = useRouter();
    const { user, setAuth, logout } = useAuthStore();
    const [refreshing, setRefreshing] = useState(false);

    // Initial Load
    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await userService.getProfile();
            if (res.data.success) {
                const token = useAuthStore.getState().token;
                if (token) {
                    const profileData = res.data.data.profile;
                    const coinsData = res.data.data.coins;
                    const combinedUser = { ...profileData, wallet_balance: coinsData?.balance_available || 0 };
                    setAuth(token, combinedUser);
                }
            } else {
                logout();
            }
        } catch (error: any) {
            console.error('Fetch Profile Error:', error);
            if (error.response?.status === 401) logout();
        }
    };

    const getTimeBasedGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchProfile();
        setRefreshing(false);
    };

    // Quick Actions
    const quickActions = [
        { id: 1, label: 'Scan', icon: 'maximize', route: '/(tabs)/scan', isPrimary: true },
        { id: 2, label: 'Send', icon: 'send', route: '/send-coins' },
        { id: 3, label: 'History', icon: 'clock', route: '/(tabs)/history' },
        { id: 4, label: 'Perks', icon: 'gift', route: '/(tabs)/profile' },
    ];

    return (
        <GradientBackground>
            <ScrollView
                contentContainerStyle={{ paddingBottom: 100, paddingTop: 60, paddingHorizontal: SPACING.m }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => router.push('/profile')} style={styles.avatarContainer}>
                            <LinearGradient
                                colors={['#2CB78A', '#249671']}
                                style={styles.avatarGradient}
                            >
                                <Text style={styles.avatarText}>
                                    {user?.full_name ? user.full_name.charAt(0).toUpperCase() : 'M'}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                        <View style={{ marginLeft: SPACING.m }}>
                            <Text style={styles.greeting}>{getTimeBasedGreeting()},</Text>
                            <Text style={styles.userName}>
                                {user?.full_name?.split(' ')[0] || 'Member'}
                            </Text>
                        </View>
                    </View>
                    <TouchableOpacity style={styles.bellBtn}>
                        <Feather name="bell" size={20} color={COLORS.textPrimary} />
                        {/* Notification Dot */}
                        <View style={styles.dot} />
                    </TouchableOpacity>
                </View>

                {/* Main Balance Card - Premium Dark Mesh */}
                <TouchableOpacity activeOpacity={0.9} style={styles.cardContainer}>
                    <LinearGradient
                        colors={['#131B26', '#0A2A22']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.balanceCard}
                    >
                        {/* Decorative Blur Orb */}
                        <View style={styles.orb} />

                        <View style={styles.cardHeader}>
                            <View style={styles.coinBadge}>
                                <Text style={styles.coinLabel}>Momo Coins</Text>
                            </View>
                            <Feather name="info" size={16} color="rgba(255,255,255,0.5)" />
                        </View>

                        <Text style={styles.balanceValue}>
                            {Math.floor(user?.wallet_balance || 0).toLocaleString()}
                        </Text>
                        <Text style={styles.balanceSub}>Available Balance</Text>

                        <View style={styles.cardFooter}>
                            <View style={styles.securityTag}>
                                <Feather name="shield" size={12} color="#2CB78A" />
                                <Text style={styles.securityText}>Bank Grade Security</Text>
                            </View>
                        </View>
                    </LinearGradient>
                </TouchableOpacity>

                {/* Quick Actions Scroll (Horizontal) */}
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: SPACING.l, overflow: 'visible' }}>
                    {quickActions.map((action) => (
                        <ActionPill
                            key={action.id}
                            label={action.label}
                            icon={action.icon as any}
                            onPress={() => router.push(action.route as any)}
                            isPrimary={action.isPrimary}
                        />
                    ))}
                </ScrollView>

                {/* Promo Section */}
                <GlassCard style={styles.promoCard}>
                    <View style={styles.promoRow}>
                        <View style={styles.promoIcon}>
                            <Feather name="zap" size={24} color="#F59E0B" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.promoTitle}>Instant Rewards</Text>
                            <Text style={styles.promoText}>Earn up to 5% coins on every scan.</Text>
                        </View>
                        <Feather name="chevron-right" size={20} color={COLORS.textTertiary} />
                    </View>
                </GlassCard>

                {/* Recent Activity Teaser */}
                <Text style={styles.sectionTitle}>Recent Activity</Text>
                <GlassCard style={{ minHeight: 120, justifyContent: 'center', alignItems: 'center' }}>
                    <Feather name="activity" size={24} color={COLORS.textTertiary} style={{ marginBottom: 8 }} />
                    <Text style={{ color: COLORS.textTertiary, fontSize: FONT_SIZE.s }}>No recent transactions</Text>
                </GlassCard>

            </ScrollView>
        </GradientBackground>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    avatarContainer: {
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    avatarGradient: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'white',
    },
    avatarText: {
        color: 'white',
        fontSize: FONT_SIZE.l,
        fontWeight: 'bold',
    },
    greeting: {
        fontSize: FONT_SIZE.xs,
        color: COLORS.textSecondary,
        fontWeight: '600',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    userName: {
        fontSize: FONT_SIZE.xl,
        fontWeight: '800', // Extra bold
        color: COLORS.textPrimary,
    },
    bellBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'white',
    },
    dot: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.error,
        borderWidth: 1,
        borderColor: 'white',
    },
    cardContainer: {
        marginBottom: SPACING.xl,
        shadowColor: '#2CB78A',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
    },
    balanceCard: {
        borderRadius: BORDER_RADIUS.xl,
        padding: SPACING.xl,
        overflow: 'hidden',
        minHeight: 180,
        justifyContent: 'space-between',
    },
    orb: {
        position: 'absolute',
        top: -50,
        right: -50,
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: '#2CB78A',
        opacity: 0.2,
        transform: [{ scale: 1.5 }],
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    coinBadge: {
        backgroundColor: 'rgba(44, 183, 138, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 100,
        borderWidth: 1,
        borderColor: 'rgba(44, 183, 138, 0.3)',
    },
    coinLabel: {
        color: '#2CB78A',
        fontSize: FONT_SIZE.xs,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    balanceValue: {
        fontSize: 48,
        fontWeight: '800',
        color: 'white',
        letterSpacing: -1,
        marginTop: SPACING.m,
    },
    balanceSub: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: FONT_SIZE.s,
        marginBottom: SPACING.m,
    },
    cardFooter: {
        flexDirection: 'row',
        marginTop: SPACING.s,
    },
    securityTag: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    securityText: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 10,
        marginLeft: 6,
        fontWeight: '500',
    },
    sectionTitle: {
        fontSize: FONT_SIZE.l,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: SPACING.m,
        marginLeft: SPACING.s,
    },
    promoCard: {
        marginBottom: SPACING.xl,
    },
    promoRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    promoIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#FFFBEB',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.m,
    },
    promoTitle: {
        fontSize: FONT_SIZE.m,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: 2,
    },
    promoText: {
        fontSize: FONT_SIZE.s,
        color: COLORS.textSecondary,
    },
});
