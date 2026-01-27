import { Redirect } from 'expo-router';
import { useMerchantStore } from '../store/merchantStore';

export default function Index() {
    const { isAuthenticated, merchant, isBiometricEnabled } = useMerchantStore();

    // 1. Not Logged In
    if (!isAuthenticated) {
        if (isBiometricEnabled && merchant) {
            return <Redirect href="/(auth)/unlock" />;
        }
        return <Redirect href="/(auth)/welcome" />;
    }

    // 2. Logged In but No Business Name -> Setup
    if (!merchant?.business_name) {
        return <Redirect href="/(auth)/setup-business" />;
    }

    // 3. Complete -> Home
    return <Redirect href="/(tabs)/home" />;
}
