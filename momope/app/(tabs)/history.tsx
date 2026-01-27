import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS } from '../../constants/theme';
import { supabase } from '../../services/api'; // Ensure this exports the client
import { useAuthStore } from '../../store/authStore';
import { Feather } from '@expo/vector-icons';

// Define Transaction Interface
interface Transaction {
    id: string;
    amount_gross: number;
    created_at: string;
    status: string;
    merchant: {
        business_name: string;
    } | null;
}

export default function HistoryScreen() {
    const { user } = useAuthStore();
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchHistory = async () => {
        if (!user) return;
        try {
            // Fetch transactions for the logged-in customer
            // We assume 'merchant_id' has a foreign key relationship to 'merchants' or 'users' that exposes 'business_name'
            // Based on dashboard stats: receiver:merchant_id ( id, business_name, full_name )
            const { data, error } = await supabase
                .from('transactions')
                .select(`
                    id,
                    amount_gross,
                    created_at,
                    status,
                    merchant:merchant_id ( business_name )
                `)
                .eq('customer_id', user.id) // Assuming user.id corresponds to user_id in DB
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching history:', error);
            } else {
                setTransactions(data || []);
            }
        } catch (err) {
            console.error('History fetch error:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [user]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchHistory();
    };

    const renderItem = ({ item }: { item: Transaction }) => {
        const date = new Date(item.created_at).toLocaleDateString('en-IN', {
            day: 'numeric', month: 'short', year: 'numeric'
        });
        const time = new Date(item.created_at).toLocaleTimeString('en-IN', {
            hour: '2-digit', minute: '2-digit'
        });

        return (
            <View style={styles.card}>
                <View style={styles.iconBox}>
                    <Feather name="arrow-up-right" size={24} color={COLORS.error} />
                </View>
                <View style={styles.info}>
                    <Text style={styles.merchantName}>
                        {item.merchant?.business_name || 'Unknown Merchant'}
                    </Text>
                    <Text style={styles.date}>{date} • {time}</Text>
                </View>
                <View style={styles.amountBox}>
                    <Text style={styles.amount}>- ₹{item.amount_gross}</Text>
                    <Text style={[
                        styles.status,
                        { color: item.status === 'SUCCESS' ? COLORS.success : COLORS.textSecondary }
                    ]}>
                        {item.status}
                    </Text>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Transaction History</Text>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 50 }} />
            ) : (
                <FlatList
                    data={transactions}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[COLORS.primary]} />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Feather name="clock" size={48} color={COLORS.textTertiary} />
                            <Text style={styles.emptyText}>No transactions yet.</Text>
                        </View>
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    header: { padding: SPACING.l, paddingTop: SPACING.xl, backgroundColor: COLORS.surface },
    title: { fontSize: FONT_SIZE.xl, fontWeight: 'bold', color: COLORS.textPrimary },
    list: { padding: SPACING.m },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        padding: SPACING.m,
        marginBottom: SPACING.m,
        borderRadius: BORDER_RADIUS.m,
        borderWidth: 1,
        borderColor: COLORS.border
    },
    iconBox: {
        width: 40, height: 40,
        borderRadius: 20,
        backgroundColor: '#FFEBEE', // Light red for payment out
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.m
    },
    info: { flex: 1 },
    merchantName: { fontSize: FONT_SIZE.m, fontWeight: 'bold', color: COLORS.textPrimary, marginBottom: 2 },
    date: { fontSize: FONT_SIZE.s, color: COLORS.textSecondary },
    amountBox: { alignItems: 'flex-end' },
    amount: { fontSize: FONT_SIZE.m, fontWeight: 'bold', color: COLORS.textPrimary },
    status: { fontSize: 10, fontWeight: 'bold', marginTop: 2 },
    emptyState: { alignItems: 'center', marginTop: 100 },
    emptyText: { color: COLORS.textSecondary, marginTop: SPACING.m, fontSize: FONT_SIZE.m }
});
