'use client';

import { ArrowRight, Globe, Shield, CheckCircle, Zap, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function HeroSection() {
    return (
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white">
            {/* Animated Background Blobs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 0.7, scale: 1 }}
                    transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                    className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-[#2CB78A]/10 rounded-full mix-blend-multiply filter blur-[100px]"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 0.7, scale: 1 }}
                    transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", delay: 1 }}
                    className="absolute top-[10%] right-[-10%] w-[500px] h-[500px] bg-blue-400/10 rounded-full mix-blend-multiply filter blur-[100px]"
                />
                <div className="absolute -bottom-32 left-1/3 w-[600px] h-[600px] bg-purple-400/10 rounded-full mix-blend-multiply filter blur-[100px] opacity-60 animate-blob animation-delay-4000" />
            </div>


            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="lg:w-1/2 text-center lg:text-left"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 border border-green-100 text-[#2CB78A] text-sm font-bold mb-8 shadow-lg hover:bg-green-100 transition-all cursor-default">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#2CB78A] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#2CB78A]"></span>
                            </span>
                            Payments 2.0 is Live
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-extrabold leading-[1.1] mb-6 tracking-tight text-gray-900 drop-shadow-sm">
                            Scan. Pay. <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2CB78A] to-blue-500">Earn.</span>
                        </h1>
                        <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium">
                            A smart digital payments app that rewards you on every transaction.
                            <span className="text-gray-700 font-semibold"> Fast, seamless payments with real value built in.</span>
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Link href="#download">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-gradient-to-r from-[#2CB78A] to-[#249671] hover:from-[#34D399] hover:to-[#2CB78A] text-white px-8 py-4 rounded-full text-lg font-bold transition-all shadow-lg hover:shadow-xl hover:shadow-green-500/30 flex items-center justify-center gap-2 group w-full sm:w-auto"
                                >
                                    Get Started
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </motion.button>
                            </Link>
                            <Link href="/contact">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-white text-gray-900 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 px-8 py-4 rounded-full text-lg font-bold transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
                                >
                                    <Globe size={20} className="text-gray-600" />
                                    Partner with Us
                                </motion.button>
                            </Link>
                        </div>

                        <div className="mt-10 flex items-center justify-center lg:justify-start gap-6 text-sm text-gray-500 font-semibold uppercase tracking-wider">
                            <div className="flex items-center gap-2">
                                <Shield size={16} className="text-[#2CB78A]" /> RBI Compliant
                            </div>
                            <div className="w-1 h-1 rounded-full bg-gray-300" />
                            <div className="flex items-center gap-2">
                                <CheckCircle size={16} className="text-[#2CB78A]" /> 100% Secure
                            </div>
                        </div>


                    </motion.div>

                    {/* Mobile Mockup Animation */}
                    <div className="lg:w-1/2 relative lg:h-[600px] flex items-center justify-center">
                        {/* Aura Gradient */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] lg:w-[500px] lg:h-[500px] bg-gradient-to-r from-[#2CB78A]/20 to-blue-400/20 rounded-full blur-[80px] -z-10" />

                        {/* Lifestyle Hero Image - Transparent & Floating */}
                        <div className="relative w-full max-w-[500px] lg:max-w-none flex justify-center perspective-1000">
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.8, delay: 0.4 }}
                                className="relative"
                            >
                                <img
                                    src="/hero-app-mockup.png"
                                    alt="MomoPe App Experience"
                                    className="relative z-10 w-full h-auto object-contain drop-shadow-2xl animate-float-slow"
                                />

                                {/* Micro Trust Overlay - Verified Merchant */}
                                <motion.div
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ delay: 1, type: "spring", stiffness: 200, damping: 10 }}
                                    className="absolute top-[35%] right-[25%] bg-white/95 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm border border-green-100 flex items-center gap-1 z-20"
                                >
                                    <div className="bg-green-100 p-0.5 rounded-full">
                                        <CheckCircle size={8} className="text-[#2CB78A]" strokeWidth={3} />
                                    </div>
                                    <span className="text-[8px] font-bold text-gray-600 leading-none">Verified</span>
                                </motion.div>

                                {/* Reward Moment Toast - The Only Moving Element */}
                                <motion.div
                                    initial={{ y: 20, opacity: 0 }}
                                    animate={{
                                        y: [20, -10, -10],
                                        opacity: [0, 1, 0]
                                    }}
                                    transition={{
                                        duration: 3,
                                        times: [0, 0.2, 1],
                                        repeat: Infinity,
                                        repeatDelay: 8
                                    }}
                                    className="absolute top-[20%] left-[10%] bg-gradient-to-r from-yellow-100 to-yellow-50 px-3 py-2 rounded-xl shadow-xl border border-yellow-200 flex items-center gap-2 z-30 pointer-events-none"
                                >
                                    <span className="text-lg">🪙</span>
                                    <div className="flex flex-col leading-none">
                                        <span className="text-[10px] font-bold text-yellow-800">+12 Coins</span>
                                        <span className="text-[8px] text-yellow-700/80">Just earned!</span>
                                    </div>
                                </motion.div>

                                {/* Floating Callout: Scan & Pay (Hidden on Mobile) */}
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.8 }}
                                    className="absolute top-[15%] -left-[10%] hidden lg:flex bg-white/90 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border border-white/50 items-center gap-3 z-20"
                                >
                                    <div className="bg-blue-50 p-2 rounded-xl text-blue-600">
                                        <Zap size={20} fill="currentColor" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-gray-800">Scan & Pay</span>
                                        <span className="text-[10px] text-gray-500 font-medium">Lightning fast</span>
                                    </div>
                                </motion.div>

                                {/* Floating Callout: Instant Rewards (Visible on Mobile) */}
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.9 }}
                                    className="absolute bottom-[20%] -right-[2%] lg:-right-[10%] bg-white/90 backdrop-blur-md px-4 py-3 rounded-2xl shadow-xl border border-white/50 flex items-center gap-3 z-20"
                                >
                                    <div className="bg-yellow-50 p-2 rounded-xl text-yellow-600">
                                        <span className="font-bold text-lg leading-none">₹</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold text-gray-800">Instant Rewards</span>
                                        <span className="text-[10px] text-gray-500 font-medium">Cashback & Coins</span>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </div>
                    </div>
                </div>


            </div>
        </section>
    );
}
