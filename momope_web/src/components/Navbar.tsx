
"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav
            className={`fixed w-full z-50 transition-all duration-300 ${scrolled
                    ? 'bg-white/70 backdrop-blur-xl border-b border-white/20 shadow-lg shadow-black/5 py-3'
                    : 'bg-transparent py-5'
                }`}
        >
            <div className="container mx-auto px-6 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    {/* Logo - assuming transparent png */}
                    <Link href="/" className="flex items-center gap-2">
                        <img src="/assets/logo-full.png" alt="MomoPe" className="h-8 md:h-10 w-auto object-contain" />
                    </Link>
                </div>

                <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-600">
                    {['Features', 'Merchants', 'Customers'].map((item) => (
                        <a
                            key={item}
                            href={`/#${item.toLowerCase()}`}
                            className="relative px-2 py-1 transition group"
                        >
                            <span className="relative z-10 group-hover:text-[#2CB78A] transition">{item}</span>
                            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#2CB78A] transition-all group-hover:w-full" />
                        </a>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    <Link
                        href="/admin"
                        className="hidden md:block text-sm font-bold text-gray-700 hover:text-[#2CB78A] transition"
                    >
                        Admin Login
                    </Link>
                    <button className="bg-gradient-to-r from-[#2CB78A] to-[#249671] hover:from-[#249671] hover:to-[#1e7e5f] text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-[0_10px_20px_-10px_rgba(44,183,138,0.5)] hover:shadow-[0_15px_25px_-10px_rgba(44,183,138,0.6)] hover:-translate-y-0.5">
                        Get App
                    </button>
                </div>
            </div>
        </nav>
    );
}
