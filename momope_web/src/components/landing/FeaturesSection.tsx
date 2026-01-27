'use client';

import { Rocket, ShieldCheck, QrCode, Send } from 'lucide-react';
import { motion } from 'framer-motion';

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export default function FeaturesSection() {
    return (
        <section id="features" className="py-24 relative bg-gray-50">
            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl lg:text-5xl font-bold mb-4 text-gray-900"
                    >
                        Why <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2CB78A] to-blue-500">MomoPe?</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-600 max-w-2xl mx-auto"
                    >
                        Experience the next generation of digital payments.
                    </motion.p>
                </div>

                <motion.div
                    variants={container}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true }}
                    className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {[
                        {
                            icon: <Rocket size={24} className="text-yellow-600" />,
                            image: "/assets/features/lightning.png",
                            title: "Lightning Fast",
                            desc: "Instant payment processing with a fast and seamless experience."
                        },
                        {
                            icon: <ShieldCheck size={24} className="text-[#2CB78A]" />,
                            image: "/assets/features/security.png",
                            title: "Bank-Grade Security",
                            desc: "Protected by industry-standard encryption and secure payment infrastructure."
                        },
                        {
                            icon: <QrCode size={24} className="text-blue-600" />,
                            image: "/assets/features/upi.png",
                            title: "Universal UPI",
                            desc: "Pay seamlessly by scanning any MomoPe QR at stores across India."
                        },
                        {
                            icon: <Send size={24} className="text-purple-600" />,
                            image: "/assets/features/rewards.png",
                            title: "Send Rewards",
                            desc: "Instantly transfer Momo Coins to friends and family with real rewards."
                        }
                    ].map((feature, idx) => (
                        <motion.div
                            key={idx}
                            variants={item}
                            className="glass-card p-6 pt-8 rounded-3xl hover:-translate-y-2 hover:shadow-xl transition-all duration-300 bg-white shadow-lg border border-gray-100 relative overflow-hidden group flex flex-col justify-between"
                        >
                            {/* Content */}
                            <div className="relative z-10 mb-20 md:mb-0">
                                <div className="flex items-center gap-4 mb-3">
                                    <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 shadow-sm group-hover:bg-white group-hover:shadow-md transition-all group-hover:scale-105 shrink-0">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900">{feature.title}</h3>
                                </div>
                                <p className="text-gray-600 leading-relaxed text-xs pr-0 md:pr-12">
                                    {feature.desc}
                                </p>
                            </div>

                            {/* Anime Illustration (Decoration) */}
                            {/* Mobile: Centered Bottom | Desktop: Bottom Right Peeking */}
                            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-32 h-32 md:left-auto md:translate-x-0 md:-bottom-6 md:-right-6 md:w-36 md:h-36 opacity-90 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3 pointer-events-none">
                                <img src={feature.image} alt="" className="w-full h-full object-contain" />
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
