'use client';

import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const testimonials = [
    {
        name: "Rajesh Kumar",
        role: "Owner, Spice Garden",
        category: "Restaurant",
        image: "https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=200&h=200",
        content: "Since switching to MomoPe, **my transaction failures have dropped to zero.** The daily settlement is a lifesaver.",
        rating: 5
    },
    {
        name: "Priya Sharma",
        role: "Manager, Trends Boutique",
        category: "Retail",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200",
        content: "Customers actually ask to pay via MomoPe to earn coins. **My repeat customers increased by 30%.**",
        rating: 5
    },
    {
        name: "Amit Patel",
        role: "Founder, TechHub",
        category: "Startup",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200",
        content: "Zero setup fees and the commission is transparent. **The admin dashboard gives me insights I didn't know I needed.**",
        rating: 5
    }
];

export default function TestimonialsSection() {
    return (
        <section id="testimonials" className="py-24 bg-white relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-3xl -z-10" />

            <div className="container mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl lg:text-5xl font-bold mb-4 text-gray-900">
                        Helping Local Businesses <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2CB78A] to-blue-600">Grow with MomoPe</span>
                    </h2>
                    <p className="text-gray-600 max-w-2xl mx-auto font-medium">
                        Join <span className="text-[#2CB78A] font-bold">10,000+ merchants</span> growing their business with us.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-12">
                    {testimonials.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.2 }}
                            className="bg-gray-50 p-8 rounded-3xl border border-gray-100 hover:shadow-xl transition-shadow relative group"
                        >
                            <Quote className="absolute top-6 right-6 text-gray-200 group-hover:text-[#2CB78A]/20 transition-colors" size={40} />

                            <div className="flex gap-1 mb-6">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        size={18}
                                        className="text-[#FFD700] fill-[#FFD700]"
                                    />
                                ))}
                            </div>

                            <p className="text-gray-700 italic mb-8 leading-relaxed">
                                {item.content.split('**').map((part, i) =>
                                    i % 2 === 1 ? <span key={i} className="font-bold text-gray-900 not-italic">{part}</span> : part
                                )}
                            </p>

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 relative rounded-full overflow-hidden border-2 border-white shadow-md">
                                    <Image
                                        src={item.image}
                                        alt={item.name}
                                        fill
                                        sizes="48px"
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm">{item.name}</h4>
                                    <div className="flex items-center gap-2 mt-0.5">
                                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide truncate max-w-[120px]">{item.role}</p>
                                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                        <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">{item.category}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Soft CTA */}
                <div className="text-center">
                    <Link href="/contact" className="inline-flex items-center justify-center gap-2 text-[#2CB78A] font-bold hover:text-[#249671] transition-colors group">
                        Partner with MomoPe
                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                </div>
            </div>
        </section>
    );
}
