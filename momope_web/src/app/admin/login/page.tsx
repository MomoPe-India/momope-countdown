'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // HARDCODED ADMIN PASSWORD FOR MVP
        if (password === 'admin123') {
            // In a real app, we'd set a cookie/token here
            localStorage.setItem('admin_token', 'mock_admin_token');
            router.push('/admin/dashboard');
        } else {
            setError('Invalid Password');
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f3f4f6' }}>
            <div style={{ padding: '40px', backgroundColor: '#fff', borderRadius: '15px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', width: '100%', maxWidth: '400px' }}>
                <h2 style={{ textAlign: 'center', color: 'var(--primary)', marginBottom: '30px' }}>Admin Portal</h2>

                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '16px' }}
                            placeholder="Enter admin password"
                        />
                    </div>

                    {error && <p style={{ color: 'red', fontSize: '14px', marginBottom: '20px' }}>{error}</p>}

                    <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                        Access Dashboard
                    </button>
                </form>

                <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '12px', color: '#888' }}>
                    Authorized Personnel Only
                </p>
            </div>
        </div>
    );
}
