'use client';

import { Shield, TrendingUp, Store, Users, Coffee, ShoppingBag, ArrowRight, Zap, CheckCircle, BedDouble } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ROICalculator from '@/components/landing/ROICalculator';

export default function SolutionsPage() {
    const [activeTab, setActiveTab] = useState<'retail' | 'food' | 'services' | 'hotels'>('retail');



    const industries = {
        retail: {
            title: "Retail & Kirana",
            desc: "For grocery stores, supermarkets, and fashion outlets.",
            icon: <ShoppingBag size={20} />,
            pillars: {
                accept: {
                    title: "Smart Payments that Never Fail.",
                    desc: "Built for high-volume, real-world stores. Accept Universal UPI payments instantly with our QR codes and Smart Soundboxes.",
                    bullets: [
                        { text: "High-uptime, reliable payments", icon: CheckCircle },
                        { text: "Instant settlement to any bank", icon: CheckCircle },
                        { text: "Loud & clear audio alerts", icon: CheckCircle }
                    ]
                },
                retain: {
                    title: "The Automated Loyalty Engine.",
                    desc: "Turn first-time visitors into repeat customers automatically. Unlike traditional loyalty programs, MomoPe rewards customers on every scan.",
                    bullets: [
                        { text: "Coins credited automatically", icon: CheckCircle },
                        { text: "Inventory-free reward redemption", icon: CheckCircle },
                        { text: "Zero staff training needed", icon: CheckCircle }
                    ]
                },
                grow: {
                    title: "Capital & Analytics.",
                    desc: "Understand your business today. Unlock growth opportunities tomorrow. Get insights on sales trends and qualify for growth capital.",
                    bullets: [
                        { text: "Real-time sales dashboard", icon: CheckCircle },
                        { text: "Growth offers based on history", icon: CheckCircle },
                        { text: "Customer behaviour insights", icon: CheckCircle }
                    ]
                }
            }
        },
        food: {
            title: "Restaurants & Cafes",
            desc: "For QSRs, dine-in restaurants, and food trucks.",
            icon: <Coffee size={20} />,
            pillars: {
                accept: {
                    title: "Pay-at-Table Speed.",
                    desc: "Keep tables turning during peak hours. Verify payments instantly without running back to the counter.",
                    bullets: [
                        { text: "Peak-hour fast payments", icon: Zap },
                        { text: "Pay-at-table QR verification", icon: CheckCircle },
                        { text: "Clear audio alerts for busy kitchens", icon: CheckCircle }
                    ]
                },
                retain: {
                    title: "Turn Diners into Regulars.",
                    desc: "Give them a reason to come back. Automated rewards make every meal feel special without slowing down service.",
                    bullets: [
                        { text: "Instant coins on bill payment", icon: CheckCircle },
                        { text: "Redeem for desserts/drinks", icon: CheckCircle },
                        { text: "No disruption to service flow", icon: CheckCircle }
                    ]
                },
                grow: {
                    title: "Menu & Peak Hour Insights.",
                    desc: "Know your busiest hours and top spending customers. Use data to optimize your menu and staffing.",
                    bullets: [
                        { text: "Peak hour sales tracking", icon: TrendingUp },
                        { text: "Identify high-value regulars", icon: CheckCircle },
                        { text: "Growth capital for expansion", icon: CheckCircle }
                    ]
                }
            }
        },
        services: {
            title: "Services & Salons",
            desc: "For salons, clinics, and repair shops.",
            icon: <Users size={20} />,
            pillars: {
                accept: {
                    title: "Seamless Client Experience.",
                    desc: "Professional payments that match your service quality. Works quietly alongside your appointment flow.",
                    bullets: [
                        { text: "Easy counter payments", icon: CheckCircle },
                        { text: "Silent confirmations option", icon: CheckCircle },
                        { text: "Works alongside appointments", icon: CheckCircle }
                    ]
                },
                retain: {
                    title: "Appointment Loyalty.",
                    desc: "Encourage clients to book their next visit sooner. High-value rewards for high-value services.",
                    bullets: [
                        { text: "Rewards for service bundles", icon: CheckCircle },
                        { text: "Higher retention for VIPs", icon: CheckCircle },
                        { text: "Redeem against next booking", icon: CheckCircle }
                    ]
                },
                grow: {
                    title: "Client Value Tracking.",
                    desc: "Identify your VIP clients and understand service trends. Grow your practice with data-backed decisions.",
                    bullets: [
                        { text: "Track average ticket size", icon: TrendingUp },
                        { text: "Client retention analytics", icon: CheckCircle },
                        { text: "Capital for equipment upgrades", icon: CheckCircle }
                    ]
                }
            }
        },
        hotels: {
            title: "Hotels & Stays",
            desc: "For hotels, lodges, and homestays.",
            icon: <BedDouble size={20} />,
            pillars: {
                accept: {
                    title: "Front Desk Efficiency.",
                    desc: "Speed up check-in and check-out with instant QR payments. Collect payments for room service or dining instantly.",
                    bullets: [
                        { text: "Express QR Check-out", icon: Zap },
                        { text: "Zero downtime at reception", icon: CheckCircle },
                        { text: "Room service payment links", icon: CheckCircle }
                    ]
                },
                retain: {
                    title: "Guest Loyalty Program.",
                    desc: "Encourage direct bookings and repeat stays. Reward guests for every night stayed or meal purchased.",
                    bullets: [
                        { text: "Rewards for direct booking", icon: CheckCircle },
                        { text: "Redeem on F&B or next stay", icon: CheckCircle },
                        { text: "VIP guest recognition", icon: CheckCircle }
                    ]
                },
                grow: {
                    title: "Occupancy & Revenue.",
                    desc: "Track peak seasons and high-spending guests. Use data to optimize room rates and seasonal offers.",
                    bullets: [
                        { text: "RevPAR & Sales tracking", icon: TrendingUp },
                        { text: "Seasonal growth insights", icon: CheckCircle },
                        { text: "Capital for renovation", icon: CheckCircle }
                    ]
                }
            }
        }
    };

    return (
        <div className="min-h-screen bg-white text-[#131B26]">
            <Navbar />

            <main>
                {/* 1. Hero Section */}
                <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 bg-[#131B26] text-white overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#2CB78A]/10 rounded-full blur-[100px]"></div>
                        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[100px]"></div>
                    </div>

                    <div className="container mx-auto px-6 relative z-10 text-center">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[#2CB78A] text-xs font-bold tracking-widest mb-6 uppercase backdrop-blur-sm"
                        >
                            The Merchant Growth Engine
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight"
                        >
                            More Than Payments. <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2CB78A] to-blue-400">Built for Business Growth.</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-gray-300 text-lg md:text-xl leading-relaxed font-medium max-w-3xl mx-auto mb-10"
                        >
                            From instant settlements to automated customer loyalty—MomoPe helps offline businesses accept, retain, and grow smarter every day, <span className="text-white font-semibold">with zero operational complexity.</span>
                        </motion.p>
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center"
                        >
                            <Link href="/contact">
                                <button className="bg-[#2CB78A] hover:bg-[#249671] text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg shadow-green-900/20 transition-all hover:scale-105">
                                    Become a Partner
                                </button>
                            </Link>
                            <a href="#download" className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-full font-bold text-lg transition-all">
                                Download Merchant App
                            </a>
                        </motion.div>
                    </div>
                </section>

                {/* 2. Industry Tabs */}
                <section className="py-12 bg-gray-50 border-b border-gray-200 sticky top-[72px] z-40 transition-all shadow-sm">
                    <div className="container mx-auto px-6">
                        <div className="flex flex-col items-center gap-4">
                            <div className="flex justify-center flex-wrap gap-2 bg-white p-2 rounded-full shadow-sm border border-gray-200">
                                {(Object.keys(industries) as Array<keyof typeof industries>).map((key) => (
                                    <button
                                        key={key}
                                        onClick={() => setActiveTab(key)}
                                        className={`px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 transition-all duration-300 ${activeTab === key
                                            ? 'bg-[#131B26] text-white shadow-md'
                                            : 'text-gray-500 hover:bg-gray-100'
                                            }`}
                                    >
                                        {industries[key].icon}
                                        {industries[key].title}
                                    </button>
                                ))}
                            </div>
                            <motion.p
                                key={activeTab}
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-sm font-medium text-gray-500"
                            >
                                Solutions designed for {industries[activeTab].title.toLowerCase()} businesses.
                            </motion.p>
                        </div>
                    </div>
                </section>

                {/* 3. The Merchant Growth Engine (3 Pillars) */}
                <section className="py-24 bg-white overflow-hidden">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-20">
                            <h2 className="text-3xl md:text-4xl font-bold text-[#131B26] mb-4">The Growth Engine</h2>
                            <p className="text-gray-500 max-w-2xl mx-auto">
                                Everything your offline business needs to accept payments, retain customers, and grow revenue.
                            </p>
                        </div>

                        {/* Pillar 1: Accept */}
                        <div className="flex flex-col lg:flex-row items-center gap-16 mb-24">
                            <motion.div
                                key={activeTab + '-accept'}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4 }}
                                className="lg:w-1/2"
                            >
                                <div className="inline-block px-4 py-1 rounded-full bg-blue-50 text-blue-600 font-bold text-sm mb-6">
                                    01. Accept
                                </div>
                                <h3 className="text-3xl font-bold mb-6 text-[#131B26]">{industries[activeTab].pillars.accept.title}</h3>
                                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                                    {industries[activeTab].pillars.accept.desc}
                                </p>
                                <ul className="space-y-4 mb-8">
                                    {industries[activeTab].pillars.accept.bullets.map((item, idx) => (
                                        <li key={idx} className="flex items-center gap-3 text-gray-700 font-medium">
                                            <item.icon className="text-[#2CB78A]" size={20} /> {item.text}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="lg:w-1/2 relative"
                            >
                                <div className="absolute inset-0 bg-blue-100 rounded-full blur-[80px] opacity-40"></div>
                                <img src="/assets/solutions/accept.png" alt="Accept Payments" className="relative z-10 w-full hover:scale-105 transition-transform duration-500 drop-shadow-2xl" />
                            </motion.div>
                        </div>

                        {/* Pillar 2: Retain */}
                        <div className="flex flex-col-reverse lg:flex-row items-center gap-16 mb-24">
                            <motion.div
                                initial={{ opacity: 0, x: -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="lg:w-1/2 relative"
                            >
                                <div className="absolute inset-0 bg-green-100 rounded-full blur-[80px] opacity-40"></div>
                                <img src="/assets/solutions/retain.png" alt="Retain Customers" className="relative z-10 w-full hover:scale-105 transition-transform duration-500 drop-shadow-2xl" />
                            </motion.div>
                            <motion.div
                                key={activeTab + '-retain'}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4 }}
                                className="lg:w-1/2"
                            >
                                <div className="inline-block px-4 py-1 rounded-full bg-green-50 text-[#2CB78A] font-bold text-sm mb-6">
                                    02. Retain
                                </div>
                                <h3 className="text-3xl font-bold mb-6 text-[#131B26]">{industries[activeTab].pillars.retain.title}</h3>
                                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                                    {industries[activeTab].pillars.retain.desc}
                                </p>
                                <ul className="space-y-4 mb-8">
                                    {industries[activeTab].pillars.retain.bullets.map((item, idx) => (
                                        <li key={idx} className="flex items-center gap-3 text-gray-700 font-medium">
                                            <item.icon className="text-[#2CB78A]" size={20} /> {item.text}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                        </div>

                        {/* Pillar 3: Grow */}
                        <div className="flex flex-col lg:flex-row items-center gap-16">
                            <motion.div
                                key={activeTab + '-grow'}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.4 }}
                                className="lg:w-1/2"
                            >
                                <div className="inline-block px-4 py-1 rounded-full bg-purple-50 text-purple-600 font-bold text-sm mb-6">
                                    03. Grow
                                </div>
                                <h3 className="text-3xl font-bold mb-6 text-[#131B26]">{industries[activeTab].pillars.grow.title}</h3>
                                <p className="text-gray-600 text-lg leading-relaxed mb-8">
                                    {industries[activeTab].pillars.grow.desc}
                                </p>
                                <ul className="space-y-4 mb-8">
                                    {industries[activeTab].pillars.grow.bullets.map((item, idx) => (
                                        <li key={idx} className="flex items-center gap-3 text-gray-700 font-medium">
                                            <item.icon className="text-[#2CB78A]" size={20} /> {item.text}
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, x: 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="lg:w-1/2 relative"
                            >
                                <div className="absolute inset-0 bg-purple-100 rounded-full blur-[80px] opacity-40"></div>
                                <img src="/assets/solutions/grow.png" alt="Business Growth" className="relative z-10 w-full hover:scale-105 transition-transform duration-500 drop-shadow-2xl" />
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* 3.5 ROI Calculator */}
                <ROICalculator />

                {/* 4. Loyalty Loop Diagram */}
                <section className="py-20 bg-gradient-to-br from-gray-50 to-white border-y border-gray-100">
                    <div className="container mx-auto px-6 text-center">
                        <h2 className="text-3xl font-bold mb-12 text-[#131B26]">The Loyalty Loop</h2>
                        <div className="max-w-xl mx-auto relative mb-8">
                            {/* Loop Labels (Absolute positioned around the circular image) */}
                            {/* Top: Pay */}
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-8 bg-white shadow-md border border-gray-100 px-4 py-1.5 rounded-full z-20 whitespace-nowrap">
                                <span className="font-bold text-sm text-[#131B26]">Scan & Pay</span>
                            </div>

                            {/* Right: Earn */}
                            <div className="absolute top-1/2 right-0 translate-x-12 -translate-y-1/2 bg-white shadow-md border border-gray-100 px-4 py-1.5 rounded-full z-20 whitespace-nowrap">
                                <span className="font-bold text-sm text-[#2CB78A]">Earn Coins</span>
                            </div>

                            {/* Bottom: Redeem */}
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-8 bg-white shadow-md border border-gray-100 px-4 py-1.5 rounded-full z-20 whitespace-nowrap">
                                <span className="font-bold text-sm text-purple-600">Redeem Rewards</span>
                            </div>

                            {/* Left: Repeat */}
                            <div className="absolute top-1/2 left-0 -translate-x-12 -translate-y-1/2 bg-white shadow-md border border-gray-100 px-4 py-1.5 rounded-full z-20 whitespace-nowrap">
                                <span className="font-bold text-sm text-blue-600">Return to Store</span>
                            </div>

                            <motion.img
                                initial={{ rotate: -90, opacity: 0 }}
                                whileInView={{ rotate: 0, opacity: 1 }}
                                transition={{ duration: 1 }}
                                viewport={{ once: true }}
                                src="/assets/solutions/loop.png"
                                alt="Loyalty Loop"
                                className="w-full h-auto drop-shadow-xl relative z-10"
                            />
                        </div>
                        <p className="text-lg font-medium text-gray-500 mt-12">
                            A simple loop that turns every payment into repeat business.
                        </p>
                    </div>
                </section>

                {/* 5. Closing CTA */}
                <section className="py-20 bg-[#131B26] text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#2CB78A]/10 rounded-full blur-[100px]"></div>
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px]"></div>

                    <div className="container mx-auto px-6 text-center relative z-10">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to grow your business?</h2>
                        <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
                            Join thousands of offline merchants using payments as a growth tool.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link href="/contact">
                                <button className="bg-[#2CB78A] hover:bg-[#249671] text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg shadow-green-900/20 transition-all hover:scale-105">
                                    Become a Partner
                                </button>
                            </Link>
                            <a href="#download" className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-4 rounded-full font-bold text-lg transition-all">
                                Download Merchant App
                            </a>
                        </div>
                    </div>
                </section>

                {/* 6. Trust Footer */}
                <section className="py-12 bg-white border-t border-gray-100">
                    <div className="container mx-auto px-6">
                        <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 text-gray-400 font-semibold uppercase tracking-wider text-sm">
                            <div className="flex items-center gap-2">
                                <Shield className="text-[#2CB78A]" size={20} />
                                RBI Compliant Payments
                            </div>
                            <div className="hidden md:block w-1 h-1 rounded-full bg-gray-300"></div>
                            <div className="flex items-center gap-2">
                                <Shield className="text-[#2CB78A]" size={20} />
                                Bank-Grade Infrastructure
                            </div>
                            <div className="hidden md:block w-1 h-1 rounded-full bg-gray-300"></div>
                            <div className="flex items-center gap-2">
                                <Shield className="text-[#2CB78A]" size={20} />
                                Transparent Rewards
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
