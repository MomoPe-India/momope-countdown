import { Tabs } from 'expo-router';
import { Home, ScanLine, Gift, User } from 'lucide-react-native';

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#ffffff',
                    borderTopColor: '#f1f5f9',
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                },
                tabBarActiveTintColor: '#2CB78A',
                tabBarInactiveTintColor: '#94a3b8',
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    href: '/(tabs)/home',
                    title: 'Home',
                    tabBarIcon: ({ color }) => <Home size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="scan"
                options={{
                    href: '/(tabs)/scan', // Ensure this matches actual file
                    title: 'Pay',
                    tabBarIcon: ({ color }) => (
                        <div className="bg-[#2CB78A] p-3 rounded-full -mt-8 border-4 border-white shadow-lg">
                            <ScanLine size={24} color="white" />
                        </div>
                    ),
                    // We'll replace the div with View since this is native code
                    tabBarIcon: ({ color, focused }) => <ScanLine size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="rewards"
                options={{
                    href: '/(tabs)/rewards',
                    title: 'Rewards',
                    tabBarIcon: ({ color }) => <Gift size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    href: '/(tabs)/profile',
                    title: 'Profile',
                    tabBarIcon: ({ color }) => <User size={24} color={color} />,
                }}
            />
        </Tabs>
    );
}
