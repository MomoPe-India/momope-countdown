'use client';

import { motion } from 'framer-motion';
import { TrendingUp, QrCode, ShieldCheck, ArrowRight, Gift } from 'lucide-react';

export default function MerchantSplitContent({ isExpanded }: { isExpanded: boolean }) {
    return (
        <div className="h-full flex flex-col md:flex-row items-center justify-center px-6 md:px-32 relative overflow-hidden bg-slate-950 pt-32 md:pt-24">
            {/* Background Logo Watermark - Right Side */}
            <div className="absolute top-1/2 right-[-20%] md:right-[5%] -translate-y-1/2 pointer-events-none z-0">
                <img
                    src="/logo.png"
                    alt="MomoPe Logo"
                    className="w-[300px] h-[300px] md:w-[600px] md:h-[600px] object-contain drop-shadow-[0_0_60px_rgba(44,183,138,0.5)]"
                />
            </div>

            {/* Design Highlight: Cyber Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(44,183,138,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(44,183,138,0.03)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)] pointer-events-none" />

            {/* Ambient Blur */}
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#2CB78A]/5 rounded-full blur-[120px] pointer-events-none" />

            {/* Content Container - Left Side Focus */}
            <div className="max-w-4xl relative z-10 mr-auto w-full flex flex-col justify-start md:justify-center items-start h-full">
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2CB78A]/10 border border-[#2CB78A]/20 text-[#2CB78A] text-xs md:text-sm font-bold tracking-widest uppercase mb-6"
                >
                    For Business
                </motion.div>

                <motion.h2
                    layoutId="merchant-title"
                    className="text-4xl md:text-7xl font-black text-white mb-6 leading-[1.1]"
                >
                    Grow Your Business. <br />
                    <span className="text-[#2CB78A]">Effortlessly.</span>
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-gray-400 text-lg md:text-xl mb-10 leading-relaxed font-light max-w-xl md:max-w-2xl"
                >
                    Accept UPI payments with <b className="text-white font-medium">zero setup friction</b>, get faster settlements, and manage customers, rewards, and insights—all from one powerful dashboard.
                </motion.p>

                {/* Feature Grid - Compact Spacing */}
                <div className="grid gap-4 md:gap-6">
                    {[
                        { icon: TrendingUp, title: "Instant Settlements", desc: "Get settled the same day, straight to bank." },
                        { icon: QrCode, title: "Universal QR", desc: "Accept GPay, PhonePe, Paytm with one code." },
                        { icon: ShieldCheck, title: "Bank-Grade Security", desc: "PCI-DSS compliant infrastructure." },
                        { icon: Gift, title: "Built-in Customer Rewards", desc: "Turn payments into repeat customers." }
                    ].map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + (idx * 0.1) }}
                            className="flex items-center gap-4 md:gap-6 group"
                        >
                            <div className="p-3 md:p-4 rounded-xl bg-[#2CB78A]/10 text-[#2CB78A] group-hover:bg-[#2CB78A] group-hover:text-white transition-colors">
                                <item.icon size={24} className="md:w-8 md:h-8" />
                            </div>
                            <div>
                                <h3 className="text-white font-bold text-xl md:text-2xl">{item.title}</h3>
                                <p className="text-gray-500 text-sm md:text-lg mt-1">{item.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mt-10"
                >
                    <a href="/contact" className="bg-[#2CB78A] text-white px-8 py-4 rounded-full font-bold hover:bg-[#249671] transition-all flex items-center gap-2 group shadow-[0_0_20px_rgba(44,183,138,0.3)] hover:shadow-[0_0_30px_rgba(44,183,138,0.5)]">
                        Create Merchant Account
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                </motion.div>
            </div>
        </div>
    );
}
