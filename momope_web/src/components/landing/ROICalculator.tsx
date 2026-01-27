"use client";
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, IndianRupee, Users, ArrowRight } from 'lucide-react';

export default function ROICalculator() {
    const [dailyCustomers, setDailyCustomers] = useState(50);
    const [avgOrderValue, setAvgOrderValue] = useState(300);
    const [monthlyRevenue, setMonthlyRevenue] = useState(0);
    const [projectedIncrease, setProjectedIncrease] = useState(0);

    // Calculate ROI
    useEffect(() => {
        // Base Monthly Revenue = Daily Customers * Avg Order Value * 30 days
        const baseMonthly = dailyCustomers * avgOrderValue * 30;

        // MomoPe Impact: Conservative 15% increase in retention/frequency
        // This is a standard industry benchmark for loyalty programs
        const increase = baseMonthly * 0.15;

        setMonthlyRevenue(baseMonthly);
        setProjectedIncrease(increase);
    }, [dailyCustomers, avgOrderValue]);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    return (
        <section className="py-20 bg-gradient-to-br from-[#131B26] to-[#1a2532] text-white overflow-hidden relative">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#2CB78A]/5 rounded-full blur-[120px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none"></div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-16">

                    {/* Left Side: Text & Context */}
                    <div className="lg:w-1/2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2CB78A]/10 border border-[#2CB78A]/20 text-[#2CB78A] text-xs font-bold tracking-widest mb-6 uppercase"
                        >
                            <TrendingUp size={14} />
                            Calculate Your Growth
                        </motion.div>
                        <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                            See how much <span className="text-[#2CB78A]">extra revenue</span> you're missing.
                        </h2>
                        <p className="text-gray-400 text-lg leading-relaxed mb-8">
                            Repeat customers spend 67% more than new ones. Use our calculator to see the potential impact of an automated loyalty program on your monthly bottom line.
                        </p>

                        <div className="hidden lg:block">
                            <div className="flex items-center gap-4 text-sm font-medium text-gray-400">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-[#2CB78A]"></div>
                                    Based on 15% Retention Boost
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                    Conservative Estimates
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: The Calculator Card */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="lg:w-1/2 w-full"
                    >
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#2CB78A] to-blue-500"></div>

                            {/* Sliders */}
                            <div className="space-y-10 mb-12">
                                {/* Slider 1: Daily Customers */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <label className="flex items-center gap-2 text-gray-300 font-medium">
                                            <Users size={18} className="text-[#2CB78A]" />
                                            Daily Customers
                                        </label>
                                        <span className="text-2xl font-bold text-white">{dailyCustomers}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="10"
                                        max="500"
                                        step="10"
                                        value={dailyCustomers}
                                        onChange={(e) => setDailyCustomers(Number(e.target.value))}
                                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#2CB78A]"
                                    />
                                    <div className="flex justify-between text-xs text-gray-500 font-medium">
                                        <span>10</span>
                                        <span>500+</span>
                                    </div>
                                </div>

                                {/* Slider 2: Average Order Value */}
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <label className="flex items-center gap-2 text-gray-300 font-medium">
                                            <IndianRupee size={18} className="text-blue-500" />
                                            Average Bill Value
                                        </label>
                                        <span className="text-2xl font-bold text-white">₹{avgOrderValue}</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="50"
                                        max="5000"
                                        step="50"
                                        value={avgOrderValue}
                                        onChange={(e) => setAvgOrderValue(Number(e.target.value))}
                                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                    />
                                    <div className="flex justify-between text-xs text-gray-500 font-medium">
                                        <span>₹50</span>
                                        <span>₹5,000+</span>
                                    </div>
                                </div>
                            </div>

                            {/* Result Box */}
                            <div className="bg-gradient-to-br from-[#2CB78A]/20 to-blue-600/20 border border-white/10 rounded-2xl p-6 text-center relative overflow-hidden group">
                                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                                <p className="text-gray-300 text-sm font-medium mb-2 uppercase tracking-wide">Potential Extra Monthly Income</p>
                                <motion.div
                                    key={projectedIncrease}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#2CB78A] to-blue-400 mb-2"
                                >
                                    {formatCurrency(projectedIncrease)}
                                </motion.div>
                                <p className="text-xs text-gray-400">
                                    *Analysis based on industry average retention rates.
                                </p>
                            </div>

                            <div className="mt-8 text-center">
                                <a href="#download" className="inline-flex items-center gap-2 text-white font-bold hover:text-[#2CB78A] transition-colors">
                                    Start Growing Today <ArrowRight size={16} />
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
