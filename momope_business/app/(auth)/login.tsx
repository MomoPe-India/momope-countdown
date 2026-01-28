import { View, Text, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

export default function LoginScreen() {
    return (
        <View className="flex-1 justify-center items-center bg-white p-6">
            <View className="w-20 h-20 bg-[#2CB78A]/10 rounded-full flex items-center justify-center mb-6">
                <Text className="text-3xl">🏪</Text>
            </View>
            <Text className="text-2xl font-bold text-[#131B26] mb-2">MomoPe Business</Text>
            <Text className="text-gray-500 text-center mb-8">
                Accept payments, track settlements & grow your business.
            </Text>

            <Link href="/(tabs)/home" asChild>
                <TouchableOpacity className="w-full bg-[#2CB78A] py-4 rounded-xl items-center shadow-lg shadow-green-500/20">
                    <Text className="text-white font-bold text-lg">Login as Merchant</Text>
                </TouchableOpacity>
            </Link>
        </View>
    );
}
