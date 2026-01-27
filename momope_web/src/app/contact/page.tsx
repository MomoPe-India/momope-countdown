'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Mail, MapPin, Phone, HelpCircle, ArrowRight, ChevronDown, ChevronUp, MessageCircle, Clock, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ContactPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [contactReason, setContactReason] = useState<string>('all');
    const [faqCategory, setFaqCategory] = useState<'customer' | 'merchant'>('customer');

    const toggleFaq = (index: number) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const handleReasonSelect = (reasonId: string) => {
        setContactReason(reasonId);
        if (reasonId === 'merchant') setFaqCategory('merchant');
        else if (reasonId === 'support') setFaqCategory('customer');
        else if (reasonId === 'all') setFaqCategory('customer');
    };

    const isRecommended = (cardType: 'email' | 'phone' | 'visit') => {
        if (contactReason === 'all') return false;
        if (contactReason === 'support' && (cardType === 'email' || cardType === 'phone')) return true;
        if (contactReason === 'merchant' && (cardType === 'phone')) return true;
        if (contactReason === 'partnership' && (cardType === 'email' || cardType === 'visit')) return true;
        return false;
    };

    const reasons = [
        { id: 'all', label: 'General Inquiry' },
        { id: 'support', label: 'Technical Support' },
        { id: 'merchant', label: 'Merchant Onboarding' },
        { id: 'partnership', label: 'Partnerships' }
    ];

    const faqs = {
        customer: [
            { q: "How do I reset my transaction PIN?", a: "Open the MomoPe app, go to Settings > Security > Reset PIN. You will need to verify your mobile number via OTP." },
            { q: "Where can I see my Momo Coins balance?", a: "Your coin balance is displayed at the top of the home screen in the Customer App. Tap it to see your transaction history." },
            { q: "Is MomoPe safe to use?", a: "Absolutely. We are PCI-DSS compliant and use bank-grade encryption to secure every transaction." }
        ],
        merchant: [
            { q: "How do I initiate a refund?", a: "Log in to the MomoPe Business Dashboard, find the transaction in 'History', and tap 'Refund'. The amount will be credited back to the customer instantly." },
            { q: "When are settlements processed?", a: "Settlements are processed automatically at 12:00 AM daily. You receive funds in your bank account by 9:00 AM the next morning." },
            { q: "How do I add a new cashier?", a: "Go to Settings > Staff Management in your Business App and invite a new user via their mobile number." }
        ]
    };

    return (
        <div className="min-h-screen bg-gray-50 text-[#131B26]">
            <Navbar />

            <main>
                {/* Hero Section */}
                <section className="relative pt-32 pb-20 bg-[#131B26] overflow-hidden text-white">
                    <div className="absolute inset-0 z-0">
                        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#2CB78A]/10 rounded-full blur-[100px] animate-pulse"></div>
                        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px] animate-pulse delay-1000"></div>
                        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
                    </div>

                    <div className="container mx-auto px-6 relative z-10 text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2CB78A]/20 border border-[#2CB78A]/30 text-[#2CB78A] text-xs font-bold tracking-widest mb-6 uppercase">
                            <span className="w-2 h-2 rounded-full bg-[#2CB78A] animate-pulse"></span>
                            24/7 Priority Support
                        </div>
                        <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
                            How can we <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2CB78A] to-blue-400">help you?</span>
                        </h1>
                        <p className="text-gray-300 text-lg mb-12 max-w-2xl mx-auto">
                            Choose a topic below to find the best way to contact us.
                        </p>

                        {/* Contact Reason Selector */}
                        <div className="flex flex-wrap justify-center gap-3 mb-8">
                            {reasons.map((r) => (
                                <button
                                    key={r.id}
                                    onClick={() => handleReasonSelect(r.id)}
                                    className={`px-6 py-3 rounded-full text-sm font-bold transition-all ${contactReason === r.id
                                        ? 'bg-[#2CB78A] text-white shadow-lg shadow-green-500/30 scale-105'
                                        : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
                                        }`}
                                >
                                    {r.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </section>

                <div className="container mx-auto px-6 py-16 -mt-20 relative z-20">
                    {/* Actionable Contact Cards */}
                    <div className="grid md:grid-cols-3 gap-6 mb-24">
                        {/* Email Card */}
                        <a href="mailto:support@momope.com" className={`group bg-gradient-to-br from-white via-white to-green-50/30 p-8 rounded-3xl shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-green-500/20 hover:-translate-y-3 transition-all duration-500 border relative overflow-hidden ${isRecommended('email') ? 'border-[#2CB78A] ring-4 ring-[#2CB78A]/10' : 'border-gray-100'}`}>
                            {/* Background Gradient Orb */}
                            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-[#2CB78A]/10 to-teal-400/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>

                            {isRecommended('email') && (
                                <div className="absolute top-0 right-0 bg-gradient-to-r from-[#2CB78A] to-teal-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider shadow-lg">
                                    Recommended
                                </div>
                            )}
                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">
                                <ArrowRight className="text-[#2CB78A]" />
                            </div>

                            {/* Enhanced Icon with Gradient Background */}
                            <div className="relative w-16 h-16 mb-6 group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-500">
                                <div className="absolute inset-0 bg-gradient-to-br from-[#2CB78A] to-teal-500 rounded-2xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
                                <div className="absolute inset-0 bg-gradient-to-br from-[#2CB78A]/20 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
                                <div className="relative w-full h-full bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl flex items-center justify-center text-[#2CB78A] group-hover:from-green-100 group-hover:to-teal-100 transition-colors shadow-lg shadow-green-500/10 group-hover:shadow-green-500/20">
                                    <Mail size={28} className="group-hover:scale-110 transition-transform" />
                                </div>
                            </div>

                            <h3 className="font-bold text-xl mb-2 text-gray-900 group-hover:text-[#2CB78A] transition-colors">Email Us</h3>
                            <p className="text-gray-500 text-sm mb-4">For general queries & support</p>
                            <div className="flex items-center gap-2 text-xs font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full w-fit mb-4 group-hover:bg-green-100 transition-colors">
                                <Clock size={12} /> Replies within 24 hours
                            </div>
                            <span className="text-[#2CB78A] font-bold text-lg group-hover:underline decoration-2 underline-offset-4">support@momope.com</span>
                        </a>

                        {/* Phone Card */}
                        <a href="tel:+918639831132" className={`group bg-gradient-to-br from-white via-white to-blue-50/30 p-8 rounded-3xl shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-blue-500/20 hover:-translate-y-3 transition-all duration-500 border relative overflow-hidden ${isRecommended('phone') ? 'border-blue-500 ring-4 ring-blue-500/10' : 'border-gray-100'}`}>
                            {/* Background Gradient Orb */}
                            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-blue-400/10 to-cyan-400/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>

                            {isRecommended('phone') && (
                                <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider shadow-lg">
                                    Recommended
                                </div>
                            )}
                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">
                                <ArrowRight className="text-blue-600" />
                            </div>

                            {/* Enhanced Icon with Gradient Background */}
                            <div className="relative w-16 h-16 mb-6 group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-500">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
                                <div className="relative w-full h-full bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:from-blue-100 group-hover:to-cyan-100 transition-colors shadow-lg shadow-blue-500/10 group-hover:shadow-blue-500/20">
                                    <Phone size={28} className="group-hover:scale-110 transition-transform" />
                                </div>
                            </div>

                            <h3 className="font-bold text-xl mb-2 text-gray-900 group-hover:text-blue-600 transition-colors">Call Us</h3>
                            <p className="text-gray-500 text-sm mb-4">Mon-Fri, 9am - 6pm IST</p>
                            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full w-fit mb-4 group-hover:bg-blue-100 transition-colors">
                                <CheckCircle size={12} /> Currently Available
                            </div>
                            <span className="text-blue-600 font-bold text-lg group-hover:underline decoration-2 underline-offset-4">+91 8639831132</span>
                        </a>

                        {/* Visit Card */}
                        <a
                            href="https://maps.google.com/?q=MomoPe+Digital+Hub+Pvt+Ltd+Krishnapuram+Kadapa"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`group bg-gradient-to-br from-white via-white to-purple-50/30 p-8 rounded-3xl shadow-xl shadow-gray-200/50 hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-3 transition-all duration-500 border relative overflow-hidden ${isRecommended('visit') ? 'border-purple-500 ring-4 ring-purple-500/10' : 'border-gray-100'}`}
                        >
                            {/* Background Gradient Orb */}
                            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-purple-400/10 to-pink-400/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>

                            {isRecommended('visit') && (
                                <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl uppercase tracking-wider shadow-lg">
                                    Recommended
                                </div>
                            )}
                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">
                                <ArrowRight className="text-purple-600" />
                            </div>

                            {/* Enhanced Icon with Gradient Background */}
                            <div className="relative w-16 h-16 mb-6 group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-500">
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl opacity-10 group-hover:opacity-20 transition-opacity"></div>
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all"></div>
                                <div className="relative w-full h-full bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl flex items-center justify-center text-purple-600 group-hover:from-purple-100 group-hover:to-pink-100 transition-colors shadow-lg shadow-purple-500/10 group-hover:shadow-purple-500/20">
                                    <MapPin size={28} className="group-hover:scale-110 transition-transform" />
                                </div>
                            </div>

                            <h3 className="font-bold text-xl mb-2 text-gray-900 group-hover:text-purple-600 transition-colors">Visit HQ</h3>
                            <p className="text-gray-500 text-sm mb-4">MomoPe Digital Hub Pvt Ltd</p>
                            <div className="flex items-center gap-2 text-xs font-semibold text-purple-600 bg-purple-50 px-3 py-1 rounded-full w-fit mb-4 group-hover:bg-purple-100 transition-colors">
                                <MapPin size={12} /> Registered Office
                            </div>
                            <div className="text-gray-700 text-sm leading-relaxed font-medium group-hover:text-purple-700 transition-colors">
                                4/106, Krishnapuram, YSR Kadapa<br />
                                Andhra Pradesh – 516003
                            </div>
                        </a>
                    </div>

                    {/* Social Proof */}
                    <div className="text-center mb-24 opacity-80">
                        <p className="text-gray-500 font-medium flex items-center justify-center gap-2">
                            <span className="flex text-yellow-400"><CheckCircle className="text-green-500 mr-2" size={20} /> Trusted by 10,000+ merchants across India</span>
                        </p>
                    </div>

                    {/* FAQ Section */}
                    <div className="max-w-3xl mx-auto mb-20">
                        <h2 className="text-3xl font-bold mb-8 text-center text-[#131B26]">Frequently Asked Questions</h2>

                        {/* FAQ Tabs */}
                        <div className="flex justify-center gap-4 mb-8">
                            <button
                                onClick={() => setFaqCategory('customer')}
                                className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${faqCategory === 'customer' ? 'bg-[#131B26] text-white' : 'bg-white text-gray-500 border hover:bg-gray-50'}`}
                            >
                                Customer FAQs
                            </button>
                            <button
                                onClick={() => setFaqCategory('merchant')}
                                className={`px-6 py-2 rounded-full font-bold text-sm transition-all ${faqCategory === 'merchant' ? 'bg-[#131B26] text-white' : 'bg-white text-gray-500 border hover:bg-gray-50'}`}
                            >
                                Merchant FAQs
                            </button>
                        </div>

                        <div className="space-y-4">
                            {faqs[faqCategory].map((faq, i) => (
                                <div key={i} className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:border-[#2CB78A]/50 transition-colors">
                                    <button
                                        onClick={() => toggleFaq(i)}
                                        className="w-full flex items-center justify-between p-6 text-left"
                                    >
                                        <h3 className="font-bold text-gray-900 text-lg">{faq.q}</h3>
                                        {openFaq === i ? <ChevronUp className="text-[#2CB78A]" /> : <ChevronDown className="text-gray-400" />}
                                    </button>
                                    <AnimatePresence>
                                        {openFaq === i && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="px-6 pb-6"
                                            >
                                                <p className="text-gray-600 leading-relaxed border-t pt-4 border-gray-100">{faq.a}</p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>

                        <div className="mt-10 text-center">
                            <p className="text-gray-500 mb-4">Didn't find what you're looking for?</p>
                            <a href="mailto:support@momope.com" className="inline-flex items-center gap-2 text-[#2CB78A] font-bold hover:underline">
                                Contact our support team <ArrowRight size={16} />
                            </a>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}

