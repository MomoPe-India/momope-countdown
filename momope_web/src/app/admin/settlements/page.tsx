'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminNavbar from '@/components/admin/AdminNavbar';
import { IndianRupee, CheckCircle, Clock } from 'lucide-react';

export default function SettlementsPage() {
    const [settlements, setSettlements] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchSettlements();
    }, []);

    const fetchSettlements = async () => {
        try {
            const token = localStorage.getItem('admin_token');
            if (!token) return router.push('/admin/login');

            const res = await fetch('/api/admin/settlements', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.success) {
                setSettlements(data.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0B1121] text-white font-sans selection:bg-[#2CB78A] selection:text-white">
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#2CB78A]/5 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[100px]"></div>
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
            </div>

            <AdminNavbar />

            <div className="container mx-auto px-6 py-10 relative z-10">
                <div className="mb-10">
                    <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                        <IndianRupee className="text-[#2CB78A]" />
                        Settlements Manager
                    </h1>
                    <p className="text-gray-400">Review platform fees and process merchant payouts.</p>
                </div>

                <div className="bg-[#131B26]/50 backdrop-blur-md rounded-3xl border border-white/5 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-white/5">
                                    <th className="p-6 bg-white/[0.02]">Merchant</th>
                                    <th className="p-6 bg-white/[0.02] text-right">Total Gross</th>
                                    <th className="p-6 bg-white/[0.02] text-right">Commission</th>
                                    <th className="p-6 bg-white/[0.02] text-right">Net Payable</th>
                                    <th className="p-6 bg-white/[0.02] text-center">Status</th>
                                    <th className="p-6 bg-white/[0.02] text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {loading ? (
                                    <tr><td colSpan={6} className="p-12 text-center text-gray-500">Loading settlements...</td></tr>
                                ) : settlements.length === 0 ? (
                                    <tr><td colSpan={6} className="p-12 text-center text-gray-500">No transactions recorded.</td></tr>
                                ) : (
                                    settlements.map((item: any) => (
                                        <tr key={item.merchant_id} className="hover:bg-white/[0.02] transition-colors">
                                            <td className="p-6">
                                                <div className="font-bold text-white">{item.merchant_name}</div>
                                                <div className="text-sm text-gray-400">{item.mobile}</div>
                                            </td>
                                            <td className="p-6 text-right font-mono text-gray-300">
                                                ₹{item.total_gross.toFixed(2)}
                                            </td>
                                            <td className="p-6 text-right font-mono text-red-400">
                                                - ₹{item.total_commission.toFixed(2)}
                                            </td>
                                            <td className="p-6 text-right font-mono font-bold text-[#2CB78A] text-lg">
                                                ₹{item.total_net.toFixed(2)}
                                            </td>
                                            <td className="p-6 text-center">
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                                                    <Clock size={12} />
                                                    Pending
                                                </span>
                                            </td>
                                            <td className="p-6 text-center">
                                                <button className="text-xs font-bold bg-[#4F46E5] text-white px-4 py-2 rounded-lg hover:bg-[#4338CA] transition shadow-lg shadow-indigo-900/20 flex items-center justify-center gap-2 mx-auto">
                                                    <CheckCircle size={14} />
                                                    Mark Paid
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
