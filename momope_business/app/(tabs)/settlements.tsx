import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS } from '../../constants/theme';
import api from '../../services/api';
import { Feather } from '@expo/vector-icons';

export default function SettlementsScreen() {
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [data, setData] = useState<any>(null);

    const fetchSettlements = async () => {
        try {
            const res = await api.get('/merchant/settlements');
            if (res.data.success) {
                setData(res.data.data);
            }
        } catch (error) {
            console.error('Fetch Settlements Error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSettlements();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchSettlements();
        setRefreshing(false);
    };

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.date}>{item.date}</Text>
                <View style={[styles.badge, item.status === 'SETTLED' ? styles.badgeSuccess : styles.badgePending]}>
                    <Text style={[styles.badgeText, item.status === 'SETTLED' ? styles.textSuccess : styles.textPending]}>
                        {item.status}
                    </Text>
                </View>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>Collections</Text>
                <Text style={styles.value}>₹{item.gross.toFixed(2)}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.label}>MomoPe Fees</Text>
                <Text style={[styles.value, { color: COLORS.error }]}>-₹{item.commission.toFixed(2)}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.row}>
                <Text style={styles.netLabel}>Net Settlement</Text>
                <Text style={styles.netValue}>₹{item.net.toFixed(2)}</Text>
            </View>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header Summary */}
            <View style={styles.summaryContainer}>
                <View style={styles.summaryCard}>
                    <Text style={styles.summaryLabel}>Next Payout (T+1)</Text>
                    <Text style={styles.summaryValue}>₹ {data?.summary?.pending_payout?.toFixed(2) || '0.00'}</Text>
                </View>
                <View style={[styles.summaryCard, { marginLeft: SPACING.m, backgroundColor: COLORS.surface }]}>
                    <Text style={styles.summaryLabel}>Total Settled</Text>
                    <Text style={[styles.summaryValue, { color: COLORS.textPrimary }]}>₹ {data?.summary?.total_settled?.toFixed(2) || '0.00'}</Text>
                </View>
            </View>

            <Text style={styles.sectionTitle}>Daily Settlements</Text>

            <FlatList
                data={data?.daily_breakdown || []}
                renderItem={renderItem}
                keyExtractor={(item) => item.date}
                contentContainerStyle={{ padding: SPACING.m }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Feather name="briefcase" size={48} color={COLORS.textTertiary} />
                        <Text style={styles.emptyText}>No settlements yet</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    summaryContainer: { flexDirection: 'row', padding: SPACING.m },
    summaryCard: {
        flex: 1,
        backgroundColor: COLORS.primary,
        padding: SPACING.l,
        borderRadius: BORDER_RADIUS.m,
        justifyContent: 'center',
        elevation: 2
    },
    summaryLabel: { color: 'rgba(255,255,255,0.8)', fontSize: FONT_SIZE.s, marginBottom: SPACING.s },
    summaryValue: { color: '#FFF', fontSize: FONT_SIZE.l, fontWeight: 'bold' },

    sectionTitle: { marginLeft: SPACING.m, fontSize: FONT_SIZE.l, fontWeight: 'bold', color: COLORS.textPrimary, marginBottom: SPACING.s },

    card: {
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.m,
        padding: SPACING.m,
        marginBottom: SPACING.m,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.m },
    date: { fontSize: FONT_SIZE.m, fontWeight: 'bold', color: COLORS.textPrimary },
    badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
    badgeSuccess: { backgroundColor: 'rgba(34, 197, 94, 0.1)' },
    badgePending: { backgroundColor: 'rgba(234, 179, 8, 0.1)' },
    badgeText: { fontSize: FONT_SIZE.xs, fontWeight: 'bold' },
    textSuccess: { color: '#22c55e' },
    textPending: { color: '#ca8a04' },

    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
    label: { color: COLORS.textSecondary, fontSize: FONT_SIZE.s },
    value: { color: COLORS.textPrimary, fontSize: FONT_SIZE.s, fontWeight: '600' },

    divider: { height: 1, backgroundColor: COLORS.border, marginVertical: SPACING.s },
    netLabel: { color: COLORS.textPrimary, fontWeight: 'bold', fontSize: FONT_SIZE.m },
    netValue: { color: COLORS.primary, fontWeight: 'bold', fontSize: FONT_SIZE.l },

    emptyState: { alignItems: 'center', marginTop: 50 },
    emptyText: { color: COLORS.textTertiary, marginTop: SPACING.m }
});
