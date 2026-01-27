import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS } from '../../constants/theme';
import api, { userService } from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';

// Ensure WebBrowser can close properly
WebBrowser.maybeCompleteAuthSession();

export default function PayScreen() {
    const router = useRouter();
    const { merchantId, merchantName } = useLocalSearchParams();
    const [amount, setAmount] = useState('');
    const [pin, setPin] = useState('');
    const [loading, setLoading] = useState(false);
    const [useCoins, setUseCoins] = useState(false); // New State
    const { user, token, setAuth } = useAuthStore();
    const [isSessionReady, setIsSessionReady] = useState(false);

    // Backend URL (Assuming active local dev)
    // In production, this would be https://momope.com
    const WEB_APP_URL = 'http://192.168.55.101:3000';

    useEffect(() => {
        checkSession();
    }, [user]);

    const checkSession = async () => {
        if (user && user.mobile) {
            setIsSessionReady(true);
        } else {
            console.log('User data missing in PayScreen, fetching profile...');
            await fetchProfile();
        }
    };

    const fetchProfile = async () => {
        try {
            const res = await userService.getProfile();
            if (res.data.success) {
                const currentToken = useAuthStore.getState().token;
                if (currentToken) {
                    const profileData = res.data.data.profile;
                    const coinsData = res.data.data.coins;
                    const combinedUser = { ...profileData, wallet_balance: coinsData?.balance_available || 0 };
                    setAuth(currentToken, combinedUser);
                    setIsSessionReady(true);
                }
            } else {
                Alert.alert('Session Expired', 'Please login again.');
                router.replace('/(auth)/login');
            }
        } catch (error) {
            console.error('Profile fetch failed:', error);
            Alert.alert('Connection Error', 'Could not fetch user profile.');
        }
    };

    const handlePay = async () => {
        if (!isSessionReady) return;

        if (!user || !user.mobile) {
            Alert.alert('Error', 'User session invalid. Please re-login.');
            return;
        }

        if (!amount || Number(amount) < 1) {
            Alert.alert('Invalid Amount', 'Minimum payment Amount is ₹1.');
            return;
        }
        if (pin.length !== 4) {
            Alert.alert('Invalid PIN', 'Please enter your 4-digit PIN.');
            return;
        }

        if (!merchantId) {
            Alert.alert('Error', 'Invalid Merchant ID. Please rescan QR.');
            return;
        }

        console.log('[PayScreen] Starting Payment to:', merchantId, merchantName);

        setLoading(true);
        try {
            // 1. Verify PIN First (Security Check)
            const verifyRes = await api.post('/auth/pin/verify', {
                mobile: user.mobile,
                pin,
                role: 'CUSTOMER'
            });

            if (!verifyRes.data.success) {
                Alert.alert('Authentication Failed', 'Incorrect PIN.');
                setLoading(false);
                return;
            }

            // 2. Create Razorpay Order on Backend
            const orderRes = await api.post('/payment/create-order', {
                amount: Number(amount),
                merchantId: merchantId, // Critical Fix
                description: `Payment to ${merchantName}`,
                use_coins: useCoins
            });

            if (!orderRes.data.success) {
                Alert.alert('Error', 'Could not initiate payment.');
                setLoading(false);
                return;
            }

            const { id: order_id, key_id, amount: fiatPaise, coins_used, gross_amount } = orderRes.data.data;
            const redirectUrl = Linking.createURL('payment-callback');

            // 3. Open Web Browser for Payment
            const paymentUrl = `${WEB_APP_URL}/pay_bridge.html?order_id=${order_id}&key_id=${key_id}&amount=${fiatPaise}&merchant_name=${encodeURIComponent(merchantName as string)}&mobile=${user.mobile}&redirect_url=${encodeURIComponent(redirectUrl)}`;

            const result = await WebBrowser.openAuthSessionAsync(paymentUrl, redirectUrl);

            if (result.type === 'success' && result.url) {
                // 4. Handle Success Redirect
                const { queryParams } = Linking.parse(result.url);
                if (queryParams?.status === 'success') {
                    await verifyAndMint(queryParams, Number(gross_amount), String(merchantName), coins_used);
                } else {
                    Alert.alert('Cancelled', 'Payment was cancelled.');
                }
            } else {
                // User closed manually or cancelled
                setLoading(false);
            }

        } catch (error: any) {
            console.error('Payment Error:', error);
            const msg = error.response?.data?.message || 'Network Error';
            Alert.alert('Error', msg);
        } finally {
            setLoading(false);
        }
    };

    const verifyAndMint = async (params: any, txAmount: number, recipientName: string, coinsUsed: number = 0) => {
        try {
            const res = await api.post('/payment/verify-mint', {
                order_id: params.razorpay_order_id,
                payment_id: params.razorpay_payment_id,
                signature: params.razorpay_signature,
                merchant_id: merchantId,
                amount: txAmount,
                coins_burnt: coinsUsed,
                description: `Paid to ${recipientName}`
            });

            if (res.data.success) {
                // Refresh Profile to show new coins
                fetchProfile();

                // Navigate to Success (Root level)
                router.replace({
                    pathname: '/success',
                    params: {
                        amount: String(txAmount),
                        recipient: recipientName,
                        txId: params.razorpay_payment_id,
                        coinsEarned: res.data.data.coins_earned // Pass coins earned to success screen
                    }
                });
            } else {
                Alert.alert('Verification Failed', 'Payment successful but verification failed.');
            }
        } catch (error) {
            console.error('Verify Mint Error', error);
            Alert.alert('Error', 'Could not verify payment.');
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.inner}>

                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                            <Feather name="arrow-left" size={24} color={COLORS.textPrimary} />
                        </TouchableOpacity>
                        <Text style={styles.title}>Paying {merchantName || 'Merchant'}</Text>
                    </View>

                    {/* Amount Input */}
                    <View style={styles.amountContainer}>
                        <Text style={styles.currencySymbol}>₹</Text>
                        <TextInput
                            style={styles.amountInput}
                            placeholder="0"
                            placeholderTextColor={COLORS.textTertiary}
                            keyboardType="number-pad"
                            value={amount}
                            onChangeText={setAmount}
                            autoFocus
                        />
                    </View>

                    {/* PIN Input */}
                    <View style={styles.pinContainer}>
                        <Text style={styles.label}>Enter 4-Digit PIN to Pay</Text>
                        <TextInput
                            style={styles.pinInput}
                            placeholder="••••"
                            placeholderTextColor={COLORS.textTertiary}
                            keyboardType="number-pad"
                            secureTextEntry
                            maxLength={4}
                            value={pin}
                            onChangeText={setPin}
                        />
                    </View>

                    {/* Redemption Section */}
                    {Number(amount) > 0 && (
                        <View style={styles.redemptionCard}>
                            <View style={styles.redemptionRow}>
                                <View>
                                    <Text style={styles.redemptionTitle}>Redeem Momo Coins</Text>
                                    <Text style={styles.redemptionSub}>
                                        Available: {Math.floor(user?.wallet_balance || 0)} 🏆
                                    </Text>
                                </View>
                                <TouchableOpacity
                                    onPress={() => setUseCoins(!useCoins)}
                                    style={[styles.toggleBtn, useCoins && styles.toggleActive]}
                                >
                                    <View style={[styles.toggleKnob, useCoins && styles.knobActive]} />
                                </TouchableOpacity>
                            </View>

                            {useCoins && (
                                <View style={styles.redemptioDetails}>
                                    <Text style={styles.infoText}>
                                        Coin Limit: {Math.min(Math.floor((user?.wallet_balance || 0) * 0.8), Math.floor(Number(amount) * 0.5))}
                                        <Text style={{ fontSize: 10 }}> (Min(80% Bal, 50% Bill))</Text>
                                    </Text>
                                    <View style={styles.mathRow}>
                                        <Text style={styles.mathLabel}>Bill Amount</Text>
                                        <Text style={styles.mathValue}>₹{amount}</Text>
                                    </View>
                                    <View style={styles.mathRow}>
                                        <Text style={styles.mathLabel}>Coins Applied</Text>
                                        <Text style={[styles.mathValue, { color: COLORS.primary }]}>
                                            - {Math.min(Math.floor((user?.wallet_balance || 0) * 0.8), Math.floor(Number(amount) * 0.5))}
                                        </Text>
                                    </View>
                                    <View style={[styles.divider, { marginVertical: 8 }]} />
                                    <View style={styles.mathRow}>
                                        <Text style={styles.netLabel}>Net Payable</Text>
                                        <Text style={styles.netValue}>
                                            ₹{Number(amount) - Math.min(Math.floor((user?.wallet_balance || 0) * 0.8), Math.floor(Number(amount) * 0.5))}
                                        </Text>
                                    </View>
                                </View>
                            )}
                        </View>
                    )}

                    {/* Pay Button */}
                    <TouchableOpacity
                        style={[styles.payButton, loading && styles.disabledBtn]}
                        onPress={handlePay}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFF" />
                        ) : (
                            <Text style={styles.payBtnText}>Pay ₹{amount || '0'} via Razorpay</Text>
                        )}
                    </TouchableOpacity>

                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    inner: { flex: 1, padding: SPACING.l },
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: SPACING.xl, marginTop: SPACING.l },
    backBtn: { padding: SPACING.s, marginRight: SPACING.m },
    title: { fontSize: FONT_SIZE.xl, color: COLORS.textPrimary, fontWeight: 'bold' },

    amountContainer: { alignItems: 'center', flexDirection: 'row', justifyContent: 'center', marginBottom: SPACING.xxl },
    currencySymbol: { fontSize: 40, color: COLORS.textPrimary, marginRight: SPACING.s, fontWeight: 'bold' },
    amountInput: { fontSize: 60, color: COLORS.textPrimary, fontWeight: 'bold', minWidth: 100, textAlign: 'center' },

    pinContainer: { marginBottom: SPACING.xxl },
    label: { color: COLORS.textSecondary, marginBottom: SPACING.s, textAlign: 'center' },
    pinInput: {
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.m,
        fontSize: FONT_SIZE.xl,
        color: COLORS.textPrimary,
        padding: SPACING.m,
        textAlign: 'center',
        letterSpacing: 8,
        borderWidth: 1,
        borderColor: COLORS.border
    },

    payButton: {
        backgroundColor: COLORS.primary,
        height: 60,
        borderRadius: BORDER_RADIUS.l,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 'auto', // Push to bottom
        marginBottom: SPACING.l,
        shadowColor: COLORS.primary,
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 6
    },
    disabledBtn: { opacity: 0.7 },
    payBtnText: { color: '#FFF', fontSize: FONT_SIZE.l, fontWeight: 'bold' },

    redemptionCard: {
        backgroundColor: COLORS.surface,
        borderRadius: BORDER_RADIUS.m,
        padding: SPACING.m,
        marginBottom: SPACING.l,
        borderWidth: 1,
        borderColor: COLORS.border
    },
    redemptionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    redemptionTitle: { color: COLORS.textPrimary, fontWeight: 'bold', fontSize: FONT_SIZE.m },
    redemptionSub: { color: COLORS.textSecondary, fontSize: FONT_SIZE.s },
    toggleBtn: { width: 50, height: 28, backgroundColor: COLORS.border, borderRadius: 14, padding: 2 },
    toggleActive: { backgroundColor: COLORS.primary },
    toggleKnob: { width: 24, height: 24, backgroundColor: '#FFF', borderRadius: 12 },
    knobActive: { alignSelf: 'flex-end' },

    redemptioDetails: { marginTop: SPACING.m, paddingTop: SPACING.m, borderTopWidth: 1, borderTopColor: COLORS.border },
    infoText: { color: COLORS.textTertiary, fontSize: FONT_SIZE.s, marginBottom: SPACING.s, fontStyle: 'italic' },
    mathRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
    mathLabel: { color: COLORS.textSecondary },
    mathValue: { color: COLORS.textPrimary, fontWeight: '600' },
    divider: { height: 1, backgroundColor: COLORS.border },
    netLabel: { color: COLORS.textPrimary, fontWeight: 'bold' },
    netValue: { color: COLORS.primary, fontWeight: 'bold', fontSize: FONT_SIZE.l }
});
