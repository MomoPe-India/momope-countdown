import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS } from '../constants/theme'; // Fixed Import

export default function SuccessScreen() {
    const router = useRouter();
    const { amount, recipient, txId } = useLocalSearchParams();

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <View style={styles.iconContainer}>
                    <Feather name="check" size={40} color="#FFF" />
                </View>

                <Text style={styles.successText}>Payment Successful!</Text>
                <Text style={styles.amount}>₹{amount}</Text>

                <View style={styles.details}>
                    <Text style={styles.label}>Paid to</Text>
                    <Text style={styles.value}>{recipient}</Text>

                    <Text style={[styles.label, { marginTop: SPACING.m }]}>Transaction ID</Text>
                    <Text style={styles.value}>{txId}</Text>
                </View>

                {/* Reward Badge */}
                {Number(useLocalSearchParams().coinsEarned) > 0 && (
                    <View style={styles.rewardBadge}>
                        <Feather name="award" size={24} color="#FFD700" />
                        <Text style={styles.rewardText}>+{useLocalSearchParams().coinsEarned} Coins Earned!</Text>
                    </View>
                )}
            </View>

            <TouchableOpacity
                style={styles.homeButton}
                onPress={() => router.replace('/(tabs)/home')}
            >
                <Text style={styles.btnText}>Back to Home</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background, justifyContent: 'center', padding: SPACING.l },
    card: {
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.l,
        padding: SPACING.xl,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.l,
        shadowColor: COLORS.primary,
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 8
    },
    successText: { color: COLORS.primary, fontSize: FONT_SIZE.xl, fontWeight: 'bold', marginBottom: SPACING.s },
    amount: { color: COLORS.textPrimary, fontSize: 48, fontWeight: 'bold', marginBottom: SPACING.xl },
    details: { width: '100%', alignItems: 'center' },
    label: { color: COLORS.textSecondary, fontSize: FONT_SIZE.s },
    value: { color: COLORS.textPrimary, fontSize: FONT_SIZE.m, fontWeight: '600', marginTop: 4 },

    homeButton: {
        marginTop: SPACING.xxl,
        backgroundColor: COLORS.surface,
        paddingVertical: SPACING.m,
        paddingHorizontal: SPACING.xl,
        borderRadius: BORDER_RADIUS.m,
        borderWidth: 1,
        borderColor: COLORS.border,
        alignSelf: 'center'
    },
    btnText: { color: COLORS.textPrimary, fontWeight: 'bold' },
    rewardBadge: {
        marginTop: SPACING.l,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFD70020',
        padding: SPACING.m,
        borderRadius: BORDER_RADIUS.m
    },
    rewardText: {
        color: '#FFD700',
        fontWeight: 'bold',
        marginLeft: SPACING.s,
        fontSize: FONT_SIZE.m
    }
});
