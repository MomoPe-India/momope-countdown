
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { COLORS, FONT_SIZE, SPACING, BORDER_RADIUS } from '../../constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

interface ActionPillProps {
    label: string;
    icon: keyof typeof Feather.glyphMap;
    onPress: () => void;
    color?: string; // Icon color
    isPrimary?: boolean; // Gradient Background?
    subtitle?: string; // Added for stats in business app
}

export default function ActionPill({ label, icon, onPress, color = COLORS.primary, isPrimary = false, subtitle }: ActionPillProps) {
    if (isPrimary) {
        return (
            <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.container}>
                <LinearGradient
                    colors={['#1f2937', '#111827']} // Darker for business premium feel
                    style={[styles.pill, styles.primaryPill]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <Feather name={icon} size={20} color="white" style={{ marginRight: 8 }} />
                    <View>
                        <Text style={[styles.label, { color: 'white' }]}>{label}</Text>
                        {subtitle && <Text style={[styles.subtitle, { color: 'rgba(255,255,255,0.7)' }]}>{subtitle}</Text>}
                    </View>
                </LinearGradient>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity onPress={onPress} style={[styles.container, styles.pill, styles.glassPill]}>
            <View style={[styles.iconBox, { backgroundColor: color + '15' }]}>
                <Feather name={icon} size={18} color={color} />
            </View>
            <View>
                <Text style={styles.label}>{label}</Text>
                {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        marginRight: SPACING.m,
        marginBottom: SPACING.m,
        flex: 1, // Allow flex grow for grid
        minWidth: '45%',
    },
    pill: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.m,
        paddingVertical: 14,
        borderRadius: BORDER_RADIUS.xl,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.5)',
    },
    primaryPill: {
        borderWidth: 0,
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    glassPill: {
        backgroundColor: 'rgba(255,255,255,0.8)',
    },
    iconBox: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.s,
    },
    label: {
        fontSize: FONT_SIZE.s,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    subtitle: {
        fontSize: 10,
        fontWeight: '500',
        color: COLORS.textSecondary,
    }
});
