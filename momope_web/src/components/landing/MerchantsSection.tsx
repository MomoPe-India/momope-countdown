'use client';

import { Zap, CheckCircle, ArrowRight } from 'lucide-react';
import Image from 'next/image';

export default function MerchantsSection() {
    return (
        <section className="py-16 relative overflow-hidden bg-white">
            <div className="absolute top-40 -left-64 w-[600px] h-[600px] bg-[#2CB78A]/5 rounded-full blur-3xl -z-10" />
            <div className="container mx-auto px-6">
                <div className="grid md:grid-cols-2 gap-16 items-center">
                    <div className="order-2 md:order-1 relative">
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#2CB78A]/20 to-blue-500/20 rounded-[40px] transform rotate-3 blur-md" />
                        <div className="glass p-8 rounded-[40px] relative z-10 overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <Zap size={100} className="text-gray-400" />
                            </div>
                            {/* Merchant Dashboard Preview - Using Next/Image for optimization */}
                            <div className="relative w-full aspect-[4/3]">
                                <Image
                                    src="/artifacts/merchant_app_dashboard.webp"
                                    alt="MomoPe Merchant Dashboard"
                                    fill
                                    className="object-cover rounded-2xl shadow-2xl transform group-hover:scale-[1.02] transition-transform duration-500"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="order-1 md:order-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold tracking-widest mb-6 uppercase">
                            FOR MERCHANTS
                        </div>
                        <h2 className="text-4xl md:text-5xl font-extrabold mb-8 text-gray-900 leading-tight">
                            Scale Your Revenue with <span className="text-gradient">Intelligent Pricing</span>
                        </h2>
                        <p className="text-xl text-gray-600 mb-10 leading-relaxed font-light">
                            Break free from hidden charges. Our transparent commission model ensures you only pay when you succeed.
                            <strong className="text-gray-900 block mt-4">Zero Setup Fees. Zero Maintenance. 100% Transparency.</strong>
                        </p>

                        <div className="space-y-6">
                            {[
                                { title: "Dynamic Settlements", desc: "Capitalize on flexible payout schedules aligned with your business hours." },
                                { title: "Loyalty Engine", desc: "Momo Coins turn one-time shoppers into lifetime patrons automatically." },
                                { title: "Growth Analytics", desc: "Real-time insights to track revenue, customer retention, and peak hours." }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-5 group">
                                    <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white shadow-md border border-gray-100 flex items-center justify-center mt-1 group-hover:border-[#2CB78A] transition-colors">
                                        <CheckCircle size={20} className="text-[#2CB78A]" />
                                    </div>
                                    <div>
                                        <div className="font-bold text-gray-900 mb-1 text-lg group-hover:text-[#2CB78A] transition-colors">{item.title}</div>
                                        <div className="text-gray-600 leading-normal">{item.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-10 flex gap-4">
                            <button className="bg-[#2CB78A] text-white px-8 py-4 rounded-full font-bold hover:bg-[#249671] transition-all shadow-lg hover:shadow-green-500/30 flex items-center gap-2">
                                Start Accepting Payments
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
