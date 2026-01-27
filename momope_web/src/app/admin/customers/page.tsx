'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getCustomers } from '../../actions/getCustomers';
import { deleteUser } from '../../actions/deleteUser';
import { Search, Trash2, User, Mail, Smartphone, Calendar, Coins } from 'lucide-react';

export default function CustomersPage() {
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const loadData = async () => {
        setLoading(true);
        const data = await getCustomers();
        setCustomers(data);
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to PERMANENTLY DELETE this user?')) return;

        try {
            const res = await deleteUser(id);
            if (res.success) {
                alert('User Deleted Successfully');
                loadData();
            } else {
                alert('Failed to delete: ' + res.error);
            }
        } catch (e) {
            alert('An unexpected error occurred.');
        }
    };

    const filtered = customers.filter(c =>
        c.full_name.toLowerCase().includes(search.toLowerCase()) ||
        c.email.toLowerCase().includes(search.toLowerCase()) ||
        c.mobile.includes(search)
    );

    return (
        <div className="min-h-screen bg-[#0B1121] text-white font-sans p-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <Link href="/admin/dashboard" className="text-gray-400 text-sm hover:text-white mb-2 inline-block">← Back to Dashboard</Link>
                        <h1 className="text-3xl font-bold">Customers Directory</h1>
                    </div>
                </div>

                <div className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search customers..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full bg-[#131B26] border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-[#2CB78A]"
                    />
                </div>

                <div className="bg-[#131B26] rounded-2xl border border-white/5 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-xs font-bold text-gray-500 uppercase border-b border-white/5 bg-white/[0.02]">
                                <th className="p-4 pl-6">User</th>
                                <th className="p-4">Contact</th>
                                <th className="p-4">Coins</th>
                                <th className="p-4">Joined</th>
                                <th className="p-4 text-right pr-6">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr><td colSpan={5} className="p-8 text-center text-gray-500">Loading customers...</td></tr>
                            ) : filtered.length === 0 ? (
                                <tr><td colSpan={5} className="p-8 text-center text-gray-500">No customers found.</td></tr>
                            ) : (
                                filtered.map((c) => (
                                    <tr key={c.id} className="hover:bg-white/5 transition group">
                                        <td className="p-4 pl-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-[#2CB78A] font-bold">
                                                    {c.full_name.charAt(0)}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-white">{c.full_name}</div>
                                                    <div className="text-xs text-gray-500">ID: {c.id.slice(0, 8)}...</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-sm text-gray-300">
                                                    <Smartphone size={14} className="text-gray-500" /> {c.mobile}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-gray-300">
                                                    <Mail size={14} className="text-gray-500" /> {c.email}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2 text-yellow-400 font-mono">
                                                <Coins size={16} />
                                                {c.coins}
                                            </div>
                                        </td>
                                        <td className="p-4 text-gray-400 text-sm">{c.joined_at}</td>
                                        <td className="p-4 text-right pr-6">
                                            <button
                                                onClick={() => handleDelete(c.id)}
                                                className="text-gray-500 hover:text-red-400 hover:bg-red-500/10 p-2 rounded-lg transition"
                                                title="Delete User"
                                            >
                                                <Trash2 size={18} />
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
    );
}
