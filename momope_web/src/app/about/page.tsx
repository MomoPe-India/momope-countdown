'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Target, Shield, Users, Award, TrendingUp } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-white text-[#131B26]">
            <Navbar />

            <main>
                {/* 1. Hero Section - Trust & Vision */}
                <section className="relative pt-32 pb-24 bg-[#131B26] overflow-hidden text-white">
                    <div className="absolute inset-0 z-0">
                        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#2CB78A]/10 rounded-full blur-[100px] animate-pulse"></div>
                        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px] delay-1000"></div>
                        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
                    </div>

                    <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[#2CB78A] text-xs font-bold tracking-widest mb-6 uppercase backdrop-blur-sm">
                            About MomoPe
                        </div>
                        <h1 className="text-4xl md:text-6xl font-extrabold mb-8 leading-tight tracking-tight">
                            Empowering Local Commerce with <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2CB78A] to-blue-400">Trust & Transparency</span>
                        </h1>
                        <p className="text-gray-300 text-lg md:text-xl leading-relaxed font-medium max-w-2xl mx-auto">
                            MomoPe is a dedicated technology platform bridging the gap between local merchants and modern digital payments. We help businesses grow and customers get rewarded, all within a secure, compliant ecosystem.
                        </p>
                    </div>
                </section>

                {/* 2. Company Overview - Clear & Professional */}
                <section className="py-20 relative -mt-10 z-20">
                    <div className="container mx-auto px-6">
                        <div className="bg-white p-8 md:p-12 rounded-[32px] shadow-xl shadow-gray-200/50 border border-gray-100">
                            <div className="grid md:grid-cols-2 gap-12 items-center">
                                <div>
                                    <h2 className="text-3xl font-bold mb-6 text-[#131B26]">Who We Are</h2>
                                    <div className="space-y-4 text-gray-600 leading-relaxed text-lg">
                                        <p>
                                            Operated by <strong>MomoPe Digital Hub Private Limited</strong>, we are a fintech startup focused on simplifying payments for India's vibrant local economy.
                                        </p>
                                        <p>
                                            We are not a bank. Instead, we partner with RBI-licensed banking institutions and payment processors like Razorpay to provide a secure layer for transactions. Our mission is to democratize access to enterprise-grade loyalty and payment tools for every merchant, big or small.
                                        </p>
                                    </div>
                                    <div className="flex gap-4 mt-8">
                                        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full font-bold text-sm">
                                            <Shield size={16} /> Secure
                                        </div>
                                        <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full font-bold text-sm">
                                            <Users size={16} /> Customer-First
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#2CB78A]/10 rounded-full blur-2xl"></div>
                                    <div className="relative z-10 grid grid-cols-2 gap-4">
                                        <div className="bg-white p-6 rounded-xl shadow-sm">
                                            <TrendingUp className="text-[#2CB78A] mb-3" size={32} />
                                            <div className="font-bold text-2xl text-[#131B26]">Merchant Growth</div>
                                            <div className="text-xs text-gray-500 mt-1">Seamless settlements & analytics</div>
                                        </div>
                                        <div className="bg-white p-6 rounded-xl shadow-sm">
                                            <Award className="text-blue-500 mb-3" size={32} />
                                            <div className="font-bold text-2xl text-[#131B26]">Customer Rewards</div>
                                            <div className="text-xs text-gray-500 mt-1">Coins & cashback on every scan</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 3. Leadership Section - The Core Requirement */}
                <section className="py-20 bg-gray-50 border-t border-gray-200">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold mb-4 text-[#131B26]">Meet Our Leadership</h2>
                            <p className="text-gray-500 max-w-xl mx-auto">
                                Building MomoPe with a strong focus on trust, innovation, and responsible digital payments.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                            {/* Director 1 - Mohan */}
                            <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                                <div className="h-80 overflow-hidden relative bg-gray-100">
                                    <img
                                        src="/assets/team/mohan.jpg"
                                        alt="Damerla Mohan"
                                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    <div className="absolute bottom-6 left-6 text-white">
                                        <h3 className="text-2xl font-bold">Damerla Mohan</h3>
                                        <p className="text-xs font-semibold text-white/90 bg-white/10 border border-white/20 backdrop-blur-md px-3 py-1 rounded-full inline-block mt-2 tracking-wide">
                                            Director & Co-Founder
                                        </p>
                                    </div>
                                </div>
                                <div className="p-8">
                                    <p className="text-gray-600 leading-relaxed text-sm">
                                        Mohan leads MomoPe’s business strategy, partnerships, and overall product vision. With a strong focus on building a transparent and trusted payments ecosystem, he is committed to empowering local merchants while delivering meaningful value to customers.
                                    </p>
                                </div>
                            </div>

                            {/* Director 2 - Mounika */}
                            <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 group">
                                <div className="h-80 overflow-hidden relative bg-gray-100">
                                    <img
                                        src="/assets/team/mounika.jpg"
                                        alt="Damerla Mounika"
                                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/60 to-transparent"></div>
                                    <div className="absolute bottom-6 left-6 text-white">
                                        <h3 className="text-2xl font-bold">Damerla Mounika</h3>
                                        <p className="text-xs font-semibold text-white/90 bg-white/10 border border-white/20 backdrop-blur-md px-3 py-1 rounded-full inline-block mt-2 tracking-wide">
                                            Director & Co-Founder
                                        </p>
                                    </div>
                                </div>
                                <div className="p-8">
                                    <p className="text-gray-600 leading-relaxed text-sm">
                                        Mounika leads operations and platform execution at MomoPe, ensuring a secure, reliable, and user-friendly experience. She oversees compliance, quality, and day-to-day operations, maintaining high standards across the entire ecosystem.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Trust Signal Footer */}
                        <div className="text-center mt-12 pt-8 border-t border-gray-200 max-w-4xl mx-auto">
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">
                                Guided by strong values, regulatory awareness, and a long-term vision for digital payments.
                            </p>
                        </div>
                    </div>
                </section>

                {/* 3.5. Why Choose Us - Added Value Content */}
                <section className="py-20 bg-white border-t border-gray-100">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold mb-4 text-[#131B26]">Why We Built MomoPe</h2>
                            <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                                We saw a gap in the market. Local merchants were being left behind by complex tech, and customers weren't getting real value from their daily UPI scans. We changed that.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                {
                                    title: "Merchant Empowerment",
                                    desc: "We provide small businesses with the same analytics and loyalty tools that giant corporations use, but for free.",
                                    icon: <TrendingUp size={24} className="text-white" />,
                                    color: "bg-blue-500"
                                },
                                {
                                    title: "Real Rewards",
                                    desc: "No scratch cards with 'Better Luck Next Time'. We believe every transaction deserves a guaranteed reward.",
                                    icon: <Award size={24} className="text-white" />,
                                    color: "bg-[#2CB78A]"
                                },
                                {
                                    title: "Uncompromising Security",
                                    desc: "Our systems are built on bank-grade encryption trusted by millions. Your data and money are always safe.",
                                    icon: <Shield size={24} className="text-white" />,
                                    color: "bg-purple-500"
                                }
                            ].map((item, i) => (
                                <div key={i} className="bg-gray-50 p-8 rounded-3xl hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100 group">
                                    <div className={`w-12 h-12 ${item.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-gray-200 group-hover:scale-110 transition-transform`}>
                                        {item.icon}
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 text-gray-900">{item.title}</h3>
                                    <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* 4. Trust Signals / Footer CTA */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-6 text-center">
                        <div className="max-w-3xl mx-auto bg-[#131B26] text-white rounded-[40px] p-12 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-full bg-[url('/file.svg')] opacity-5"></div>
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>

                            <div className="relative z-10">
                                <h2 className="text-3xl font-bold mb-6">Built for Trust. Designed for Growth.</h2>
                                <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                                    Join thousands of businesses who trust MomoPe for their payments and rewards.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <a href="/" className="bg-[#2CB78A] hover:bg-[#249671] text-white px-8 py-3 rounded-full font-bold transition shadow-lg shadow-green-900/20">
                                        Get Started
                                    </a>
                                    <a href="/contact" className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-8 py-3 rounded-full font-bold transition">
                                        Contact Us
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

            </main>
            <Footer />
        </div>
    );
}
