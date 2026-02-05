import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Button from '../components/common/Button';
import { Lock, AlertCircle } from 'lucide-react';
import FadeIn from '../components/animations/FadeIn';

const AdminLogin = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('http://localhost:5000/api/admin/login', { password });

            if (response.data.success) {
                localStorage.setItem('adminToken', response.data.token);
                navigate('/admin');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-primary-dark flex items-center justify-center px-4">
            <FadeIn>
                <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-accent-cyan/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-accent-cyan/20">
                            <Lock className="text-accent-cyan" size={32} />
                        </div>
                        <h1 className="text-3xl font-display font-bold text-white mb-2">Admin Access</h1>
                        <p className="text-text-secondary">Enter your secret password to manage projects</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Secure Password"
                                className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-accent-cyan/50 focus:ring-1 focus:ring-accent-cyan/50 transition-all font-mono"
                                required
                            />
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 text-red-400 bg-red-400/10 p-3 rounded-lg text-sm">
                                <AlertCircle size={16} />
                                <span>{error}</span>
                            </div>
                        )}

                        <Button
                            variant="primary"
                            className="w-full justify-center"
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? 'Verifying...' : 'Access Dashboard'}
                        </Button>
                    </form>
                </div>
            </FadeIn>
        </div>
    );
};

export default AdminLogin;
