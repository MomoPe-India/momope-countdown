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

    const isRecommended = (cardType: 'email' | 'phone') => {
        if (cardType === 'email') return ['all', 'partnership'].includes(contactReason);
        if (cardType === 'phone') return ['support', 'merchant'].includes(contactReason);
        return false;
    };

    {/* Actionable Contact Cards - Redesigned Horizontal Layout */ }
    <div className="grid md:grid-cols-3 gap-6 mb-24">
        {/* Email Card */}
        <a href="mailto:support@momope.com" className={`group bg-white p-6 rounded-2xl shadow-lg shadow-gray-200/40 hover:shadow-xl hover:shadow-green-500/10 hover:-translate-y-1 transition-all duration-300 border relative overflow-hidden flex flex-col ${isRecommended('email') ? 'border-[#2CB78A] ring-1 ring-[#2CB78A]/20' : 'border-gray-100 hover:border-gray-200'}`}>
            {isRecommended('email') && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-[#2CB78A] to-emerald-500 text-white text-[9px] font-extrabold px-3 py-1 rounded-bl-lg uppercase tracking-wider shadow-sm z-20">
                    Recommended
                </div>
            )}

            {/* Horizontal Header Row */}
            <div className="flex items-start gap-4 mb-1 relative z-10">
                <div className={`relative w-10 h-10 flex-shrink-0 mt-1 transition-colors rounded-lg flex items-center justify-center ${isRecommended('email') ? 'bg-[#2CB78A]/10 text-[#2CB78A]' : 'bg-gray-50 text-gray-400 group-hover:bg-[#2CB78A]/10 group-hover:text-[#2CB78A]'}`}>
                    <Mail size={20} strokeWidth={2.5} />
                </div>
                <div className="flex-1 min-w-0 pt-1">
                    <h3 className={`font-bold text-lg transition-colors leading-tight mb-0.5 ${isRecommended('email') ? 'text-gray-900' : 'text-gray-700 group-hover:text-gray-900'}`}>Email Us</h3>
                    <p className="text-gray-500 text-xs">For general queries & support</p>
                </div>
            </div>

            {/* Status Badge */}
            <div className="mb-6 pl-[56px]">
                <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-md border border-green-100/50">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                    Replies within 24 hours
                </div>
            </div>

            {/* Action Link at Bottom */}
            <div className="mt-auto pl-[56px]">
                <span className="text-[#131B26] font-bold text-sm group-hover:text-[#2CB78A] transition-colors flex items-center gap-2">
                    Send an Email
                    <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#2CB78A]" />
                </span>
                <p className="text-xs text-slate-400 mt-1 font-medium">support@momope.com</p>
            </div>
        </a>

        {/* Phone Card */}
        <a href="tel:+918639831132" className={`group bg-white p-6 rounded-2xl shadow-lg shadow-gray-200/40 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300 border relative overflow-hidden flex flex-col ${isRecommended('phone') ? 'border-blue-500 ring-1 ring-blue-500/20' : 'border-gray-100 hover:border-gray-200'}`}>
            {isRecommended('phone') && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-blue-500 to-cyan-500 text-white text-[9px] font-extrabold px-3 py-1 rounded-bl-lg uppercase tracking-wider shadow-sm z-20">
                    Recommended
                </div>
            )}

            {/* Horizontal Header Row */}
            <div className="flex items-start gap-4 mb-1 relative z-10">
                <div className={`relative w-10 h-10 flex-shrink-0 mt-1 transition-colors rounded-lg flex items-center justify-center ${isRecommended('phone') ? 'bg-blue-50 text-blue-600' : 'bg-gray-50 text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-600'}`}>
                    <Phone size={20} strokeWidth={2.5} />
                </div>
                <div className="flex-1 min-w-0 pt-1">
                    <h3 className={`font-bold text-lg transition-colors leading-tight mb-0.5 ${isRecommended('phone') ? 'text-gray-900' : 'text-gray-700 group-hover:text-gray-900'}`}>Call Us</h3>
                    <p className="text-gray-500 text-xs">Mon-Fri, 9am - 6pm IST</p>
                </div>
            </div>

            {/* Status Badge */}
            <div className="mb-6 pl-[56px]">
                <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100/50">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    Real-time support
                </div>
            </div>

            {/* Action Link at Bottom */}
            <div className="mt-auto pl-[56px]">
                <span className="text-[#131B26] font-bold text-sm group-hover:text-blue-600 transition-colors flex items-center gap-2">
                    Call Now
                    <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-blue-600" />
                </span>
                <p className="text-xs text-slate-400 mt-1 font-medium">+91 8639831132</p>
            </div>
        </a>

        {/* Visit Card */}
        <a
            href="https://maps.google.com/?q=MomoPe+Digital+Hub+Pvt+Ltd+Krishnapuram+Kadapa"
            target="_blank"
            rel="noopener noreferrer"
            className="group bg-white p-6 rounded-2xl shadow-lg shadow-gray-200/40 hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1 transition-all duration-300 border border-gray-100 hover:border-gray-200 relative overflow-hidden flex flex-col"
        >
            {/* Horizontal Header Row */}
            <div className="flex items-start gap-4 mb-1 relative z-10">
                <div className="relative w-10 h-10 flex-shrink-0 mt-1 bg-gray-50 text-gray-400 group-hover:bg-purple-50 group-hover:text-purple-600 transition-colors rounded-lg flex items-center justify-center">
                    <MapPin size={20} strokeWidth={2.5} />
                </div>
                <div className="flex-1 min-w-0 pt-1">
                    <h3 className="font-bold text-lg text-gray-700 group-hover:text-gray-900 transition-colors leading-tight mb-0.5">Visit HQ</h3>
                    <p className="text-gray-500 text-xs">MomoPe Digital Hub Pvt Ltd</p>
                </div>
            </div>

            {/* Status Badge */}
            <div className="mb-6 pl-[56px]">
                <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-100/50">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>
                    By appointment
                </div>
            </div>

            {/* Action Link at Bottom */}
            <div className="mt-auto pl-[56px]">
                <span className="text-[#131B26] font-bold text-sm group-hover:text-purple-600 transition-colors flex items-center gap-2">
                    Get Directions
                    <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-purple-600" />
                </span>
                <p className="text-xs text-slate-400 mt-1 font-medium truncate">YSR Kadapa, AP</p>
            </div>
        </a>
    </div>
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
                    {/* Actionable Contact Cards - Redesigned Horizontal Layout */}
                    <div className="grid md:grid-cols-3 gap-6 mb-24">
                        {/* Email Card */}
                        <a href="mailto:support@momope.com" className={`group bg-white p-6 rounded-2xl shadow-lg shadow-gray-200/40 hover:shadow-xl hover:shadow-green-500/10 hover:-translate-y-1 transition-all duration-300 border relative overflow-hidden flex flex-col ${isRecommended('email') ? 'border-[#2CB78A] ring-1 ring-[#2CB78A]/20' : 'border-gray-100 hover:border-[#2CB78A]/30'}`}>
                            {isRecommended('email') && (
                                <div className="absolute top-0 right-0 bg-gradient-to-l from-[#2CB78A] to-emerald-500 text-white text-[9px] font-extrabold px-3 py-1 rounded-bl-lg uppercase tracking-wider shadow-sm z-20">
                                    Recommended
                                </div>
                            )}

                            {/* Horizontal Header Row */}
                            <div className="flex items-start gap-4 mb-3 relative z-10">
                                <div className="relative w-10 h-10 flex-shrink-0 mt-1">
                                    <div className="absolute inset-0 bg-[#2CB78A]/10 rounded-lg group-hover:bg-[#2CB78A]/20 transition-colors"></div>
                                    <div className="absolute inset-0 flex items-center justify-center text-[#2CB78A]">
                                        <Mail size={20} strokeWidth={2.5} />
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-[#2CB78A] transition-colors leading-tight mb-0.5 mt-0.5">Email Us</h3>
                                    <p className="text-gray-500 text-xs">For general queries & support</p>
                                </div>
                            </div>

                            {/* Status Badge */}
                            <div className="mb-6 pl-[56px]">
                                <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-md border border-green-100/50">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                    Replies within 24 hours
                                </div>
                            </div>

                            {/* Action Link at Bottom */}
                            <div className="mt-auto pl-[56px]">
                                <span className="text-[#131B26] font-bold text-sm group-hover:text-[#2CB78A] transition-colors flex items-center gap-2">
                                    support@momope.com
                                    <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-[#2CB78A]" />
                                </span>
                            </div>
                        </a>

                        {/* Phone Card */}
                        <a href="tel:+918639831132" className={`group bg-white p-6 rounded-2xl shadow-lg shadow-gray-200/40 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300 border relative overflow-hidden flex flex-col ${isRecommended('phone') ? 'border-blue-500 ring-1 ring-blue-500/20' : 'border-gray-100 hover:border-blue-400/30'}`}>
                            {isRecommended('phone') && (
                                <div className="absolute top-0 right-0 bg-gradient-to-l from-blue-500 to-cyan-500 text-white text-[9px] font-extrabold px-3 py-1 rounded-bl-lg uppercase tracking-wider shadow-sm z-20">
                                    Recommended
                                </div>
                            )}

                            {/* Horizontal Header Row */}
                            <div className="flex items-start gap-4 mb-3 relative z-10">
                                <div className="relative w-10 h-10 flex-shrink-0 mt-1">
                                    <div className="absolute inset-0 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors"></div>
                                    <div className="absolute inset-0 flex items-center justify-center text-blue-600">
                                        <Phone size={20} strokeWidth={2.5} />
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors leading-tight mb-0.5 mt-0.5">Call Us</h3>
                                    <p className="text-gray-500 text-xs">Mon-Fri, 9am - 6pm IST</p>
                                </div>
                            </div>

                            {/* Status Badge */}
                            <div className="mb-6 pl-[56px]">
                                <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100/50">
                                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                                    Currently Available
                                </div>
                            </div>

                            {/* Action Link at Bottom */}
                            <div className="mt-auto pl-[56px]">
                                <span className="text-[#131B26] font-bold text-sm group-hover:text-blue-600 transition-colors flex items-center gap-2">
                                    +91 8639831132
                                    <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-blue-600" />
                                </span>
                            </div>
                        </a>

                        {/* Visit Card */}
                        <a
                            href="https://maps.google.com/?q=MomoPe+Digital+Hub+Pvt+Ltd+Krishnapuram+Kadapa"
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`group bg-white p-6 rounded-2xl shadow-lg shadow-gray-200/40 hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1 transition-all duration-300 border relative overflow-hidden flex flex-col ${isRecommended('visit') ? 'border-purple-500 ring-1 ring-purple-500/20' : 'border-gray-100 hover:border-purple-400/30'}`}
                        >
                            {isRecommended('visit') && (
                                <div className="absolute top-0 right-0 bg-gradient-to-l from-purple-500 to-fuchsia-500 text-white text-[9px] font-extrabold px-3 py-1 rounded-bl-lg uppercase tracking-wider shadow-sm z-20">
                                    Recommended
                                </div>
                            )}

                            {/* Horizontal Header Row */}
                            <div className="flex items-start gap-4 mb-3 relative z-10">
                                <div className="relative w-10 h-10 flex-shrink-0 mt-1">
                                    <div className="absolute inset-0 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-colors"></div>
                                    <div className="absolute inset-0 flex items-center justify-center text-purple-600">
                                        <MapPin size={20} strokeWidth={2.5} />
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-purple-600 transition-colors leading-tight mb-0.5 mt-0.5">Visit HQ</h3>
                                    <p className="text-gray-500 text-xs">MomoPe Digital Hub Pvt Ltd</p>
                                </div>
                            </div>

                            {/* Status Badge */}
                            <div className="mb-6 pl-[56px]">
                                <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md border border-purple-100/50">
                                    <MapPin size={10} /> Registered Office
                                </div>
                            </div>

                            {/* Action Link at Bottom */}
                            <div className="mt-auto pl-[56px]">
                                <span className="text-[#131B26] font-bold text-xs leading-relaxed group-hover:text-purple-600 transition-colors block">
                                    4/106, Krishnapuram, YSR Kadapa<br />
                                    Andhra Pradesh – 516003
                                </span>
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

