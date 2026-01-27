import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS } from '../../constants/theme';
import { merchantService } from '../../services/api'; // We need to update this Service
import api from '../../services/api';
import { useMerchantStore } from '../../store/merchantStore';

export default function SetupBusinessScreen() {
    const router = useRouter();
    const { merchant, token, setAuth, logout } = useMerchantStore();

    const [businessName, setBusinessName] = useState('');
    const [category, setCategory] = useState('');
    const [pin, setPin] = useState('');
    const [loading, setLoading] = useState(false);

    // Verify Session
    useEffect(() => {
        if (!merchant || !token) {
            Alert.alert('Session Error', 'Please login again.', [{ text: 'OK', onPress: () => router.replace('/(auth)/login') }]);
        }
    }, [merchant, token]);

    const handleSave = async () => {
        if (!businessName.trim() || !category.trim() || pin.length !== 4) {
            Alert.alert('Incomplete Details', 'Please fill all fields.');
            return;
        }

        setLoading(true);
        try {
            // 1. Update Merchant Profile
            // Endpoint might need to be created in backend or we use /merchant/profile
            const updateRes = await api.post('/merchant/profile', {
                business_name: businessName,
                category: category // e.g. 'Retail', 'Food'
            });

            if (!updateRes.data.success) throw new Error(updateRes.data.message);

            // 2. Set PIN
            const pinRes = await api.post('/auth/pin/set', {
                mobile: merchant.mobile,
                pin: pin,
                role: 'MERCHANT'
            });

            if (!pinRes.data.success) throw new Error(pinRes.data.message);

            // 3. Sync Store
            const profileRes = await api.get('/merchant/profile');
            const data = profileRes.data.data; // Assuming structure { profile: {}, wallet: {} }
            const combined = { ...data.profile, wallet_balance: data.wallet?.balance || 0 };

            setAuth(token!, combined);

            Alert.alert('Success', 'Business Registered!', [
                { text: 'Start Selling', onPress: () => router.replace('/(tabs)/home') }
            ]);

        } catch (error: any) {
            console.error(error);
            const msg = error.response?.data?.message || 'Registration Failed';

            if (error.response?.status === 401) {
                logout();
                router.replace('/(auth)/login');
            } else {
                Alert.alert('Error', msg);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.inner}>
                    <StatusBar style="light" />
                    <View style={styles.header}>
                        <Text style={styles.title}>Business Details</Text>
                        <Text style={styles.subtitle}>Setup your merchant profile</Text>
                    </View>

                    <View style={styles.form}>
                        <Text style={styles.label}>Business Name</Text>
                        <TextInput style={styles.input} placeholder="Mohan Kirana Store" placeholderTextColor={COLORS.textTertiary} value={businessName} onChangeText={setBusinessName} />

                        <Text style={styles.label}>Category</Text>
                        <TextInput style={styles.input} placeholder="Retail, Food, Services..." placeholderTextColor={COLORS.textTertiary} value={category} onChangeText={setCategory} />

                        <Text style={styles.label}>Create 4-Digit Security PIN</Text>
                        <TextInput style={styles.input} placeholder="••••" placeholderTextColor={COLORS.textTertiary} keyboardType="number-pad" secureTextEntry maxLength={4} value={pin} onChangeText={setPin} />

                        <TouchableOpacity style={styles.button} onPress={handleSave} disabled={loading}>
                            {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.buttonText}>Register Business</Text>}
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    inner: { flex: 1, padding: SPACING.l, justifyContent: 'center' },
    header: { marginBottom: SPACING.xl },
    title: { fontSize: FONT_SIZE.xxl, color: COLORS.primary, fontWeight: 'bold' },
    subtitle: { fontSize: FONT_SIZE.m, color: COLORS.textSecondary },
    form: { gap: SPACING.m },
    label: { color: COLORS.textSecondary, fontWeight: '600' },
    input: { backgroundColor: COLORS.surface, padding: SPACING.m, borderRadius: BORDER_RADIUS.m, color: COLORS.textPrimary, borderWidth: 1, borderColor: COLORS.border },
    button: { backgroundColor: COLORS.primary, height: 50, borderRadius: BORDER_RADIUS.m, justifyContent: 'center', alignItems: 'center', marginTop: SPACING.l },
    buttonText: { color: '#FFF', fontSize: FONT_SIZE.l, fontWeight: 'bold' }
});
