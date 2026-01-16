'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const styles = {
    // We are using inline styles for MVP, but relying on globals for colors basically
    dashboardContainer: { padding: '40px', backgroundColor: '#F3F4F6', minHeight: '100vh' },
    headerTitle: { fontSize: '28px', color: '#131B26', fontWeight: 'bold' },
    statusBadge: { padding: '8px 12px', backgroundColor: '#D1FAE5', color: '#065F46', borderRadius: '8px', fontSize: '14px', fontWeight: '600' },
    card: { backgroundColor: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' },
    cardTitle: { color: '#6B7280', fontSize: '14px', marginBottom: '8px', textTransform: 'uppercase' as const, letterSpacing: '0.05em' },
    cardValue: { fontSize: '36px', fontWeight: 'bold', marginBottom: '8px', color: '#131B26' },

    tableHeader: { padding: '16px 24px', color: '#131B26', fontWeight: '600', fontSize: '14px', backgroundColor: '#F9FAFB', textAlign: 'left' as const },
    tableRow: { borderBottom: '1px solid #E5E7EB' },
    tableCell: { padding: '16px 24px', fontSize: '14px', color: '#374151' }
};

export default function AdminDashboard() {
    const router = useRouter();

    const [stats, setStats] = useState({ totalMerchants: 0, totalUsers: 0, platformRevenue: 0, pendingKyc: 0 });
    const [pendingMerchants, setPendingMerchants] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem('admin_token');
        if (!token) {
            router.push('/admin/login');
        } else {
            // Initial Fetch
            fetchStats();
            fetchPendingMerchants();

            // Auto-refresh every 3 seconds
            const interval = setInterval(() => {
                fetchStats();
                fetchPendingMerchants();
            }, 3000);

            return () => clearInterval(interval);
        }
    }, []);

    const fetchStats = async () => {
        try {
            const res = await fetch('http://localhost:3000/admin/stats');
            const data = await res.json();
            setStats(data);
        } catch (e) {
            console.error('Failed to fetch stats', e);
        }
    };

    const fetchPendingMerchants = async () => {
        try {
            const res = await fetch('http://localhost:3000/admin/merchants/pending');
            const data = await res.json();
            setPendingMerchants(data);
        } catch (e) {
            console.error('Failed to fetch merchants', e);
        }
    };

    const handleApprove = async (merchantId: string) => {
        if (!confirm('Approve this merchant?')) return;
        try {
            await fetch('http://localhost:3000/admin/merchants/approve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ merchantId })
            });
            alert('Merchant Approved');
            fetchStats();
            fetchPendingMerchants();
        } catch (e) {
            alert('Approval Failed');
        }
    };

    return (
        <div style={styles.dashboardContainer}>
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <h1 style={styles.headerTitle}>MomoPe Admin</h1>
                    <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                        <span style={styles.statusBadge}>
                            ● System Operational
                        </span>
                        <button onClick={() => { localStorage.clear(); router.push('/'); }}
                            style={{ color: '#EF4444', border: '1px solid #EF4444', background: 'transparent', cursor: 'pointer', fontWeight: 600, padding: '8px 16px', borderRadius: '8px' }}>
                            Logout
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '48px' }}>
                    <StatCard title="Merchants" value={stats.totalMerchants} change="Active on Platform" />
                    <StatCard title="Users" value={stats.totalUsers} change="Total Registered" />
                    <StatCard title="Revenue" value={`₹${stats.platformRevenue}`} change="Net Commission" />
                    <StatCard title="Action Items" value={stats.pendingKyc} change="Pending Approvals" urgent={stats.pendingKyc > 0} />
                </div>

                {/* KYC Review Section */}
                <div style={{ backgroundColor: '#fff', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
                    <div style={{ padding: '24px', borderBottom: '1px solid #E5E7EB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#131B26', margin: 0 }}>Pending Approvals</h2>
                    </div>

                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={styles.tableHeader}>Business Name</th>
                                <th style={styles.tableHeader}>Mobile</th>
                                <th style={styles.tableHeader}>Date</th>
                                <th style={styles.tableHeader}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pendingMerchants.length === 0 ? (
                                <tr><td colSpan={4} style={{ padding: '40px', textAlign: 'center', color: '#9CA3AF' }}>No pending approvals</td></tr>
                            ) : (
                                pendingMerchants.map((m: any) => (
                                    <TableRow
                                        key={m.user_id}
                                        name={m.business_name}
                                        owner={m.mobile}
                                        date={new Date(m.created_at).toLocaleDateString()}
                                        onApprove={() => handleApprove(m.user_id)}
                                    />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, change, urgent }: any) {
    return (
        <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '15px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '10px' }}>{title}</p>
            <h3 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '10px', color: '#111827' }}>{value}</h3>
            <p style={{ color: urgent ? '#dc2626' : '#10b981', fontSize: '13px', fontWeight: 600 }}>{change}</p>
        </div>
    )
}

function TableRow({ name, owner, date, onApprove }: any) {
    return (
        <tr style={{ borderBottom: '1px solid #f9fafb' }}>
            <td style={{ padding: '20px 0', fontWeight: 500 }}>{name}</td>
            <td style={{ padding: '20px 0', color: '#6b7280' }}>{owner}</td>
            <td style={{ padding: '20px 0', color: '#6b7280' }}>{date}</td>
            <td style={{ padding: '20px 0' }}>
                <button onClick={onApprove} style={{ marginRight: '10px', color: '#4f46e5', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Approve</button>
                <button style={{ color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Reject</button>
            </td>
        </tr>
    )
}
