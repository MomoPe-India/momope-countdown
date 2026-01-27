'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Store, Users } from 'lucide-react';
import MerchantSplitContent from './MerchantSplitContent';
import CustomerSplitContent from './CustomerSplitContent';
import { useLandingStore } from '@/store/landingStore';

export default function EcosystemCurtain() {
    const { activeTab, setActiveTab } = useLandingStore();

    return (
        <section id="ecosystem" className="relative overflow-hidden min-h-[1100px] md:min-h-[900px] border-t border-white/5 bg-slate-950">
            {/* Design Highlight: Top Gradient Line */}
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#2CB78A] to-transparent opacity-50 z-50" />

            {/* Floating Tab Switcher (Top Center) */}
            <div className="absolute top-10 left-1/2 -translate-x-1/2 z-30 flex items-center p-1.5 bg-zinc-900/90 backdrop-blur-2xl rounded-full border border-white/30 shadow-[0_8px_32px_rgba(0,0,0,0.5)] ring-1 ring-white/10">
                <button
                    onClick={() => setActiveTab('merchants')}
                    className="relative px-4 md:px-8 py-2 md:py-3 rounded-full transition-all focus:outline-none"
                    style={{
                        color: activeTab === 'merchants' ? '#ffffff' : '#9ca3af'
                    }}
                >
                    {activeTab === 'merchants' && (
                        <motion.div
                            layoutId="active-tab-bg"
                            className="absolute inset-0 bg-[#2CB78A] rounded-full shadow-[0_0_20px_rgba(44,183,138,0.4)]"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                        <Store className="w-5 h-5 md:w-6 md:h-6" />
                        <span className="hidden md:inline font-bold text-sm">Business</span>
                    </span>
                </button>

                <button
                    onClick={() => setActiveTab('customers')}
                    className="relative px-4 md:px-8 py-2 md:py-3 rounded-full transition-all focus:outline-none"
                    style={{
                        color: activeTab === 'customers' ? '#ffffff' : '#9ca3af'
                    }}
                >
                    {activeTab === 'customers' && (
                        <motion.div
                            layoutId="active-tab-bg"
                            className="absolute inset-0 bg-[#2CB78A] rounded-full shadow-[0_0_20px_rgba(44,183,138,0.4)]"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                        <Users className="w-5 h-5 md:w-6 md:h-6" />
                        <span className="hidden md:inline font-bold text-sm">Users</span>
                    </span>
                </button>
            </div>

            {/* Content Area (Switching Views) */}
            <div className="relative w-full min-h-[1100px] md:min-h-[900px]">
                <AnimatePresence mode="wait">
                    {activeTab === 'merchants' ? (
                        <motion.div
                            key="merchants"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.02 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            className="w-full min-h-[1100px] md:min-h-[900px] absolute inset-0 z-10"
                        >
                            <MerchantSplitContent isExpanded={true} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="customers"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.02 }}
                            transition={{ duration: 0.5, ease: "easeInOut" }}
                            className="w-full min-h-[1100px] md:min-h-[900px] absolute inset-0 z-10 bg-white"
                        >
                            <CustomerSplitContent isExpanded={true} />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

        </section>
    );
}
