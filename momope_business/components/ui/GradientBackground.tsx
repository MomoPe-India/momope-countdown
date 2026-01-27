
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
            {/* Main Background Gradient - Dark Premium for Merchants? Or keep light like customer? 
                Let's go with a slightly more professional "Business" look. 
                Maybe a very subtle blue/grey tint. 
            */}
            <LinearGradient
                colors={['#ffffff', '#f4f6f8', '#e0e7ff']}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />

            {/* Decorative Top Mesh */}
            <LinearGradient
                colors={['rgba(20, 184, 166, 0.05)', 'transparent']}
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
