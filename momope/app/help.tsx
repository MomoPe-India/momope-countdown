import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function HelpScreen() {
    const router = useRouter();

    const faqs = [
        {
            question: "How do I pay a merchant?",
            answer: "Tap 'Scan to Pay' on the home screen, scan the merchant's QR code, enter the amount and your secure PIN."
        },
        {
            question: "How can I check my balance?",
            answer: "Your current wallet balance is displayed at the top of the Home or Profile screen."
        },
        {
            question: "I forgot my PIN. What do I do?",
            answer: "Go to Profile > Security > Change PIN. If you cannot log in, please contact support immediately."
        },
        {
            question: "Is my transaction history visible?",
            answer: "Yes, you can check your past transactions in the 'History' tab or via the Profile menu."
        }
    ];

    const handleContact = () => {
        Linking.openURL('mailto:support@momope.com');
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
                <Text style={styles.title}>Help & Support</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.sectionHeader}>Frequently Asked Questions</Text>
                {faqs.map((faq, index) => (
                    <View key={index} style={styles.faqCard}>
                        <Text style={styles.question}>{faq.question}</Text>
                        <Text style={styles.answer}>{faq.answer}</Text>
                    </View>
                ))}

                <View style={styles.contactCard}>
                    <Ionicons name="headset" size={40} color={COLORS.primary} />
                    <Text style={styles.contactTitle}>Need more help?</Text>
                    <Text style={styles.contactText}>Our support team is available 24/7.</Text>
                    <TouchableOpacity style={styles.contactButton} onPress={handleContact}>
                        <Text style={styles.contactButtonText}>Contact Support</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.m,
        paddingTop: SPACING.xl,
        backgroundColor: COLORS.surface,
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
    },
    backButton: {
        marginRight: SPACING.m,
    },
    title: {
        fontSize: FONT_SIZE.l,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
    },
    content: {
        padding: SPACING.m,
        paddingBottom: 40,
    },
    sectionHeader: {
        fontSize: FONT_SIZE.m,
        fontWeight: 'bold',
        color: COLORS.textSecondary,
        marginBottom: SPACING.m,
        marginTop: SPACING.s,
    },
    faqCard: {
        backgroundColor: COLORS.surface,
        padding: SPACING.m,
        borderRadius: BORDER_RADIUS.m,
        marginBottom: SPACING.m,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    question: {
        fontSize: FONT_SIZE.m,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginBottom: SPACING.s,
    },
    answer: {
        fontSize: FONT_SIZE.s,
        color: COLORS.textSecondary,
        lineHeight: 20,
    },
    contactCard: {
        alignItems: 'center',
        backgroundColor: COLORS.surface,
        padding: SPACING.l,
        borderRadius: BORDER_RADIUS.l,
        marginTop: SPACING.l,
        borderWidth: 1,
        borderColor: COLORS.primary,
        borderStyle: 'dashed',
    },
    contactTitle: {
        fontSize: FONT_SIZE.l,
        fontWeight: 'bold',
        color: COLORS.textPrimary,
        marginVertical: SPACING.s,
    },
    contactText: {
        fontSize: FONT_SIZE.m,
        color: COLORS.textSecondary,
        marginBottom: SPACING.m,
        textAlign: 'center',
    },
    contactButton: {
        backgroundColor: COLORS.primary,
        paddingVertical: SPACING.m,
        paddingHorizontal: SPACING.xl,
        borderRadius: BORDER_RADIUS.m,
    },
    contactButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: FONT_SIZE.m,
    },
});
