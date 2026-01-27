'use client';

import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function StickyMobileCTA() {
    const [isVisible, setIsVisible] = useState(false);
    const [isClosed, setIsClosed] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show after scrolling 300px
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (isClosed) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 200, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 200, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="fixed bottom-4 left-4 right-4 z-[100] md:hidden"
                >
                    {/* Gradient Border Wrapper */}
                    <div className="p-[1px] rounded-[24px] bg-gradient-to-r from-white/10 via-white/30 to-white/10 shadow-2xl relative">

                        {/* Main Card Content */}
                        <div className="relative bg-[#121212]/95 backdrop-blur-2xl rounded-[23px] p-4 flex items-center gap-3 overflow-hidden">

                            {/* Running Shine Animation */}
                            <motion.div
                                animate={{ x: ['-100%', '200%'] }}
                                transition={{ duration: 3, repeat: Infinity, repeatDelay: 5, ease: "linear" }}
                                className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 pointer-events-none"
                            />

                            {/* Close Button - Clean & Inside */}
                            <button
                                onClick={() => setIsClosed(true)}
                                className="absolute top-2 right-2 p-1 text-white/20 hover:text-white/80 transition-colors z-10"
                            >
                                <X size={14} />
                            </button>

                            {/* App Icon */}
                            <div className="relative w-14 h-14 rounded-2xl bg-white p-1 flex items-center justify-center flex-shrink-0 shadow-lg shadow-black/50">
                                <img src="/assets/favicon.png" alt="MomoPe" className="w-full h-full object-contain" />
                            </div>

                            {/* Text Content */}
                            <div className="flex-1 min-w-0 py-1">
                                <h3 className="font-bold text-base text-white leading-tight mb-0.5">MomoPe App</h3>
                                <p className="text-xs text-gray-400 truncate mb-1">Scan, Pay & Earn Rewards</p>

                                {/* Rating Pills */}
                                <div className="flex items-center gap-1.5">
                                    <div className="flex text-[#FFD700]">
                                        {[1, 2, 3, 4, 5].map(i => (
                                            <span key={i} className="text-[10px]">★</span>
                                        ))}
                                    </div>
                                    <span className="text-[10px] font-medium text-gray-500">4.9 • FREE</span>
                                </div>
                            </div>

                            {/* Install Button - High Contrast */}
                            <a
                                href="https://www.whatsapp.com/channel/0029VbBhoLk7z4kiZU9cBz1U"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <motion.button
                                    whileTap={{ scale: 0.95 }}
                                    animate={{
                                        boxShadow: [
                                            "0 0 0 rgba(44, 183, 138, 0)",
                                            "0 0 20px rgba(44, 183, 138, 0.4)",
                                            "0 0 0 rgba(44, 183, 138, 0)"
                                        ]
                                    }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="bg-[#2CB78A] text-white px-5 py-2.5 rounded-xl text-sm font-bold border border-white/20"
                                >
                                    Get
                                </motion.button>
                            </a>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
