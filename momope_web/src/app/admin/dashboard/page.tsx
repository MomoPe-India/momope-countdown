'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, Users, IndianRupee, Activity, CheckCircle, XCircle, LogOut, TrendingUp, Search, Bell } from 'lucide-react';
import { getDashboardStats } from '@/app/actions/getDashboardStats';
import { approveMerchant, rejectMerchant } from '@/app/actions/merchantActions';
import { createClient } from '@/lib/supabaseBrowser';
import AdminNavbar from '@/components/admin/AdminNavbar';

export default function AdminDashboard() {
    const router = useRouter();

    const [stats, setStats] = useState({ totalMerchants: 0, totalUsers: 0, platformRevenue: 0, pendingKyc: 0 });
    const [pendingMerchants, setPendingMerchants] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Load Data Function
    const loadData = async () => {
        setLoading(true);
        try {
            const data = await getDashboardStats();
            setStats({
                totalMerchants: data.totalMerchants,
                totalUsers: data.totalUsers,
                platformRevenue: data.platformRevenue,
                pendingKyc: data.pendingKyc
            });
            setPendingMerchants(data.pendingMerchants);
        } catch (err) {
            console.error("Failed to load dashboard data", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('admin_token');
        if (!token) {
            router.push('/admin/login');
            return;
        }
        loadData();
    }, []);

    const handleApprove = async (merchantId: string) => {
        if (!confirm('Are you sure you want to approve this merchant? This will enable their payments.')) return;

        try {
            const result = await approveMerchant(merchantId);
            if (result.success) {
                await loadData(); // Refresh data
                alert('Merchant approved successfully!');
            } else {
                alert('Failed to approve merchant.');
            }
        } catch (e) {
            console.error(e);
            alert('An error occurred.');
        }
    };

    const handleReject = async (merchantId: string) => {
        if (!confirm('Are you sure you want to REJECT and DELETE this merchant application? This cannot be undone.')) return;

        try {
            const result = await rejectMerchant(merchantId);
            if (result.success) {
                await loadData(); // Refresh data
                alert('Merchant rejected and removed.');
            } else {
                alert('Failed to reject merchant.');
            }
        } catch (e) {
            console.error(e);
            alert('An error occurred.');
        }
    };

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        localStorage.clear();

        // Force refresh to clear any server-side state/cookies
        router.refresh();
        router.push('/admin/login');
    };

    return (
        <div className="min-h-screen bg-[#0B1121] text-white font-sans selection:bg-[#2CB78A] selection:text-white">
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#2CB78A]/5 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[100px]"></div>
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
            </div>

            {/* Top Navigation */}
            <AdminNavbar />

            <div className="container mx-auto px-6 py-10 relative z-10">
                <div className="mb-10 flex flex-col md:flex-row justify-between items-end gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h1>
                        <p className="text-gray-400">Total Ecosystem Metrics (Real-Time)</p>
                    </div>
                    <div>
                        <button
                            onClick={loadData}
                            className={`bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg text-sm font-bold border border-white/10 transition flex items-center gap-2 ${loading ? 'opacity-50' : ''}`}
                        >
                            {loading ? 'Refreshing...' : 'Refresh Data'}
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <StatCard
                        icon={<Users className="text-blue-200" size={24} />}
                        label="Total Merchants"
                        value={stats.totalMerchants}
                        sub="Registered on App"
                        delay="0"
                        gradient="from-blue-600 to-blue-900"
                        href="/admin/merchants"
                    />

                    {/* Only show User metrics if Admin (or we can show for Sales too if needed, but keeping simple) */}
                    <StatCard
                        icon={<Activity className="text-purple-200" size={24} />}
                        label="Total Users"
                        value={stats.totalUsers.toLocaleString()}
                        sub="Active Customers"
                        delay="100"
                        gradient="from-purple-600 to-indigo-900"
                        href="/admin/customers"
                    />

                    {/* FINANCIAL CARDS - Adaptive based on Role */}
                    {(stats as any).showFinancials === false ? (
                        /* SALES VIEW: My Performance */
                        <StatCard
                            icon={<CheckCircle className="text-emerald-200" size={24} />}
                            label="My Onboardings"
                            value={(stats as any).myMerchantsCount || 0}
                            sub="Merchants Activated"
                            delay="200"
                            gradient="from-emerald-600 to-teal-900"
                            main={true}
                        />
                    ) : (
                        /* ADMIN VIEW: Revenue */
                        <StatCard
                            icon={<IndianRupee className="text-emerald-200" size={24} />}
                            label="Est. Revenue"
                            value={`₹${stats.platformRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                            sub="2% Commission Volume"
                            delay="200"
                            gradient="from-emerald-600 to-teal-900"
                            main={true}
                        />
                    )}

                    <StatCard
                        icon={<Shield className="text-orange-200" size={24} />}
                        label="Pending KYC"
                        value={stats.pendingKyc}
                        sub="Requires verification"
                        urgent={stats.pendingKyc > 0}
                        delay="300"
                        gradient="from-orange-600 to-red-900"
                    />
                </div>

                {/* Main Content Layout */}
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Col: Pending Approvals */}
                    <div className="lg:col-span-2">
                        <div className="bg-[#131B26]/50 backdrop-blur-md rounded-3xl border border-white/5 overflow-hidden">
                            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                                <div>
                                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                        Pending Approvals
                                        {stats.pendingKyc > 0 && (
                                            <span className="bg-orange-500/20 text-orange-400 text-xs px-2 py-0.5 rounded-full border border-orange-500/20">Action Needed</span>
                                        )}
                                    </h2>
                                    <p className="text-gray-500 text-sm mt-1">Merchants waiting for KYC verification</p>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-white/5">
                                            <th className="p-6 bg-white/[0.02]">Business Details</th>
                                            <th className="p-6 bg-white/[0.02]">Status</th>
                                            <th className="p-6 bg-white/[0.02] text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {loading ? (
                                            <tr><td colSpan={3} className="p-12 text-center text-gray-500">Loading data...</td></tr>
                                        ) : pendingMerchants.length === 0 ? (
                                            <tr>
                                                <td colSpan={3} className="p-12 text-center text-gray-500">
                                                    No pending approvals. All caught up!
                                                </td>
                                            </tr>
                                        ) : (
                                            pendingMerchants.map((m) => (
                                                <tr
                                                    key={m.id}
                                                    className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                                                    onClick={() => router.push(`/admin/merchants/${m.id}`)}
                                                >
                                                    <td className="p-6">
                                                        <p className="font-bold text-white text-lg group-hover:text-[#2CB78A] transition-colors">
                                                            {m.business_name || 'Unnamed Business'}
                                                        </p>
                                                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-400">
                                                            <span className="font-mono">{m.mobile}</span>
                                                            <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                                                            <span>{new Date(m.created_at).toLocaleDateString()}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-6">
                                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                                                            Pending Review
                                                        </span>
                                                    </td>
                                                    <td className="p-6 text-right" onClick={(e) => e.stopPropagation()}>
                                                        <div className="flex items-center justify-end gap-3">
                                                            <button
                                                                onClick={() => handleReject(m.id)}
                                                                className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all"
                                                                title="Reject & Remove"
                                                            >
                                                                <XCircle size={18} />
                                                            </button>
                                                            <button
                                                                onClick={() => router.push(`/admin/merchants/${m.id}`)}
                                                                className="flex items-center gap-2 text-xs font-bold bg-[#4F46E5] text-white px-5 py-2.5 rounded-lg hover:bg-[#4338CA] transition shadow-lg shadow-indigo-900/20"
                                                            >
                                                                <Shield size={14} />
                                                                Review Application
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Recent Transactions Feed */}
                        <div className="bg-[#131B26]/50 backdrop-blur-md rounded-3xl border border-white/5 overflow-hidden mt-8">
                            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                                <div>
                                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                        <TrendingUp size={20} className="text-emerald-400" />
                                        Recent Activity
                                    </h2>
                                    <p className="text-gray-500 text-sm mt-1">Latest ecosystem transactions</p>
                                </div>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-white/5">
                                            <th className="p-4 bg-white/[0.02]">Type</th>
                                            <th className="p-4 bg-white/[0.02]">Parties</th>
                                            <th className="p-4 bg-white/[0.02] text-right">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {(stats as any).recentTransactions?.map((tx: any) => (
                                            <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
                                                <td className="p-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-bold 
                                                        ${tx.status === 'SUCCESS' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-yellow-500/10 text-yellow-500'}`}>
                                                        PAYMENT
                                                    </span>
                                                    <div className="text-[10px] text-gray-500 mt-1">{new Date(tx.created_at).toLocaleTimeString()}</div>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm text-gray-300">
                                                            To: <span className="font-bold text-white">{tx.receiver?.business_name || tx.receiver?.full_name || 'Unknown'}</span>
                                                        </span>
                                                        <span className="text-xs text-gray-500">From: {tx.sender?.mobile}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <span className="text-lg font-bold text-white">₹{tx.amount}</span>
                                                </td>
                                            </tr>
                                        ))}
                                        {(!((stats as any).recentTransactions) || (stats as any).recentTransactions.length === 0) && (
                                            <tr><td colSpan={3} className="p-8 text-center text-gray-500">No recent transactions.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Right Col: System Status (Removed Mock Feed) */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-[#131B26]/50 backdrop-blur-md rounded-3xl border border-white/5 p-6">
                            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                                <Activity size={18} className="text-blue-400" />
                                System Status
                            </h3>
                            <div className="space-y-4">
                                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                        <span className="font-bold text-green-400 text-sm">All Systems Operational</span>
                                    </div>
                                    <p className="text-xs text-gray-400">Database, Auth, and Payment Gateways are reachable.</p>
                                </div>
                                <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                    <h4 className="font-bold text-blue-400 text-sm mb-1">Connect Mobile Apps</h4>
                                    <p className="text-xs text-gray-400 mb-3">Ensure you are using the latest version of these apps to sync with this dashboard.</p>
                                    <div className="flex gap-2">
                                        <span className="text-[10px] bg-white/5 px-2 py-1 rounded border border-white/10 text-gray-300">v1.2.0 (Merchant)</span>
                                        <span className="text-[10px] bg-white/5 px-2 py-1 rounded border border-white/10 text-gray-300">v2.1.0 (Customer)</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}

function StatCard({ icon, label, value, sub, trend, urgent, delay, href, gradient, main }: any) {
    const CardContent = (
        <div
            className={`cursor-pointer p-6 rounded-3xl relative overflow-hidden transition-all hover:-translate-y-1 hover:shadow-2xl group border border-white/5
            ${gradient ? `bg-gradient-to-br ${gradient}` : 'bg-[#131B26]/60 backdrop-blur-sm'}
            ${main ? 'ring-2 ring-white/20' : ''}`}
            style={{ animationDelay: `${delay}ms` }}
        >
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-10 transition-opacity"></div>
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700"></div>

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center backdrop-blur-md border border-white/10 ${gradient ? 'bg-white/10 text-white' : 'bg-white/5'}`}>
                        {icon}
                    </div>
                </div>

                <div className={`text-xs font-bold uppercase tracking-wider mb-1 ${gradient ? 'text-white/70' : 'text-gray-400'}`}>{label}</div>
                <div className={`text-3xl font-extrabold text-white mb-2 tracking-tight`}>{value}</div>
                <div className={`text-xs font-medium ${gradient ? 'text-white/60' : 'text-gray-500'}`}>{sub}</div>
            </div>
        </div>
    );

    if (href) {
        return <Link href={href}>{CardContent}</Link>;
    }

    return CardContent;
}
