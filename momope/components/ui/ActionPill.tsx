
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
}

export default function ActionPill({ label, icon, onPress, color = COLORS.primary, isPrimary = false }: ActionPillProps) {
    if (isPrimary) {
        return (
            <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.container}>
                <LinearGradient
                    colors={['#2CB78A', '#249671']}
                    style={[styles.pill, styles.primaryPill]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <Feather name={icon} size={20} color="white" style={{ marginRight: 8 }} />
                    <Text style={[styles.label, { color: 'white' }]}>{label}</Text>
                </LinearGradient>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity onPress={onPress} style={[styles.container, styles.pill, styles.glassPill]}>
            <View style={[styles.iconBox, { backgroundColor: color + '15' }]}>
                <Feather name={icon} size={18} color={color} />
            </View>
            <Text style={styles.label}>{label}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        marginRight: SPACING.m,
        marginBottom: SPACING.m,
    },
    pill: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.m,
        paddingVertical: 12,
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
        backgroundColor: 'rgba(255,255,255,0.7)',
    },
    iconBox: {
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.s,
    },
    label: {
        fontSize: FONT_SIZE.s,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    }
});
