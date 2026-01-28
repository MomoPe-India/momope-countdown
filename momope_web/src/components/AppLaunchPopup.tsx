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
                            {!isSubmitted ? (
                                <>
                                    <p className="text-gray-600 mb-6 font-medium">
                                        Join the waitlist to get <span className="text-[#2CB78A] font-bold">early access</span> and exclusive launch rewards.
                                    </p>

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="relative">
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="Enter your email address"
                                                required
                                                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl py-4 pl-4 pr-4 focus:outline-none focus:ring-2 focus:ring-[#2CB78A] focus:border-transparent transition-all font-medium"
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-full bg-gradient-to-r from-[#131B26] to-[#1e293b] hover:from-[#2CB78A] hover:to-[#249671] text-white py-4 rounded-xl font-bold text-base transition-all shadow-lg shadow-gray-900/10 hover:shadow-green-500/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                                        >
                                            {isLoading ? (
                                                <>
                                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                    <span>Joining...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Bell size={18} className="group-hover:animate-swing" />
                                                    <span>Notify Me When Launched</span>
                                                    <ArrowRight size={18} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                                                </>
                                            )}
                                        </button>
                                    </form>
                                    <p className="text-center text-[10px] text-gray-400 mt-4">
                                        We respect your privacy. No spam, ever.
                                    </p>
                                </>
                            ) : (
                                <div className="text-center py-8 animate-in fade-in zoom-in duration-300">
                                    <div className="w-16 h-16 bg-green-100 text-[#2CB78A] rounded-full flex items-center justify-center mx-auto mb-4">
                                        <CheckCircle size={32} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">You're on the list! 🎉</h3>
                                    <p className="text-gray-500">
                                        We'll let you know the moment MomoPe hits the App Store. <br />
                                        Stay tuned for your exclusive rewards.
                                    </p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
