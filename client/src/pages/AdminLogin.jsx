import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from '../components/common/Button';
import { Lock, AlertCircle, Shield, User } from 'lucide-react';
import FadeIn from '../components/animations/FadeIn';
import API_URL from '../config/api';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post(`${API_URL}/api/admin/login`, {
                username,
                password
            });

            if (response.data.success) {
                // Store token in localStorage
                localStorage.setItem('adminToken', response.data.token);
                // Also store password for legacy components if needed (though we should migrate to token)
                localStorage.setItem('adminPassword', password);
                navigate('/admin');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Security Clearance Denied.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-primary-dark flex items-center justify-center px-4">
            <FadeIn>
                <div className="max-w-md w-full bg-black/40 border border-accent-cyan/20 rounded-2xl p-8 backdrop-blur-md shadow-[0_0_50px_rgba(0,245,255,0.1)]">
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-accent-cyan/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-accent-cyan/30 shadow-[0_0_15px_rgba(0,245,255,0.2)]">
                            <Shield className="text-accent-cyan" size={40} />
                        </div>
                        <h1 className="text-3xl font-display font-bold text-white mb-2 tracking-wider">RESTRICTED ACCESS</h1>
                        <p className="text-accent-cyan/70 font-mono text-sm">SECURITY CLEARANCE REQUIRED</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-4">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="text-accent-cyan/50" size={18} />
                                </div>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Identity Verification"
                                    className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan transition-all font-mono"
                                    required
                                />
                            </div>

                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="text-accent-cyan/50" size={18} />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Security Key"
                                    className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-accent-cyan focus:ring-1 focus:ring-accent-cyan transition-all font-mono"
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 text-red-400 bg-red-900/20 border border-red-500/20 p-3 rounded-lg text-sm font-mono">
                                <AlertCircle size={16} />
                                <span>{error}</span>
                            </div>
                        )}

                        <Button
                            variant="primary"
                            className="w-full justify-center py-4 text-lg font-bold tracking-widest"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? 'VERIFYING...' : 'AUTHENTICATE'}
                        </Button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-xs text-white/20 font-mono">
                            SYSTEM ID: ELITE-SEC-8892 // ENCRYPTED CONNECTION
                        </p>
                    </div>
                </div>
            </FadeIn>
        </div>
    );
};

export default AdminLogin;
