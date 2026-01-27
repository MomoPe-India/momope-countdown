'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ArrowRight, Briefcase, TrendingUp, Globe, Heart, Rocket, Shield, Users, Zap, Award, Target, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function CareersPage() {
    return (
        <div className="min-h-screen bg-white text-[#131B26]">
            <Navbar />

            <main>
                {/* 1. Hero Section - Sales Focus */}
                <section className="relative pt-32 pb-24 bg-[#131B26] overflow-hidden text-white">
                    {/* Background Effects */}
                    <div className="absolute inset-0 z-0">
                        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
                        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#2CB78A]/10 rounded-full blur-[100px]"></div>
                        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
                    </div>

                    <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[#2CB78A] text-xs font-bold tracking-widest mb-6 uppercase backdrop-blur-sm">
                            <TrendingUp size={12} /> We are Hiring Leaders
                        </div>
                        <h1 className="text-4xl md:text-6xl font-extrabold mb-8 leading-tight tracking-tight">
                            Drive the <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2CB78A] to-blue-400">Growth Engine</span> of<br />
                            MomoPe
                        </h1>
                        <p className="text-gray-300 text-lg md:text-xl leading-relaxed font-medium max-w-3xl mx-auto">
                            We are on a mission to onboard 1 Million merchants by 2027. We are looking for aggressive, high-energy Sales & Marketing professionals who want to lead the digital revolution in local commerce.
                        </p>

                        <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                            <a href="#positions" className="bg-[#2CB78A] hover:bg-[#249671] text-white px-8 py-3 rounded-full font-bold transition shadow-lg shadow-green-900/20 flex items-center justify-center gap-2">
                                View Sales Roles <ArrowRight size={18} />
                            </a>
                        </div>
                    </div>
                </section>

                {/* 2. Why Sales at MomoPe? */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold mb-4 text-[#131B26]">Why Build Your Career Here?</h2>
                            <p className="text-gray-500 max-w-xl mx-auto">
                                Sales at MomoPe isn't just a job. It's an opportunity to build a territory, lead a team, and earn uncapped rewards.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {[
                                {
                                    icon: <Award size={24} className="text-white" />,
                                    color: "bg-orange-500",
                                    title: "Uncapped Incentives",
                                    desc: "Your growth is directly linked to your performance. Best-in-industry commission structures."
                                },
                                {
                                    icon: <Rocket size={24} className="text-white" />,
                                    color: "bg-blue-500",
                                    title: "Updates 4x Faster",
                                    desc: "We move fast. Fast promotions, fast territory expansion, and fast payouts."
                                },
                                {
                                    icon: <Users size={24} className="text-white" />,
                                    color: "bg-[#2CB78A]",
                                    title: "Impact Real Businesses",
                                    desc: "Help local shopkeepers digitalize their business. Be the face of change in your city."
                                }
                            ].map((item, i) => (
                                <div key={i} className="bg-gray-50 p-8 rounded-3xl border border-gray-100 hover:shadow-xl transition-all duration-300 group hover:-translate-y-1">
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

                {/* 3. Field Perks */}
                <section className="py-20 bg-gray-50 border-y border-gray-200">
                    <div className="container mx-auto px-6">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl font-bold mb-6 text-[#131B26]">Built for Field Champions</h2>
                                <p className="text-gray-600 mb-8 leading-relaxed">
                                    We equip our sales leaders with everything they need to dominate the market.
                                </p>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {[
                                        "Monthly Performance Bonuses",
                                        "Travel & Fuel Allowances",
                                        "Company Laptop & Tablet",
                                        "Health Insurance (Family)",
                                        "Fast-Track to Area Manager",
                                        "Annual International Offsites"
                                    ].map((perk, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                                                <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                                            </div>
                                            <span className="font-medium text-gray-700">{perk}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="relative">
                                {/* Abstract Map Representation */}
                                <div className="absolute inset-0 bg-gradient-to-tr from-[#2CB78A]/20 to-blue-500/20 rounded-3xl transform -rotate-2 blur-lg"></div>
                                <div className="bg-white p-8 rounded-3xl shadow-xl relative z-10 border border-gray-100">
                                    <div className="flex items-center justify-between mb-8">
                                        <div>
                                            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Live Expansion</div>
                                            <div className="text-2xl font-bold text-gray-900">Andhra Pradesh</div>
                                        </div>
                                        <div className="w-12 h-12 bg-[#2CB78A]/10 rounded-full flex items-center justify-center text-[#2CB78A]">
                                            <MapPin size={24} />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                                <span className="font-bold text-gray-700">Kadapa</span>
                                            </div>
                                            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">HIRING NOW</span>
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                                <span className="font-bold text-gray-700">Tirupati</span>
                                            </div>
                                            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">HIRING NOW</span>
                                        </div>
                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 opacity-60">
                                            <div className="flex items-center gap-3">
                                                <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                                                <span className="font-bold text-gray-500">Vijayawada</span>
                                            </div>
                                            <span className="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded">COMING SOON</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. Open Positions - Sales Only */}
                <section id="positions" className="py-24 bg-white">
                    <div className="container mx-auto px-6 max-w-5xl">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold mb-4 text-[#131B26]">Open Sales Roles</h2>
                            <p className="text-gray-500">Join the revolution.</p>
                        </div>

                        <div className="space-y-4">
                            {[
                                {
                                    role: "Area Sales Manager",
                                    dept: "Sales",
                                    loc: "Kadapa / Tirupati",
                                    type: "Full Time",
                                    exp: "4-6 Years"
                                },
                                {
                                    role: "Business Development Executive (BDE)",
                                    dept: "Field Sales",
                                    loc: "Kadapa (On-site)",
                                    type: "Full Time",
                                    exp: "1-3 Years"
                                },
                                {
                                    role: "Merchant Onboarding Specialist",
                                    dept: "Operations",
                                    loc: "Field Work",
                                    type: "Internship / Full Time",
                                    exp: "Fresher"
                                },
                                {
                                    role: "Growth Marketing Associate",
                                    dept: "Marketing",
                                    loc: "Kadapa / Remote",
                                    type: "Full Time",
                                    exp: "2-4 Years"
                                }
                            ].map((job, i) => (
                                <div key={i} className="group flex flex-col sm:flex-row items-center justify-between p-6 bg-white border border-gray-200 rounded-2xl hover:border-[#2CB78A] hover:shadow-lg transition-all cursor-pointer">
                                    <div className="text-center sm:text-left mb-4 sm:mb-0">
                                        <h3 className="font-bold text-lg text-[#131B26] group-hover:text-[#2CB78A] transition-colors">{job.role}</h3>
                                        <div className="flex items-center gap-4 text-sm text-gray-500 mt-1 justify-center sm:justify-start">
                                            <span className="flex items-center gap-1"><Briefcase size={14} /> {job.dept}</span>
                                            <span className="flex items-center gap-1"><MapPin size={14} /> {job.loc}</span>
                                            <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded text-xs font-bold">{job.exp}</span>
                                        </div>
                                    </div>
                                    <button className="px-6 py-2 bg-[#131B26] text-white font-bold rounded-full text-sm hover:bg-[#2CB78A] transition-colors shadow-lg shadow-gray-200">
                                        Apply Now
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="mt-12 p-10 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl text-center text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                            <div className="relative z-10">
                                <h3 className="text-2xl font-bold mb-3">Don't see your city?</h3>
                                <p className="text-blue-100 mb-8 max-w-xl mx-auto">
                                    We are expanding rapidly across Andhra Pradesh. Send us your resume and tell us which city you want to launch next.
                                </p>
                                <a href="mailto:careers@momope.com" className="inline-block bg-white text-blue-600 border border-white px-8 py-3 rounded-full font-bold hover:bg-transparent hover:text-white transition-colors">
                                    Drop your Resume
                                </a>
                            </div>
                        </div>
                    </div>
                </section>

                <Footer />
            </main>
        </div>
    );
}
