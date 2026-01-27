'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LogOut, Home, IndianRupee } from 'lucide-react';
import { createClient } from '@/lib/supabaseBrowser';

export default function AdminNavbar() {
    const router = useRouter();

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        localStorage.clear();
        router.refresh();
        router.push('/admin/login');
    };

    return (
        <nav className="sticky top-0 z-50 bg-[#0B1121]/80 backdrop-blur-xl border-b border-white/5">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-3">
                        <Link href="/admin/dashboard">
                            <img src="/assets/logo-full.png" alt="MomoPe" className="h-8 w-auto object-contain brightness-0 invert" />
                        </Link>
                        <span className="bg-white/10 text-gray-300 text-[10px] px-2 py-0.5 rounded border border-white/10 font-bold uppercase tracking-wider">
                            Admin Console
                        </span>
                    </div>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link href="/admin/dashboard" className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors">
                            <Home size={16} />
                            Dashboard
                        </Link>
                        <Link href="/admin/settlements" className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors">
                            <IndianRupee size={16} />
                            Settlements
                        </Link>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-xs text-[#2CB78A] font-bold bg-[#2CB78A]/10 px-3 py-1.5 rounded-full border border-[#2CB78A]/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#2CB78A] animate-pulse" />
                        Live System
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-red-400 transition-colors"
                    >
                        <LogOut size={18} />
                        <span className="hidden md:inline">Logout</span>
                    </button>
                </div>
            </div>
        </nav>
    );
}
