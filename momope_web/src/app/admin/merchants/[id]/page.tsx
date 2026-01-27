'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, Shield, Building, Phone, Mail, MapPin, Calendar, CreditCard, Activity, AlertTriangle, Trash2 } from 'lucide-react';
import { getMerchantDetails } from '@/app/actions/getMerchantDetails';
import { approveMerchant, rejectMerchant } from '@/app/actions/merchantActions';

export default function MerchantDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    // Unwrap params using React.use()
    const { id } = use(params);

    const [merchant, setMerchant] = useState<any>(null);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        async function load() {
            try {
                const data = await getMerchantDetails(id);
                if (data) {
                    setMerchant(data.merchant);
                    setTransactions(data.transactions);
                } else {
                    alert('Merchant not found');
                    router.push('/admin/dashboard');
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [id]);

    const handleApprove = async () => {
        if (!confirm('Approve this merchant?')) return;
        setActionLoading(true);
        try {
            const res = await approveMerchant(id);
            if (res.success) {
                alert('Approved!');
                router.push('/admin/dashboard');
            } else {
                alert('Failed to approve.');
            }
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async () => {
        if (!confirm('Reject and verify this merchant?')) return;
        setActionLoading(true);
        try {
            const res = await rejectMerchant(id);
            if (res.success) {
                alert('Rejected.');
                router.push('/admin/dashboard');
            } else {
                alert('Failed to reject.');
            }
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return <div className="min-h-screen bg-[#0B1121] flex items-center justify-center text-white">Loading Insights...</div>;
    }

    if (!merchant) return null;

    return (
        <div className="min-h-screen bg-[#0B1121] text-white font-sans selection:bg-[#2CB78A] selection:text-white">
            {/* Background Effects */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#2CB78A]/5 rounded-full blur-[120px]"></div>
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
            </div>

            <nav className="sticky top-0 z-50 bg-[#0B1121]/80 backdrop-blur-xl border-b border-white/5">
                <div className="container mx-auto px-6 py-4">
                    <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition">
                        <ArrowLeft size={18} />
                        Back to Dashboard
                    </Link>
                </div>
            </nav>

            <div className="container mx-auto px-6 py-10 relative z-10">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#2CB78A] to-[#131B26] flex items-center justify-center text-2xl font-bold border-4 border-[#0B1121] shadow-xl">
                            {merchant.business_name?.[0] || 'M'}
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-2">{merchant.business_name || 'Unnamed Business'}</h1>
                            <div className="flex items-center gap-3">
                                <span className="bg-white/10 text-gray-300 text-xs px-2 py-1 rounded border border-white/10 font-mono">
                                    ID: {merchant.id.split('-')[0]}...
                                </span>
                                {merchant.kyc_verified ? (
                                    <span className="flex items-center gap-1 text-[#2CB78A] text-xs font-bold bg-[#2CB78A]/10 px-2 py-1 rounded">
                                        <CheckCircle size={12} /> Verified
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1 text-orange-400 text-xs font-bold bg-orange-500/10 px-2 py-1 rounded">
                                        <AlertTriangle size={12} /> Pending Verification
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={handleReject}
                            disabled={actionLoading}
                            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 px-6 py-3 rounded-xl font-bold transition flex items-center gap-2"
                        >
                            <Trash2 size={18} /> Delete Merchant
                        </button>
                        {!merchant.kyc_verified && (
                            <button
                                onClick={handleApprove}
                                disabled={actionLoading}
                                className="bg-[#2CB78A] hover:bg-[#249671] text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-green-900/20 transition flex items-center gap-2"
                            >
                                <CheckCircle size={18} /> Approve Merchant
                            </button>
                        )}
                    </div>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">

                    {/* Left Column: Business Profile */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Profile Card */}
                        <div className="bg-[#131B26]/50 backdrop-blur-md rounded-3xl border border-white/5 p-8">
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <Building size={20} className="text-blue-400" />
                                Business Information
                            </h2>
                            <div className="grid md:grid-cols-2 gap-y-6 gap-x-12">
                                <div>
                                    <label className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1 block">Full Name</label>
                                    <p className="text-lg text-white">{merchant.full_name || 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1 block">Mobile Number</label>
                                    <p className="text-lg text-white font-mono flex items-center gap-2">
                                        <Phone size={14} className="text-gray-500" />
                                        {merchant.mobile}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1 block">Email Address</label>
                                    <p className="text-lg text-white flex items-center gap-2">
                                        <Mail size={14} className="text-gray-500" />
                                        {merchant.email || 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1 block">Registered On</label>
                                    <p className="text-lg text-white flex items-center gap-2">
                                        <Calendar size={14} className="text-gray-500" />
                                        {new Date(merchant.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-[#131B26]/50 backdrop-blur-md rounded-3xl border border-white/5 overflow-hidden">
                            <div className="p-8 border-b border-white/5">
                                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                    <Activity size={20} className="text-purple-400" />
                                    Transaction History
                                </h2>
                            </div>
                            {transactions.length > 0 ? (
                                <table className="w-full text-left">
                                    <thead className="bg-white/5 text-gray-400 text-xs uppercase font-bold">
                                        <tr>
                                            <th className="p-4">Date</th>
                                            <th className="p-4">Type</th>
                                            <th className="p-4 text-right">Amount</th>
                                            <th className="p-4 text-right">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {transactions.map((tx) => (
                                            <tr key={tx.id} className="hover:bg-white/[0.02]">
                                                <td className="p-4 text-gray-300">{new Date(tx.created_at).toLocaleDateString()}</td>
                                                <td className="p-4">{tx.type}</td>
                                                <td className="p-4 text-right font-mono font-bold">₹{tx.amount}</td>
                                                <td className="p-4 text-right">
                                                    <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded">Success</span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="p-12 text-center text-gray-500">
                                    No transactions found for this merchant yet.
                                </div>
                            )}
                        </div>
                    </div>


                    {/* Right Column: Manual KYC & Risk */}
                    <div className="space-y-8">
                        {/* Manual KYC Form */}
                        {!merchant.kyc_verified && (
                            <div className="bg-[#131B26]/50 backdrop-blur-md rounded-3xl border border-white/5 p-8 relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-4 opacity-10">
                                    <Shield size={100} className="text-[#2CB78A]" />
                                </div>
                                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 relative z-10">
                                    <Shield size={20} className="text-[#2CB78A]" />
                                    Manual Verification
                                </h2>

                                <form action={async (formData) => {
                                    'use client';
                                    if (!confirm('Submit KYC details and Approve?')) return;
                                    setActionLoading(true);
                                    try {
                                        const data = {
                                            pan_number: formData.get('pan'),
                                            bank_account_number: formData.get('account'),
                                            ifsc_code: formData.get('ifsc')
                                        };
                                        // Dynamic import or passed prop would be better but for now let's use the hook effectively or separate component
                                        // Since this is a server component page, we need to make this a client component or use a separate form component.
                                        // Converting this entire page to 'use client' was already done at top.

                                        // Importing action dynamically to avoid build issues if needed, or just use import
                                        const { submitManualKyc } = await import('@/app/actions/merchantActions');
                                        const res = await submitManualKyc(id, data);
                                        if (res.success) {
                                            alert('KYC Updated & Merchant Approved!');
                                            window.location.reload();
                                        } else {
                                            alert('Failed: ' + res.error);
                                        }
                                    } finally {
                                        setActionLoading(false);
                                    }
                                }}>
                                    <div className="space-y-4 relative z-10">
                                        <div>
                                            <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">PAN Number</label>
                                            <input name="pan" required placeholder="ABCDE1234F" className="w-full bg-[#0B1121] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#2CB78A] focus:outline-none uppercase" />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">Bank Account Number</label>
                                            <input name="account" required placeholder="1234567890" className="w-full bg-[#0B1121] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#2CB78A] focus:outline-none" />
                                        </div>
                                        <div>
                                            <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">IFSC Code</label>
                                            <input name="ifsc" required placeholder="SBIN0001234" className="w-full bg-[#0B1121] border border-white/10 rounded-lg px-4 py-3 text-white focus:border-[#2CB78A] focus:outline-none uppercase" />
                                        </div>

                                        <button
                                            disabled={actionLoading}
                                            type="submit"
                                            className="w-full bg-[#2CB78A] hover:bg-[#249671] text-white font-bold py-4 rounded-xl shadow-lg shadow-green-900/20 transition mt-4 flex items-center justify-center gap-2"
                                        >
                                            {actionLoading ? <Activity size={18} className="animate-spin" /> : <CheckCircle size={18} />}
                                            verify & Approve
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        <div className="bg-[#131B26]/50 backdrop-blur-md rounded-3xl border border-white/5 p-8">
                            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                <Shield size={20} className="text-orange-400" />
                                Compliance Status
                            </h2>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <CreditCard size={18} className="text-gray-400" />
                                        <div className="flex flex-col">
                                            <span className="text-gray-300">PAN Card</span>
                                            <span className="text-xs text-gray-500 font-mono">{merchant.pan_number || 'Not Linked'}</span>
                                        </div>
                                    </div>
                                    {merchant.pan_number ? (
                                        <span className="text-xs font-bold text-green-400 bg-green-500/10 px-2 py-1 rounded border border-green-500/20">LINKED</span>
                                    ) : (
                                        <span className="text-xs font-bold text-gray-500 bg-gray-500/10 px-2 py-1 rounded border border-gray-500/20">MISSING</span>
                                    )}
                                </div>
                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <Building size={18} className="text-gray-400" />
                                        <div className="flex flex-col">
                                            <span className="text-gray-300">Bank Account</span>
                                            <span className="text-xs text-gray-500 font-mono">{merchant.bank_account_number ? `...${merchant.bank_account_number.slice(-4)}` : 'Not Linked'}</span>
                                        </div>
                                    </div>
                                    {merchant.bank_account_number ? (
                                        <span className="text-xs font-bold text-green-400 bg-green-500/10 px-2 py-1 rounded border border-green-500/20">LINKED</span>
                                    ) : (
                                        <span className="text-xs font-bold text-gray-500 bg-gray-500/10 px-2 py-1 rounded border border-gray-500/20">MISSING</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
