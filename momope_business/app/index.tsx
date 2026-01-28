import { Redirect } from 'expo-router';

export default function Index() {
    // Temporary redirect to Auth until we have state
    return <Redirect href="/(auth)/login" />;
}
