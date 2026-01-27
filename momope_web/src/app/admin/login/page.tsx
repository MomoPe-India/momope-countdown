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
                {/* Mobile Header with Cyber Grid */}
                <div className="lg:hidden bg-[#0B1121] px-6 pt-8 pb-32 text-white relative overflow-hidden">
                    {/* Grid Pattern Overlay */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#2CB78A]/20 rounded-full blur-[80px]"></div>

                    <div className="relative z-10 flex items-center justify-between">
                        <Link href="/">
                            <img src="/assets/logo-full.png" alt="MomoPe" className="h-8 w-auto brightness-0 invert" />
                        </Link>

                        <Link href="/" className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white transition-colors bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full active:scale-95">
                            <span>Home</span>
                            <ArrowRight size={14} />
                        </Link>
                    </div>

                    <div className="relative z-10 mt-10 mb-4">
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Welcome Back</h1>
                        <p className="text-slate-400 text-sm mt-2">Secure access for authorized personnel only.</p>
                    </div>
                </div>

                <div className="flex-1 flex items-center justify-center p-6 sm:p-12 -mt-20 lg:mt-0 z-10">
                    <div className={`w-full max-w-md bg-white rounded-3xl lg:rounded-none shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] lg:shadow-none p-8 lg:p-0 transition-opacity duration-700 ${isMounted ? 'opacity-100' : 'opacity-0'}`}>
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

                        <div className="mb-10 text-center lg:text-left hidden lg:block">
                            <h2 className="text-3xl font-bold text-slate-900 mb-3">Admin Portal</h2>
                            <p className="text-slate-500 text-sm sm:text-base">Enter your secure access key to manage the platform.</p>
                        </div>

                        <form onSubmit={handleLogin} className="space-y-6">
                            <div className="group">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1 group-focus-within:text-[#2CB78A] transition-colors">Email Address</label>
                                <div className="relative transform transition-all duration-300 group-focus-within:translate-x-1">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-[#2CB78A] transition-colors">
                                        <Mail size={18} />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-[#2CB78A] focus:border-transparent transition-all placeholder-slate-300 font-medium text-lg shadow-sm group-focus-within:shadow-lg group-focus-within:bg-white"
                                        placeholder="user@momope.com"
                                        required
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <div className="group">
                                <div className="flex justify-between items-center mb-2 ml-1">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest group-focus-within:text-[#2CB78A] transition-colors">Password</label>
                                    <a href="#" className="text-[10px] font-bold text-[#2CB78A] hover:text-[#249671] transition-colors uppercase tracking-wide">Forgot?</a>
                                </div>
                                <div className="relative transform transition-all duration-300 group-focus-within:translate-x-1">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-300 group-focus-within:text-[#2CB78A] transition-colors">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        autoComplete="current-password"
                                        className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl py-4 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-[#2CB78A] focus:border-transparent transition-all placeholder-slate-300 font-medium text-lg shadow-sm group-focus-within:shadow-lg group-focus-within:bg-white"
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
                                <div className="bg-red-50/50 backdrop-blur-sm border border-red-100 text-red-600 p-4 rounded-xl text-sm font-medium flex items-center gap-3 animate-shake">
                                    <div className="p-2 bg-red-100 rounded-full">
                                        <Shield size={14} className="text-red-500" />
                                    </div>
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-[#131B26] hover:bg-[#0f172a] text-white py-4 rounded-xl font-bold text-sm transition-all shadow-xl shadow-slate-900/10 hover:shadow-slate-900/20 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 group relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        <span>Verifying...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Secure Login</span>
                                        <div className="bg-white/10 p-1 rounded-full group-hover:bg-white/20 transition-colors">
                                            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
                                        </div>
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 pt-6 border-t border-slate-100">
                            <div className="flex items-center justify-center gap-4">
                                <span className="flex items-center gap-1.5 px-3 py-1 bg-green-50 rounded-full border border-green-100">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#2CB78A] animate-pulse"></div>
                                    <span className="text-[10px] font-bold text-green-700 uppercase tracking-wide">Online</span>
                                </span>
                                <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 rounded-full border border-slate-100 text-slate-500">
                                    <ShieldCheck size={12} />
                                    <span className="text-[10px] font-bold uppercase tracking-wide">Encrypted</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
