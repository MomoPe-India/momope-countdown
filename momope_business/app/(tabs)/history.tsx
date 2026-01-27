import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, ActivityIndicator } from 'react-native';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS } from '../../constants/theme';
import { Feather } from '@expo/vector-icons';
import api from '../../services/api';
import { useMerchantStore } from '../../store/merchantStore';

export default function HistoryScreen() {
    const { token } = useMerchantStore();
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const res = await api.get('/merchant/history');
            if (res.data.success) {
                setTransactions(res.data.data);
            }
        } catch (error) {
            console.error('History Fetch Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchHistory();
        setRefreshing(false);
    };

    const renderItem = ({ item }: { item: any }) => (
        <View style={styles.card}>
            <View style={styles.iconContainer}>
                <Feather name="arrow-down-left" size={24} color={COLORS.success} />
            </View>
            <View style={styles.details}>
                <Text style={styles.senderName}>{item.sender?.full_name || 'Customer'}</Text>
                <Text style={styles.date}>{new Date(item.created_at).toLocaleString()}</Text>
                {item.description && <Text style={styles.description}>{item.description}</Text>}
            </View>
            <Text style={[styles.amount, { color: COLORS.success }]}>+ ₹{item.amount}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Transactions</Text>

            {loading ? (
                <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 20 }} />
            ) : (
                <FlatList
                    data={transactions}
                    keyExtractor={(item) => item.id}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.primary} />}
                    ListEmptyComponent={
                        <View style={styles.empty}>
                            <Feather name="clock" size={48} color={COLORS.textTertiary} />
                            <Text style={styles.emptyText}>No transactions yet</Text>
                        </View>
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background, padding: SPACING.m },
    title: { fontSize: FONT_SIZE.xl, fontWeight: 'bold', color: COLORS.textPrimary, marginTop: SPACING.l, marginBottom: SPACING.m },
    list: { paddingBottom: 20 },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        padding: SPACING.m,
        borderRadius: BORDER_RADIUS.m,
        marginBottom: SPACING.s,
        borderWidth: 1,
        borderColor: COLORS.border
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(44, 183, 138, 0.1)', // Primary tint
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.m
    },
    details: { flex: 1 },
    senderName: { fontSize: FONT_SIZE.m, fontWeight: 'bold', color: COLORS.textPrimary },
    date: { fontSize: FONT_SIZE.s, color: COLORS.textTertiary, marginTop: 2 },
    description: { fontSize: FONT_SIZE.s, color: COLORS.textSecondary, marginTop: 2 },
    amount: { fontSize: FONT_SIZE.m, fontWeight: 'bold' },
    empty: { alignItems: 'center', marginTop: 50 },
    emptyText: { color: COLORS.textSecondary, marginTop: SPACING.m, fontSize: FONT_SIZE.m }
});
