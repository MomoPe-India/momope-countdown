'use client';

import { motion } from 'framer-motion';
import { Gift, CreditCard, ShoppingBag, ArrowRight, BarChart3 } from 'lucide-react';

export default function CustomerSplitContent({ isExpanded }: { isExpanded: boolean }) {
    return (
        <div className="h-full flex flex-col md:flex-row items-center justify-center px-6 md:px-32 relative overflow-hidden text-gray-900 bg-white pt-32 md:pt-24">
            {/* Background Logo Watermark - Left Side */}
            {/* Background Logo Watermark - Left Side */}
            {/* Background Logo Watermark - Left Side on Desktop, Right on Mobile */}
            <div className="absolute top-1/2 -right-[20%] md:right-auto md:left-[5%] -translate-y-1/2 pointer-events-none z-0">
                <div
                    className="w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-[#2CB78A] drop-shadow-[0_0_50px_rgba(44,183,138,0.6)]"
                    style={{
                        maskImage: 'url(/logo.png)',
                        WebkitMaskImage: 'url(/logo.png)',
                        maskSize: 'contain',
                        WebkitMaskSize: 'contain',
                        maskRepeat: 'no-repeat',
                        WebkitMaskRepeat: 'no-repeat',
                        maskPosition: 'center',
                        WebkitMaskPosition: 'center'
                    }}
                />
            </div>

            {/* Design Highlight: Pearlescent Mesh Glow */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(44,183,138,0.08),transparent_70%)] pointer-events-none" />

            {/* Background Blur */}
            <div className="absolute bottom-0 left-0 w-[800px] h-[800px] bg-[#2CB78A]/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-4xl relative z-10 mr-auto md:mr-0 md:ml-auto w-full flex flex-col justify-start md:justify-center items-start md:items-end h-full text-left md:text-right">
                {/* Aligned Right for contrast with Merchant content */}

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#2CB78A]/10 border border-[#2CB78A]/20 text-[#2CB78A] text-xs md:text-sm font-bold tracking-widest uppercase mb-6 mr-auto md:mr-0 md:ml-auto"
                >
                    For MomoPe Users
                </motion.div>

                <motion.h2
                    layoutId="customer-title"
                    className="text-4xl md:text-7xl font-black mb-6 leading-[1]"
                >
                    Don’t Just Pay. <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2CB78A] to-[#249671]">Get Rewarded.</span>
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-gray-600 text-lg md:text-xl mb-10 leading-relaxed font-light md:ml-auto max-w-xl md:max-w-2xl"
                >
                    Scan any MomoPe QR, pay via UPI, and <b className="text-[#2CB78A] font-medium">earn real rewards instantly</b>—every single time you pay.
                </motion.p>

                {/* Feature Grid */}
                <div className="grid gap-4 md:gap-6 justify-start md:justify-end">
                    {[
                        { icon: Gift, title: "Guaranteed Rewards", desc: "Earn Momo Coins on every eligible payment." },
                        { icon: CreditCard, title: "Instant Credit", desc: "Rewards credited in < 2 seconds." },
                        { icon: ShoppingBag, title: "Real-World Value", desc: "Redeem for vouchers & cashback." },
                        { icon: BarChart3, title: "Full Transparency", desc: "Track payments & rewards clearly." }
                    ].map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + (idx * 0.1) }}
                            className="flex flex-row md:flex-row-reverse items-center gap-4 md:gap-6 group mr-auto md:mr-0 md:ml-auto"
                        >
                            <div className="p-3 md:p-4 rounded-xl bg-[#2CB78A]/10 text-[#2CB78A] group-hover:bg-[#2CB78A] group-hover:text-white transition-colors">
                                <item.icon size={24} className="md:w-8 md:h-8" />
                            </div>
                            <div className="text-left md:text-right">
                                <h3 className="font-bold text-xl md:text-2xl text-gray-900">{item.title}</h3>
                                <p className="text-gray-500 text-sm md:text-lg mt-1">{item.desc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="mt-10 flex justify-start md:justify-end"
                >
                    <a href="#download" className="bg-[#2CB78A] text-white px-8 py-4 rounded-full font-bold hover:bg-[#249671] transition-all flex items-center gap-2 group shadow-[0_0_20px_rgba(44,183,138,0.3)] hover:shadow-[0_0_30px_rgba(44,183,138,0.5)]">
                        Start Earning Now
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                </motion.div>
            </div>
        </div>
    );
}
