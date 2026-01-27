import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Button, Modal, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Camera, CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS } from '../../constants/theme';
import { Feather } from '@expo/vector-icons';
import api from '../../services/api';

export default function ScanScreen() {
    const router = useRouter();
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);

    // Manual Entry State
    const [manualVisible, setManualVisible] = useState(false);
    const [manualMobile, setManualMobile] = useState('');
    const [loading, setLoading] = useState(false);

    if (!permission) {
        return <View style={styles.container} />;
    }

    if (!permission.granted) {
        return (
            <View style={styles.container}>
                <Text style={styles.permissionText}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
        );
    }

    const handleBarCodeScanned = ({ type, data }: { type: string, data: string }) => {
        setScanned(true);
        console.log('Scanned Data:', data);
        try {
            const parsed = JSON.parse(data);
            if (parsed.type === 'MERCHANT_PAY' && parsed.merchantId) {
                router.push({
                    pathname: '/(tabs)/pay',
                    params: {
                        merchantId: parsed.merchantId,
                        merchantName: parsed.name,
                        mobile: parsed.mobile
                    }
                });
            } else if (parsed.type === 'P2P_PAY' && parsed.id) {
                router.push({
                    pathname: '/(tabs)/pay',
                    params: {
                        merchantId: parsed.id,
                        merchantName: parsed.name,
                        mobile: parsed.mobile,
                        isP2P: 'true'
                    }
                });
            } else {
                Alert.alert('Invalid QR', 'This QR code is not supported.');
                setScanned(false);
            }
        } catch (e) {
            Alert.alert('Read Error', 'Could not read QR code data.');
            setScanned(false);
        }
    };

    const handleManualLookup = async () => {
        if (manualMobile.length !== 10) {
            Alert.alert('Invalid Number', 'Please enter a 10-digit mobile number.');
            return;
        }

        setLoading(true);
        try {
            const res = await api.post('/user/lookup', { mobile: manualMobile });
            if (res.data.success) {
                const user = res.data.data;
                const isMerchant = user.role === 'MERCHANT';

                setManualVisible(false);
                setManualMobile('');
                setScanned(true); // Prevent background scanning

                router.push({
                    pathname: '/(tabs)/pay',
                    params: {
                        merchantId: user.id,
                        merchantName: isMerchant ? user.business_name : user.full_name,
                        mobile: user.mobile,
                        isP2P: isMerchant ? undefined : 'true'
                    }
                });
            } else {
                Alert.alert('Not Found', 'User/Merchant not found.');
            }
        } catch (error) {
            Alert.alert('Error', 'Could not search user.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <CameraView
                style={styles.camera}
                facing="back"
                onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
                barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
            >
                <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                    <Feather name="arrow-left" size={28} color="#FFF" />
                </TouchableOpacity>

                <View style={styles.overlay}>
                    <View style={styles.topOverlay}>
                        <Text style={styles.scanText}>Scan MomoPe QR Code</Text>
                    </View>
                    <View style={styles.centerRow}>
                        <View style={styles.sideOverlay} />
                        <View style={styles.focused} />
                        <View style={styles.sideOverlay} />
                    </View>
                    <View style={styles.bottomOverlay}>
                        <Text style={styles.hintText}>Align QR code within the frame</Text>

                        <TouchableOpacity style={styles.manualBtn} onPress={() => setManualVisible(true)}>
                            <Feather name="edit-2" size={16} color="white" />
                            <Text style={styles.manualBtnText}>Enter Mobile Number</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </CameraView>

            {/* Manual Entry Modal */}
            <Modal
                visible={manualVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setManualVisible(false)}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Enter Mobile Number</Text>
                                <TouchableOpacity onPress={() => setManualVisible(false)}>
                                    <Feather name="x" size={24} color={COLORS.textSecondary} />
                                </TouchableOpacity>
                            </View>

                            <Text style={styles.modalSubtitle}>Pay anyone on MomoPe using their number</Text>

                            <TextInput
                                style={styles.input}
                                placeholder="99999 99999"
                                placeholderTextColor={COLORS.textTertiary}
                                keyboardType="number-pad"
                                maxLength={10}
                                value={manualMobile}
                                onChangeText={setManualMobile}
                                autoFocus
                            />

                            <TouchableOpacity
                                style={[styles.payBtn, loading && styles.disabledBtn]}
                                onPress={handleManualLookup}
                                disabled={loading}
                            >
                                {loading ? <ActivityIndicator color="white" /> : <Text style={styles.payBtnText}>Proceed to Pay</Text>}
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
                </TouchableWithoutFeedback>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000', justifyContent: 'center' },
    camera: { flex: 1 },
    backButton: { position: 'absolute', top: 50, left: 20, zIndex: 10, padding: 8, backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 20 },
    permissionText: { color: '#FFF', textAlign: 'center', marginBottom: 20 },

    overlay: { flex: 1, backgroundColor: 'transparent' },
    topOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center', paddingTop: 40 },
    scanText: { color: '#FFF', fontSize: FONT_SIZE.l, fontWeight: 'bold', marginTop: 20 },

    centerRow: { height: 250, flexDirection: 'row' },
    sideOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
    focused: { width: 250, height: 250, borderWidth: 2, borderColor: COLORS.primary, backgroundColor: 'transparent' },

    bottomOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' },
    hintText: { color: COLORS.textTertiary, fontSize: FONT_SIZE.m, marginBottom: 20 },

    manualBtn: {
        flexDirection: 'row', alignItems: 'center', gap: 8,
        backgroundColor: 'rgba(255,255,255,0.2)', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 30,
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)'
    },
    manualBtnText: { color: 'white', fontWeight: 'bold', fontSize: FONT_SIZE.m },

    modalContainer: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalContent: { backgroundColor: COLORS.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: SPACING.l, paddingBottom: 40 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: SPACING.s },
    modalTitle: { fontSize: FONT_SIZE.xl, fontWeight: 'bold', color: COLORS.textPrimary },
    modalSubtitle: { fontSize: FONT_SIZE.m, color: COLORS.textTertiary, marginBottom: SPACING.l },

    input: {
        backgroundColor: COLORS.background, borderWidth: 1, borderColor: COLORS.border, borderRadius: BORDER_RADIUS.m,
        padding: SPACING.m, fontSize: FONT_SIZE.l, color: COLORS.textPrimary, marginBottom: SPACING.l,
        textAlign: 'center', letterSpacing: 2, fontWeight: 'bold'
    },
    payBtn: { backgroundColor: COLORS.primary, height: 56, borderRadius: BORDER_RADIUS.l, justifyContent: 'center', alignItems: 'center' },
    payBtnText: { color: 'white', fontWeight: 'bold', fontSize: FONT_SIZE.l },
    disabledBtn: { opacity: 0.7 }
});
