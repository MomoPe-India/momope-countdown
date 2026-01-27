'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getMerchantsList } from '@/app/actions/getMerchantsList';
import { deleteUser } from '@/app/actions/deleteUser';
import { Search, ChevronRight, Activity, Shield, MoreHorizontal, Trash2 } from 'lucide-react';

// Using Server Actions is better, but for speed I'll simulate client fetch
// OR reuse getDashboardStats logic but expanded.
// Let's stick to client fetch with useEffect for list view as it's interactive.

export default function MerchantsList() {
    const router = useRouter();
    const [merchants, setMerchants] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchMerchants();
    }, []);

    const fetchMerchants = async () => {
        setLoading(true);
        try {
            const data = await getMerchantsList();
            setMerchants(data);
        } catch (error) {
            console.error("Failed to fetch merchants:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (e: any, id: string) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to PERMANENTLY DELETE this merchant?')) {
            await deleteUser(id);
            fetchMerchants();
        }
    };

    const filtered = merchants.filter(m =>
        m.business_name.toLowerCase().includes(search.toLowerCase()) ||
        m.mobile.includes(search)
    );

    return (
        <div className="min-h-screen bg-[#0B1121] text-white font-sans p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <Link href="/admin/dashboard" className="text-gray-400 text-sm hover:text-white mb-2 inline-block">← Back to Dashboard</Link>
                        <h1 className="text-3xl font-bold">Merchants Directory</h1>
                    </div>
                    <Link href="/admin/dashboard" className="bg-white/5 px-4 py-2 rounded-lg text-sm border border-white/10 hover:bg-white/10 transition">Export CSV</Link>
                </div>

                {/* Search */}
                <div className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by business name or mobile..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full bg-[#131B26] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#2CB78A]"
                    />
                </div>

                {/* Table */}
                <div className="bg-[#131B26] rounded-2xl border border-white/5 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-xs font-bold text-gray-500 uppercase border-b border-white/5 bg-white/[0.02]">
                                <th className="p-4 pl-6">Business</th>
                                <th className="p-4">Mobile</th>
                                <th className="p-4">Commission</th>
                                <th className="p-4">Status</th>
                                <th className="p-4">Joined</th>
                                <th className="p-4 text-right pr-6">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr><td colSpan={6} className="p-8 text-center text-gray-500">Loading directory...</td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan={6} className="p-8 text-center text-gray-500">No merchants found.</td></tr>
                            ) : (
                                filtered.map(m => (
                                    <tr key={m.id} className="hover:bg-white/5 cursor-pointer group" onClick={() => router.push(`/admin/merchants/${m.id}`)}>
                                        <td className="p-4 pl-6">
                                            <div className="font-bold text-white group-hover:text-[#2CB78A] transition">{m.business_name}</div>
                                            <div className="text-xs text-gray-500">ID: {m.id.slice(0, 8)}...</div>
                                        </td>
                                        <td className="p-4 text-gray-300 font-mono text-sm">{m.mobile}</td>
                                        <td className="p-4 text-gray-300">{m.commission}%</td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${m.status === 'Active' ? 'bg-green-500/10 text-green-500 border border-green-500/20' :
                                                'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
                                                }`}>
                                                {m.status}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-400 text-sm">{new Date(m.joined).toLocaleDateString()}</td>
                                        <td className="p-4 text-right pr-6 flex justify-end items-center gap-2">
                                            <button
                                                onClick={(e) => handleDelete(e, m.id)}
                                                className="p-2 text-gray-500 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition"
                                                title="Delete Merchant"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                            <ChevronRight className="inline text-gray-600" size={18} />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
