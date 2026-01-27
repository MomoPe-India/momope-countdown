"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Download } from 'lucide-react';
import { useLandingStore } from '@/store/landingStore';
import { usePathname, useRouter } from 'next/navigation';

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

    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string, tab?: 'merchants' | 'customers') => {
        e.preventDefault();
        setIsMobileMenuOpen(false);

        // Update global store if tab switch needed
        if (tab) {
            setActiveTab(tab);
        }

        if (pathname === '/') {
            const element = document.getElementById(id);
            if (element) {
                const headerOffset = 100; // Increased buffer for safety
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });
            }
        } else {
            // Navigate to home then scroll
            router.push(`/#${id}`);
        }
    };

    return (
        <nav
            className={`fixed w-full z-50 transition-all duration-300 bg-white shadow-md border-b border-gray-100 ${scrolled
                ? 'py-3'
                : 'py-4'
                }`}
        >
            <div className="container mx-auto px-6 flex justify-between items-center relative">
                <div className="flex items-center gap-2 z-50">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2" onClick={() => setIsMobileMenuOpen(false)}>
                        <img src="/assets/logo-full.png" alt="MomoPe" className="h-8 md:h-10 w-auto object-contain" />
                    </Link>
                </div>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-700">
                    <Link href="/" className="hover:text-[#2CB78A] transition-colors">
                        Home
                    </Link>

                    <Link href="/solutions" className="hover:text-[#2CB78A] transition-colors">
                        Solutions
                    </Link>
                    <Link href="/about" className="hover:text-[#2CB78A] transition-colors">
                        About Us
                    </Link>
                    <Link href="/careers" className="hover:text-[#2CB78A] transition-colors">
                        Careers
                    </Link>
                    <Link href="/contact" className="hover:text-[#2CB78A] transition-colors">
                        Contact Us
                    </Link>

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
                        /* Close Icon */
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    ) : (
                        /* Menu Icon */
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    )}
                </button>

                {/* Mobile Menu Overlay */}
                <div
                    className={`fixed inset-0 bg-white/95 backdrop-blur-lg md:hidden transition-all duration-300 ease-in-out flex flex-col justify-center items-center gap-8 text-lg font-bold text-gray-800 ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
                        }`}
                    style={{ top: '0', left: '0', height: '100vh', width: '100vw' }}
                >
                    <Link href="/" className="hover:text-[#2CB78A] transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                        Home
                    </Link>

                    <Link href="/solutions" className="hover:text-[#2CB78A] transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                        Solutions
                    </Link>
                    <Link href="/about" className="hover:text-[#2CB78A] transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                        About Us
                    </Link>
                    <Link href="/careers" className="hover:text-[#2CB78A] transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                        Careers
                    </Link>
                    <Link href="/contact" className="hover:text-[#2CB78A] transition-colors" onClick={() => setIsMobileMenuOpen(false)}>
                        Contact Us
                    </Link>

                    <Link href="/#download" onClick={() => setIsMobileMenuOpen(false)}>
                        <button className="bg-gradient-to-r from-[#2CB78A] to-[#249671] text-white px-8 py-3 rounded-full font-bold hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2">
                            <Download size={20} />
                            Get App
                        </button>
                    </Link>
                </div>
            </div>
        </nav>
    );
}
