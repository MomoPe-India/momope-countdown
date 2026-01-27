'use client';

import { ArrowRight } from 'lucide-react';

export default function CustomersSection() {
    return (
        <section className="py-16 relative bg-gradient-to-br from-yellow-50 via-white to-purple-50 overflow-hidden border-t border-gray-100">
            {/* Animated Coins Background Effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-yellow-200/20 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-300/20 rounded-full blur-[100px]"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-col md:flex-row items-center gap-16">

                    <div className="md:w-1/2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-100 border border-yellow-200 text-yellow-700 text-xs font-bold tracking-widest mb-6">
                            ✨ MOMO COINS REWARDS
                        </div>
                        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 text-gray-900 leading-tight">
                            Get Paid to <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500">Pay.</span>
                        </h2>
                        <p className="text-xl text-gray-700 mb-10 leading-relaxed max-w-lg">
                            Your payments shouldn't just vanish. With <b className="text-gray-900">Momo Coins</b>, every scan earns you value back. Collect coins and redeem them for real cash, exclusive deals, or premium upgrades.
                        </p>

                        {/* Value Props Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                            {[
                                { icon: "🎁", title: "Guaranteed Rewards", subtitle: "No \"Better Luck Next Time\"." },
                                { icon: "💸", title: "Real Cash Value", subtitle: "Convert coins to bank transfers." },
                                { icon: "🛍️", title: "Brand Vouchers", subtitle: "Amazon, Flipkart deals." },
                                { icon: "⚡", title: "Instant Credit", subtitle: "Coins credited in < 2 seconds." }
                            ].map((item, idx) => (
                                <div key={idx} className="bg-white/80 backdrop-blur-sm border border-gray-200 p-5 rounded-2xl hover:bg-white hover:shadow-lg transition-all">
                                    <div className="text-2xl mb-2">{item.icon}</div>
                                    <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                                    <p className="text-sm text-gray-600">{item.subtitle}</p>
                                </div>
                            ))}
                        </div>

                        <button className="bg-gradient-to-r from-[#2CB78A] to-[#249671] text-white px-8 py-4 rounded-full font-bold hover:shadow-xl transition-all shadow-lg flex items-center gap-2">
                            Start Earning Now
                            <ArrowRight size={18} />
                        </button>
                    </div>

                    {/* Visual Side */}
                    <div className="md:w-1/2 relative flex justify-center">
                        <div className="relative w-[320px] h-[600px] bg-gray-900 rounded-[40px] border-8 border-gray-800 shadow-2xl overflow-hidden flex flex-col relative">
                            {/* Phone Screen Mockup */}
                            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100"></div>

                            {/* Top Bar */}
                            <div className="p-6 pt-10 flex justify-between items-center relative z-10">
                                <div className="font-bold text-gray-900">My Rewards</div>
                                <div className="bg-gray-200 px-3 py-1 rounded-full text-xs text-gray-700 flex items-center gap-1">
                                    Since 2024
                                </div>
                            </div>

                            {/* Big Coin Count */}
                            <div className="px-6 pb-6 text-center relative z-10">
                                <div className="text-gray-500 text-xs uppercase tracking-wider mb-2">Current Balance</div>
                                <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-tr from-yellow-500 to-yellow-600 drop-shadow-sm">
                                    2,450
                                </div>
                                <div className="text-yellow-600 text-sm font-bold mt-1">Momo Coins</div>
                            </div>

                            {/* Redeem Options */}
                            <div className="bg-white rounded-t-[30px] flex-1 p-6 relative z-10 mt-4">
                                <div className="flex justify-between items-center mb-6">
                                    <h4 className="font-bold text-gray-800">Redeem For</h4>
                                    <span className="text-[#2CB78A] text-xs font-bold cursor-pointer">View All</span>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 p-3 rounded-2xl bg-gray-50 border border-gray-100">
                                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold">₹</div>
                                        <div className="flex-1">
                                            <div className="font-bold text-sm text-gray-900">Cashback</div>
                                            <div className="text-xs text-gray-500">Bank Transfer</div>
                                        </div>
                                        <button className="bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg font-bold">Redeem</button>
                                    </div>
                                    <div className="flex items-center gap-4 p-3 rounded-2xl bg-gray-50 border border-gray-100">
                                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 font-bold">🛍️</div>
                                        <div className="flex-1">
                                            <div className="font-bold text-sm text-gray-900">Amazon Pay</div>
                                            <div className="text-xs text-gray-500">Gift Card</div>
                                        </div>
                                        <button className="bg-gray-200 text-gray-500 text-xs px-3 py-1.5 rounded-lg font-bold cursor-not-allowed">2500 req</button>
                                    </div>
                                </div>
                            </div>

                            {/* Notification Toast */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] z-50">
                                <div className="bg-white p-4 rounded-2xl shadow-xl shadow-black/20 flex items-center gap-4 animate-bounce-gentle border border-green-100">
                                    <div className="w-12 h-12 bg-green-50 rounded-full flex items-center justify-center text-2xl">🎉</div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-lg">You earned coins!</h4>
                                        <p className="text-gray-500 text-xs">Just now via UPI</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Decorative Background Elements */}
                        <div className="absolute top-20 -right-10 w-24 h-24 bg-yellow-300 rounded-full blur-2xl opacity-30 animate-pulse"></div>
                        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-400 rounded-full blur-3xl opacity-20"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}
