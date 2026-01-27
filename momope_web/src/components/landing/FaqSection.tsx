'use client';

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
    {
        question: "Is MomoPe safe to use?",
        answer: "Absolutely. MomoPe is 100% RBI compliant and uses PCI-DSS certified infrastructure to ensure your payments are always secure. We use bank-grade encryption for all transactions."
    },
    {
        question: "How do I earn Momo Coins?",
        answer: "You earn Momo Coins on every single transaction you make using the app. Scan any UPI QR code, pay via MomoPe, and you'll receive coins instantly. These can be redeemed for cash or exclusive vouchers."
    },
    {
        question: "Are there any hidden fees for merchants?",
        answer: "No. We believe in complete transparency. Merchants pay a small platform fee only on successful transactions. There are no setup fees, annual maintenance charges, or hidden deductions."
    },
    {
        question: "How fast are the settlements?",
        answer: "Settlements are processed daily. For most banks, the money is credited to your registered account by 8:00 AM the next day (T+1 settlement cycle)."
    }
];

export default function FaqSection() {
    return (
        <section className="py-24 bg-gray-50 border-t border-gray-200">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4 text-gray-900">Frequently Asked Questions</h2>
                    <p className="text-gray-600">
                        Everything you need to know about MomoPe.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                        >
                            <details className="group">
                                <summary className="flex justify-between items-center font-bold cursor-pointer list-none p-6 text-gray-900">
                                    <span className="text-lg">{faq.question}</span>
                                    <span className="transition group-open:rotate-180">
                                        <ChevronDown size={20} className="text-gray-400" />
                                    </span>
                                </summary>
                                <div className="text-gray-600 px-6 pb-6 pt-0 leading-relaxed border-t border-gray-50 mt-2">
                                    <div className="pt-4">
                                        {faq.answer}
                                    </div>
                                </div>
                            </details>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
