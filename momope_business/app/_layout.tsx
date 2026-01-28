import { Stack } from 'expo-router';
import "../global.css";
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';

export default function RootLayout() {
    return (
        <View className="flex-1 bg-white">
            <StatusBar style="dark" />
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="(auth)" />
            </Stack>
        </View>
    );
}
