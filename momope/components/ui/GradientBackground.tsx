
import React from 'react';
import { StyleSheet, View, ViewProps } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../../constants/theme';

interface GradientBackgroundProps extends ViewProps {
    children: React.ReactNode;
}

export default function GradientBackground({ children, style, ...props }: GradientBackgroundProps) {
    return (
        <View style={[styles.container, style]} {...props}>
            {/* Main Background Gradient - Dark Premium */}
            <LinearGradient
                colors={['#ffffff', '#f0fdf4', '#d1fae5']}
                // Using very subtle Green/White mix for Light Mode "Fresh Fintech" look
                // Or if we want Dark Mode: ['#131B26', '#0f2922']
                // Let's stick to the website's clean light theme for now, or match the user preferences?
                // The prompt asked for "Fintech Modern". The website uses white + blobs.
                // Let's use a subtle top-down fade.
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />

            {/* Decorative Top Mesh (Optional - mimicking the blobs) */}
            <LinearGradient
                colors={['rgba(44, 183, 138, 0.15)', 'transparent']}
                style={[StyleSheet.absoluteFill, { height: 300 }]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />

            {children}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
});
