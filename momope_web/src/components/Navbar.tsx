"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Download, Home, Zap, Users, Briefcase, Phone, Menu, X, ChevronRight } from 'lucide-react';
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

    const navLinks = [
        { name: 'Home', href: '/', icon: Home },
        { name: 'Solutions', href: '/solutions', icon: Zap },
        { name: 'About Us', href: '/about', icon: Users },
        { name: 'Careers', href: '/careers', icon: Briefcase },
        { name: 'Contact Us', href: '/contact', icon: Phone },
    ];

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
                    {navLinks.map((link) => (
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

                {/* Premium Mobile Menu Overlay */}
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
                                initial={{ x: '100%' }}
                                animate={{ x: 0 }}
                                exit={{ x: '100%' }}
                                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                                className="fixed top-0 right-0 h-[100svh] w-[85%] max-w-sm bg-white z-50 md:hidden shadow-2xl flex flex-col"
                            >
                                {/* Drawer Header */}
                                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                                    <img src="/assets/logo-full.png" alt="MomoPe" className="h-8 w-auto" />
                                    <button
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="p-2 bg-gray-50 rounded-full hover:bg-gray-100 text-gray-500"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>

                                {/* Drawer Links */}
                                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
                                    {navLinks.map((link, idx) => {
                                        const Icon = link.icon;
                                        const isActive = pathname === link.href;
                                        return (
                                            <Link
                                                key={link.name}
                                                href={link.href}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className={`flex items-center justify-between p-4 rounded-xl transition-all ${isActive
                                                        ? 'bg-[#2CB78A]/10 text-[#2CB78A]'
                                                        : 'text-gray-700 hover:bg-gray-50'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className={`p-2 rounded-lg ${isActive ? 'bg-[#2CB78A] text-white' : 'bg-gray-100 text-gray-500'}`}>
                                                        <Icon size={20} />
                                                    </div>
                                                    <span className="font-bold text-lg">{link.name}</span>
                                                </div>
                                                <ChevronRight size={18} className={`opacity-50 ${isActive ? 'text-[#2CB78A]' : ''}`} />
                                            </Link>
                                        );
                                    })}
                                </div>

                                {/* Drawer Footer */}
                                <div className="p-6 border-t border-gray-100 bg-gray-50">
                                    <Link href="/#download" onClick={() => setIsMobileMenuOpen(false)}>
                                        <button className="w-full bg-[#131B26] text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-gray-900/10 active:scale-95 transition-all flex items-center justify-center gap-3">
                                            <Download size={20} />
                                            Download App
                                        </button>
                                    </Link>

                                    <div className="mt-6 flex justify-center gap-6 text-gray-400">
                                        <span className="text-xs font-semibold">Privacy</span>
                                        <span className="text-xs font-semibold">Terms</span>
                                        <span className="text-xs font-semibold">Support</span>
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
