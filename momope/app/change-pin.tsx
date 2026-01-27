import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';
import { userService } from '../services/api';
import { Ionicons } from '@expo/vector-icons';

export default function ChangePinScreen() {
    const router = useRouter();
    const [oldPin, setOldPin] = useState('');
    const [newPin, setNewPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChangePin = async () => {
        if (!oldPin || !newPin || !confirmPin) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (newPin !== confirmPin) {
            Alert.alert('Error', 'New PINs do not match');
            return;
        }

        if (newPin.length !== 4) {
            Alert.alert('Error', 'PIN must be 4 digits');
            return;
        }

        setLoading(true);
        try {
            const res = await userService.updatePin(oldPin, newPin);
            if (res.data.success) {
                Alert.alert('Success', 'PIN updated successfully', [
                    { text: 'OK', onPress: () => router.back() }
                ]);
            } else {
                Alert.alert('Error', res.data.message || 'Failed to update PIN');
            }
        } catch (error: any) {
            Alert.alert('Error', error.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.title}>Change PIN</Text>
            </View>

            <View style={styles.form}>
                <Text style={styles.label}>Current PIN</Text>
                <TextInput
                    style={styles.input}
                    value={oldPin}
                    onChangeText={setOldPin}
                    keyboardType="numeric"
                    maxLength={4}
                    secureTextEntry
                    placeholder="Enter current PIN"
                    placeholderTextColor={COLORS.textTertiary}
                />

                <Text style={styles.label}>New PIN</Text>
                <TextInput
                    style={styles.input}
                    value={newPin}
                    onChangeText={setNewPin}
                    keyboardType="numeric"
                    maxLength={4}
                    secureTextEntry
                    placeholder="Enter new PIN"
                    placeholderTextColor={COLORS.textTertiary}
                />

                <Text style={styles.label}>Confirm New PIN</Text>
                <TextInput
                    style={styles.input}
                    value={confirmPin}
                    onChangeText={setConfirmPin}
                    keyboardType="numeric"
                    maxLength={4}
                    secureTextEntry
                    placeholder="Re-enter new PIN"
                    placeholderTextColor={COLORS.textTertiary}
                />

                <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={handleChangePin}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={styles.buttonText}>Update PIN</Text>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        padding: SPACING.m,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: SPACING.l,
        marginBottom: SPACING.xl,
    },
    backButton: {
        padding: SPACING.s,
        marginRight: SPACING.m,
    },
    title: {
        fontSize: FONT_SIZE.xl,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    form: {
        flex: 1,
    },
    label: {
        color: COLORS.textSecondary,
        marginBottom: SPACING.s,
        fontSize: FONT_SIZE.m,
    },
    input: {
        backgroundColor: COLORS.surface,
        color: COLORS.textPrimary,
        padding: SPACING.m,
        borderRadius: BORDER_RADIUS.m,
        fontSize: FONT_SIZE.l,
        marginBottom: SPACING.l,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    button: {
        backgroundColor: COLORS.primary,
        padding: SPACING.m,
        borderRadius: BORDER_RADIUS.m,
        alignItems: 'center',
        marginTop: SPACING.l,
    },
    buttonDisabled: {
        opacity: 0.7,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: FONT_SIZE.m,
    },
});
