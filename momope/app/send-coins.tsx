import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS } from '../constants/theme';
import api from '../services/api';
import { useAuthStore } from '../store/authStore';

export default function SendCoinsScreen() {
    const router = useRouter();
    const { user, setAuth } = useAuthStore();
    const [mobile, setMobile] = useState('');
    const [amount, setAmount] = useState('');
    const [note, setNote] = useState('');
    const [loading, setLoading] = useState(false);
    const [recipient, setRecipient] = useState<any>(null);
    const [step, setStep] = useState(1); // 1: Find User, 2: Enter Amount

    const balance = user?.wallet_balance || 0;
    const maxSendable = Math.floor(balance * 0.8);

    const handleLookup = async () => {
        if (mobile.length !== 10) {
            Alert.alert('Invalid Mobile', 'Please enter a valid 10-digit number.');
            return;
        }
        setLoading(true);
        try {
            const res = await api.post('/user/lookup', { mobile });
            if (res.data.success) {
                setRecipient(res.data.data);
                setStep(2);
            } else {
                Alert.alert('User Not Found', 'No user verified with this mobile number.');
            }
        } catch (error) {
            Alert.alert('Error', 'Could not search user.');
        } finally {
            setLoading(false);
        }
    };

    const handleSend = async () => {
        const sendAmount = parseInt(amount);

        if (!sendAmount || sendAmount <= 0) {
            Alert.alert('Invalid Amount', 'Enter a valid amount.');
            return;
        }

        if (sendAmount > maxSendable) {
            Alert.alert('Limit Exceeded', `Retention Rule: You can only send up to ${maxSendable} coins (80% of balance).`);
            return;
        }

        setLoading(true);
        try {
            const res = await api.post('/transfer', {
                receiverId: recipient.id,
                amount: sendAmount,
                description: note || 'P2P Transfer'
            });

            if (res.data.success) {
                // Update Local Balance
                const newBalance = balance - sendAmount;
                if (user && useAuthStore.getState().token) {
                    setAuth(useAuthStore.getState().token!, { ...user, wallet_balance: newBalance });
                }

                Alert.alert('Success', `Sent ${sendAmount} Coins to ${recipient.name}!`);
                router.back();
            } else {
                Alert.alert('Failed', res.data.message || 'Transfer failed.');
            }
        } catch (error: any) {
            const msg = error.response?.data?.error || 'Transfer failed.';
            Alert.alert('Error', msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Feather name="arrow-left" size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.title}>Send Coins</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                {/* Balance & Limit Info */}
                <View style={styles.limitCard}>
                    <View>
                        <Text style={styles.limitLabel}>Available Balance</Text>
                        <Text style={styles.limitValue}>{Math.floor(balance)} 🏆</Text>
                    </View>
                    <View style={styles.dividerVertical} />
                    <View>
                        <Text style={styles.limitLabel}>Max Sendable (80%)</Text>
                        <Text style={[styles.limitValue, { color: COLORS.primary }]}>{maxSendable} 🏆</Text>
                    </View>
                </View>

                {step === 1 && (
                    <View style={styles.formSection}>
                        <Text style={styles.label}>Recipient Mobile Number</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="99999 99999"
                            placeholderTextColor={COLORS.textTertiary}
                            keyboardType="number-pad"
                            maxLength={10}
                            value={mobile}
                            onChangeText={setMobile}
                            autoFocus
                        />
                        <TouchableOpacity style={styles.btn} onPress={handleLookup} disabled={loading}>
                            {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.btnText}>Verify User</Text>}
                        </TouchableOpacity>
                    </View>
                )}

                {step === 2 && recipient && (
                    <View style={styles.formSection}>
                        <View style={styles.recipientBadge}>
                            <Feather name="user-check" size={20} color="#FFF" />
                            <Text style={styles.recipientName}>{recipient.name}</Text>
                            <Text style={styles.recipientMobile}>({recipient.mobile})</Text>
                            <TouchableOpacity onPress={() => setStep(1)} style={{ marginLeft: 'auto' }}>
                                <Feather name="x" size={20} color="rgba(255,255,255,0.7)" />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.label}>Amount to Send</Text>
                        <TextInput
                            style={[styles.input, styles.amountInput]}
                            placeholder="0"
                            placeholderTextColor={COLORS.textTertiary}
                            keyboardType="number-pad"
                            value={amount}
                            onChangeText={setAmount}
                            autoFocus
                        />

                        <Text style={styles.label}>Note (Optional)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Gift, Reward..."
                            placeholderTextColor={COLORS.textTertiary}
                            value={note}
                            onChangeText={setNote}
                        />

                        <TouchableOpacity style={styles.btn} onPress={handleSend} disabled={loading}>
                            {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.btnText}>Send Coins</Text>}
                        </TouchableOpacity>
                    </View>
                )}

            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    header: { flexDirection: 'row', alignItems: 'center', padding: SPACING.l, paddingTop: SPACING.xl, backgroundColor: COLORS.surface },
    backBtn: { marginRight: SPACING.m },
    title: { fontSize: FONT_SIZE.xl, fontWeight: 'bold', color: COLORS.textPrimary },
    content: { padding: SPACING.l },

    limitCard: {
        flexDirection: 'row',
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.m,
        padding: SPACING.m,
        marginBottom: SPACING.xl,
        borderWidth: 1,
        borderColor: COLORS.border,
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    limitLabel: { color: COLORS.textSecondary, fontSize: FONT_SIZE.s, marginBottom: 4 },
    limitValue: { color: COLORS.textPrimary, fontSize: FONT_SIZE.l, fontWeight: 'bold' },
    dividerVertical: { width: 1, height: '80%', backgroundColor: COLORS.border },

    formSection: { marginTop: SPACING.m },
    label: { color: COLORS.textSecondary, marginBottom: SPACING.s, fontSize: FONT_SIZE.m },
    input: {
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.m,
        padding: SPACING.m,
        color: COLORS.textPrimary,
        fontSize: FONT_SIZE.l,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginBottom: SPACING.l
    },
    amountInput: {
        fontSize: 32,
        fontWeight: 'bold',
        textAlign: 'center',
        letterSpacing: 2
    },
    btn: {
        backgroundColor: COLORS.primary,
        height: 56,
        borderRadius: BORDER_RADIUS.l,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: COLORS.primary,
        shadowOpacity: 0.3,
        elevation: 4
    },
    btnText: { color: '#FFF', fontSize: FONT_SIZE.l, fontWeight: 'bold' },

    recipientBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: COLORS.secondary,
        padding: SPACING.m,
        borderRadius: BORDER_RADIUS.m,
        marginBottom: SPACING.l
    },
    recipientName: { color: '#FFF', fontWeight: 'bold', fontSize: FONT_SIZE.m, marginLeft: SPACING.s },
    recipientMobile: { color: 'rgba(255,255,255,0.8)', marginLeft: SPACING.s }
});
