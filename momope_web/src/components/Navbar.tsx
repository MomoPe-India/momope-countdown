"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Download, Home, Zap, Users, Briefcase, Phone, Menu, X, ChevronRight, ShieldCheck } from 'lucide-react';
import { useLandingStore } from '@/store/landingStore';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { setActiveTab } = useLandingStore();
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Prevent scrolling when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
    }, [isMobileMenuOpen]);

    const primaryLinks = [
        { name: 'Home', href: '/', icon: Home },
        { name: 'Solutions', href: '/solutions', icon: Zap },
    ];

    const companyLinks = [
        { name: 'About Us', href: '/about', icon: Users },
        { name: 'Careers', href: '/careers', icon: Briefcase },
        { name: 'Contact Us', href: '/contact', icon: Phone },
    ];

    const drawerVariants = {
        closed: { x: '100%' },
        open: {
            x: 0,
            transition: { type: 'spring', damping: 30, stiffness: 300 }
        }
    };

    const containerVariants = {
        open: {
            transition: { staggerChildren: 0.05, delayChildren: 0.1 }
        },
        closed: {}
    };

    const itemVariants = {
        closed: { opacity: 0, x: 20 },
        open: { opacity: 1, x: 0 }
    };

    return (
        <nav
            className={`fixed w-full z-50 transition-all duration-300 bg-white/90 backdrop-blur-md border-b border-gray-100 ${scrolled
                ? 'py-3 shadow-md'
                : 'py-4'
                }`}
        >
            <div className="container mx-auto px-6 flex justify-between items-center relative">
                <div className="flex items-center gap-2 z-50">
                    <Link href="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                        <img src="/assets/logo-full.png" alt="MomoPe" className="h-8 md:h-10 w-auto object-contain" />
                    </Link>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-700">
                    {[...primaryLinks, ...companyLinks].map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`transition-colors hover:text-[#2CB78A] ${pathname === link.href ? 'text-[#2CB78A]' : ''}`}
                        >
                            {link.name}
                        </Link>
                    ))}

                    <Link href="/#download">
                        <button className="bg-gradient-to-r from-[#2CB78A] to-[#249671] text-white px-6 py-2.5 rounded-full font-bold hover:shadow-lg hover:shadow-green-500/30 hover:scale-105 transition-all flex items-center gap-2 group">
                            <Download size={18} className="group-hover:translate-y-0.5 transition-transform" />
                            Get App
                        </button>
                    </Link>
                </div>

                {/* Mobile menu button */}
                <button
                    className="md:hidden p-2 text-gray-700 hover:text-[#2CB78A] z-50 focus:outline-none"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? (
                        <X className="w-7 h-7" />
                    ) : (
                        <Menu className="w-7 h-7" />
                    )}
                </button>

                {/* Fintech-Grade Mobile Menu Overlay */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <>
                            {/* Backdrop */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
                                style={{ top: 0, left: 0, height: '100svh' }}
                            />

                            {/* Drawer */}
                            <motion.div
                                variants={drawerVariants}
                                initial="closed"
                                animate="open"
                                exit="closed"
                                className="fixed top-0 right-0 h-[100svh] w-[85%] max-w-sm bg-white z-50 md:hidden shadow-2xl flex flex-col font-sans"
                            >
                                {/* 1. Header with Brand Anchor */}
                                <div className="p-6 pb-4 border-b border-gray-50 bg-white">
                                    <div className="flex items-center justify-between mb-2">
                                        <img src="/assets/logo-full.png" alt="MomoPe" className="h-7 w-auto" />
                                        <button
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
                                        >
                                            <X size={20} />
                                        </button>
                                    </div>
                                    <p className="text-xs font-bold text-gray-400 tracking-wider uppercase ml-1">Scan. Pay. Earn.</p>
                                </div>

                                {/* 2. Grouped Navigation Items */}
                                <motion.div
                                    className="flex-1 overflow-y-auto py-6 px-5 space-y-8"
                                    variants={containerVariants}
                                >
                                    {/* Primary Section */}
                                    <div className="space-y-3">
                                        <motion.p variants={itemVariants} className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">Primary</motion.p>
                                        {primaryLinks.map((link) => {
                                            const Icon = link.icon;
                                            const isActive = pathname === link.href;
                                            return (
                                                <motion.div variants={itemVariants} key={link.name}>
                                                    <Link
                                                        href={link.href}
                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                        className={`flex items-center justify-between p-3.5 rounded-xl transition-all group ${isActive
                                                                ? 'bg-gradient-to-r from-[#2CB78A]/10 to-[#2CB78A]/5 border-l-4 border-[#2CB78A] text-[#2CB78A]'
                                                                : 'text-gray-600 hover:bg-gray-50 border-l-4 border-transparent'
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <Icon size={20} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-[#2CB78A]' : 'text-gray-400 group-hover:text-[#2CB78A] transition-colors'} />
                                                            <span className={`text-[15px] ${isActive ? 'font-bold' : 'font-medium'}`}>{link.name}</span>
                                                        </div>
                                                    </Link>
                                                </motion.div>
                                            );
                                        })}
                                    </div>

                                    {/* Company Section */}
                                    <div className="space-y-3">
                                        <motion.p variants={itemVariants} className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pl-2">Company</motion.p>
                                        {companyLinks.map((link) => {
                                            const Icon = link.icon;
                                            const isActive = pathname === link.href;
                                            return (
                                                <motion.div variants={itemVariants} key={link.name}>
                                                    <Link
                                                        href={link.href}
                                                        onClick={() => setIsMobileMenuOpen(false)}
                                                        className={`flex items-center justify-between p-3.5 rounded-xl transition-all group ${isActive
                                                                ? 'bg-gradient-to-r from-[#2CB78A]/10 to-[#2CB78A]/5 border-l-4 border-[#2CB78A] text-[#2CB78A]'
                                                                : 'text-gray-600 hover:bg-gray-50 border-l-4 border-transparent'
                                                            }`}
                                                    >
                                                        <div className="flex items-center gap-4">
                                                            <Icon size={20} strokeWidth={isActive ? 2.5 : 2} className={isActive ? 'text-[#2CB78A]' : 'text-gray-400 group-hover:text-[#2CB78A] transition-colors'} />
                                                            <span className={`text-[15px] ${isActive ? 'font-bold' : 'font-medium'}`}>{link.name}</span>
                                                        </div>
                                                    </Link>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                </motion.div>

                                {/* 3. Premium Footer & CTA */}
                                <div className="p-6 bg-gray-50 border-t border-gray-100">
                                    <div className="text-center mb-3">
                                        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide flex items-center justify-center gap-1.5 mb-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#2CB78A] animate-pulse"></span>
                                            Available on iOS & Android
                                        </p>
                                    </div>
                                    <Link href="/#download" onClick={() => setIsMobileMenuOpen(false)}>
                                        <button className="w-full bg-[#131B26] text-white py-4 rounded-xl font-bold text-base shadow-xl shadow-gray-900/5 active:scale-95 transition-all flex items-center justify-center gap-3 relative overflow-hidden group">
                                            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <Download size={18} />
                                            Download App
                                        </button>
                                    </Link>

                                    <div className="mt-8 flex flex-col items-center gap-4">
                                        <div className="flex items-center gap-6 text-xs font-semibold text-gray-400">
                                            <span className="hover:text-gray-600 cursor-pointer transition-colors">Privacy</span>
                                            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                            <span className="hover:text-gray-600 cursor-pointer transition-colors">Terms</span>
                                            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                                            <span className="hover:text-gray-600 cursor-pointer transition-colors">Support</span>
                                        </div>
                                        <p className="text-[10px] text-gray-300 font-medium">© MomoPe 2026</p>
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </nav>
    );
}
