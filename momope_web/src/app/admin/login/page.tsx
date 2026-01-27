'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabaseBrowser';
import { Shield, Lock, ArrowRight, CheckCircle2, Globe, TrendingUp, ShieldCheck, Mail, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

export default function AdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isMounted, setIsMounted] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => setIsMounted(true), []);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                setError(error.message);
                setIsLoading(false);
                return;
            }

            if (data.user) {
                // Success - Redirect
                // Set legacy token for compatibility if needed
                localStorage.setItem('admin_token', data.session?.access_token || '');
                router.push('/admin/dashboard');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Authentication failed.');
            setIsLoading(false);
        }
    };

    // Actually, let's just rewrite the whole component body for Email/Password
    // This is safer and standard for "Futuristic" implementation.

    return (
        <div className="min-h-screen flex bg-white font-sans selection:bg-[#2CB78A] selection:text-white">
            {/* Left Side - Brand / Visuals (Desktop) */}
            <div className="hidden lg:flex lg:w-5/12 relative bg-[#0B1121] overflow-hidden flex-col justify-between p-12">
                {/* Background Effects */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
                    <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-[#2CB78A]/10 rounded-full blur-[120px] animate-pulse delay-700"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 animate-fade-in-up">
                    <div className="flex items-center gap-2 text-white/80 font-bold tracking-wider text-xs uppercase mb-6">
                        <div className="w-2 h-2 rounded-full bg-[#2CB78A] animate-pulse" />
                        Secure Environment
                    </div>
                    <h1 className="text-5xl font-extrabold text-white mb-6 leading-tight">
                        Powering the <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2CB78A] to-blue-400">Future of Finance</span>
                    </h1>
                    <p className="text-slate-400 text-lg leading-relaxed max-w-sm">
                        Real-time analytics, merchant management, and global transaction monitoring in one unified dashboard.
                    </p>
                </div>

                {/* Glass Card Visual */}
                <div className="relative z-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 transform translate-y-4 hover:-translate-y-1 transition duration-500 hover:bg-white/10 group cursor-default">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
                                <TrendingUp size={20} />
                            </div>
                            <div>
                                <div className="text-xs text-slate-400 uppercase tracking-wider font-bold">Daily Volume</div>
                                <div className="text-white font-bold text-xl">₹2.4M</div>
                            </div>
                        </div>
                        <div className="text-[#2CB78A] text-sm font-bold bg-[#2CB78A]/10 px-2 py-1 rounded">+14.2%</div>
                    </div>
                    <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-[#2CB78A] to-blue-500 h-full w-[70%] group-hover:w-[85%] transition-all duration-1000 ease-out"></div>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-7/12 flex flex-col relative">
                {/* Mobile Header */}
                <div className="lg:hidden bg-[#0B1121] p-6 text-white text-center pb-20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#2CB78A]/20 rounded-full blur-3xl"></div>
                    <Link href="/">
                        <img src="/assets/logo-full.png" alt="MomoPe" className="h-8 w-auto mx-auto brightness-0 invert relative z-10" />
                    </Link>
                </div>

                <div className="flex-1 flex items-center justify-center p-6 sm:p-12 -mt-10 lg:mt-0 z-10">
                    <div className={`w-full max-w-md bg-white rounded-3xl lg:rounded-none shadow-2xl lg:shadow-none p-8 lg:p-0 transition-opacity duration-700 ${isMounted ? 'opacity-100' : 'opacity-0'}`}>
                        {/* Desktop Logo & Back Link */}
                        <div className="hidden lg:flex justify-between items-center mb-12">
                            <Link href="/">
                                <img src="/assets/logo-full.png" alt="MomoPe" className="h-9 w-auto hover:opacity-80 transition cursor-pointer" />
                            </Link>
                            <Link href="/" className="flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-[#2CB78A] transition-colors group">
                                <span>Back to Home</span>
                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        <div className="mb-10 text-center lg:text-left">
                            <h2 className="text-3xl font-bold text-slate-900 mb-3">Admin Portal</h2>
                            <p className="text-slate-500 text-sm sm:text-base">Enter your secure access key to manage the platform.</p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="group">
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1 group-focus-within:text-[#2CB78A] transition-colors">Email Address</label>
                                <div className="relative transform transition-all duration-300 group-focus-within:scale-[1.01]">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-[#2CB78A] transition-colors">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:ring-4 focus:ring-[#2CB78A]/10 focus:border-[#2CB78A] transition-all placeholder-slate-300 font-medium text-lg shadow-sm group-focus-within:shadow-md"
                                        placeholder="user@momope.com"
                                        required
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <div className="group">
                                <div className="flex justify-between items-center mb-2 ml-1">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest group-focus-within:text-[#2CB78A] transition-colors">Password</label>
                                    <a href="#" className="text-xs font-semibold text-[#2CB78A] hover:text-[#249671] transition-colors">Forgot Password?</a>
                                </div>
                                <div className="relative transform transition-all duration-300 group-focus-within:scale-[1.01]">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-[#2CB78A] transition-colors">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        autoComplete="current-password"
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl py-4 pl-12 pr-12 focus:outline-none focus:ring-4 focus:ring-[#2CB78A]/10 focus:border-[#2CB78A] transition-all placeholder-slate-300 font-medium text-lg shadow-sm group-focus-within:shadow-md"
                                        placeholder="••••••••••••"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <div className="bg-red-50 border-l-4 border-red-500 text-red-600 p-4 rounded-r-xl text-sm font-medium flex items-center gap-3 animate-pulse shadow-sm">
                                    <Shield size={16} />
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-[#131B26] hover:bg-[#0f172a] text-white py-4 rounded-xl font-bold text-sm transition-all shadow-xl shadow-slate-900/10 hover:shadow-slate-900/20 hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 group relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>Authenticating...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Access Dashboard</span>
                                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-12 flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-400 font-medium border-t border-slate-100 pt-6">
                            <span className="flex items-center gap-1.5 hover:text-slate-600 transition cursor-help" title="System Operational">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#2CB78A] shadow-[0_0_8px_#2CB78A]"></div>
                                Systems Online
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Shield size={12} />
                                256-bit Encryption
                            </span>
                            <span className="flex items-center gap-1.5">
                                <Globe size={12} />
                                Global Access
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
