import { Redirect } from 'expo-router';
import { useAuthStore } from '../store/authStore';

export default function Index() {
    const { isAuthenticated, user, token, isBiometricEnabled } = useAuthStore();

    // 1. Not Logged In
    if (!isAuthenticated) {
        // Check for "Locked" state (Biometric Enabled + User Exists)
        if (isBiometricEnabled && user) {
            return <Redirect href="/(auth)/unlock" />;
        }
        // Truly Logged Out -> Welcome
        return <Redirect href="/(auth)/welcome" />;
    }

    // 2. Logged In but No Name -> Setup Profile
    if (!user?.full_name) {
        return <Redirect href="/(auth)/setup-profile" />;
    }

    // 3. Logged In & Complete -> Home
    return <Redirect href="/(tabs)/home" />;
}
