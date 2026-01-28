"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Smartphone, Bell, CheckCircle, ArrowRight } from 'lucide-react';
import Image from 'next/image';

export default function AppLaunchPopup() {
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Check if user has already seen the popup
        const hasSeenPopup = localStorage.getItem('momope_launch_popup_seen');

        if (!hasSeenPopup) {
            // Show popup after 3 seconds delay
            const timer = setTimeout(() => {
                setIsOpen(true);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleClose = () => {
        setIsOpen(false);
        // Mark as seen so it doesn't show again in this session/browser
        // setItem to expiry? Simple boolean is fine for now usually.
        // We can set it to session storage if we want it to show again next visit, 
        // but user requested "don't annoy", so localStorage is better.
        localStorage.setItem('momope_launch_popup_seen', 'true');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) return;

        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setIsSubmitted(true);
            localStorage.setItem('momope_launch_popup_seen', 'true');

            // Auto close after success message
            setTimeout(() => {
                setIsOpen(false);
            }, 3000);
        }, 1500);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={handleClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden relative z-[101]"
                    >
                        {/* Decorative Header */}
                        <div className="bg-[#131B26] p-6 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#2CB78A]/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                            <div className="relative z-10 flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                    <div className="bg-white/10 p-2 rounded-xl backdrop-blur-md border border-white/10">
                                        <Smartphone className="text-[#2CB78A]" size={24} />
                                    </div>
                                    <span className="font-bold text-sm tracking-widest uppercase text-[#2CB78A]">Coming Soon</span>
                                </div>
                                <button
                                    onClick={handleClose}
                                    className="text-gray-400 hover:text-white transition-colors bg-white/5 hover:bg-white/10 p-1.5 rounded-full"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="relative z-10 mt-6">
                                <h2 className="text-2xl md:text-3xl font-bold mb-2">The MomoPe App is <br />almost here! 🚀</h2>
                                <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                                    Get ready for the fastest scanning & rewards experience.
                                </p>
                            </div>
                        </div>

                        {/* Content Body */}
                        <div className="p-8">
                            <p className="text-gray-600 mb-8 font-medium leading-relaxed">
                                We are putting the final touches on the <span className="text-[#2CB78A] font-bold">MomoPe App</span>.
                                <br /><br />
                                Experience the fastest way to scan, pay, and earn rewards at your favorite local spots.
                                Coming very soon to Android & iOS.
                            </p>

                            <button
                                onClick={handleClose}
                                className="w-full bg-gradient-to-r from-[#131B26] to-[#1e293b] hover:from-[#2CB78A] hover:to-[#249671] text-white py-4 rounded-xl font-bold text-base transition-all shadow-lg shadow-gray-900/10 hover:shadow-green-500/20 active:scale-[0.98] flex items-center justify-center gap-2 group"
                            >
                                <span>Got it, I'll be ready!</span>
                                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                            </button>

                            <p className="text-center text-[10px] text-gray-400 mt-6">
                                Launching February 28, 2026
                            </p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
