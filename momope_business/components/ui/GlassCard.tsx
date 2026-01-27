
import React from 'react';
import { StyleSheet, View, ViewProps, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { COLORS, BORDER_RADIUS, SPACING } from '../../constants/theme';

interface GlassCardProps extends ViewProps {
    children: React.ReactNode;
    intensity?: number;
    variant?: 'light' | 'dark';
}

export default function GlassCard({ children, style, intensity = 20, variant = 'light', ...props }: GlassCardProps) {
    return (
        <View style={[styles.container, style, Platform.OS === 'android' && styles.androidFallback]}>
            {Platform.OS === 'ios' ? (
                <BlurView intensity={intensity} tint={variant} style={StyleSheet.absoluteFill} />
            ) : (
                <View style={[StyleSheet.absoluteFill, styles.androidOverlay]} />
            )}
            <View style={styles.content}>
                {children}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderRadius: BORDER_RADIUS.l,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.4)',
        // Shadow for depth
        shadowColor: COLORS.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
        backgroundColor: 'transparent',
    },
    androidFallback: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
    },
    androidOverlay: {
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
    },
    content: {
        padding: SPACING.l,
        zIndex: 1,
    }
});
