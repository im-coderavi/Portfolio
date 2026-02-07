import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Users, Clock, Globe, Calendar } from 'lucide-react';
import API_URL from '../../config/api';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center justify-between">
        <div>
            <p className="text-text-secondary text-sm mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-white">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${color}`}>
            <Icon size={24} />
        </div>
    </div>
);

const TrafficStats = () => {
    const [stats, setStats] = useState(null);
    const [visitors, setVisitors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('adminToken');
                const headers = { Authorization: `Bearer ${token}` };

                const [statsRes, visitorsRes] = await Promise.all([
                    axios.get(`${API_URL}/api/admin/stats`, { headers }),
                    axios.get(`${API_URL}/api/admin/visitors`, { headers })
                ]);

                if (statsRes.data.success) {
                    setStats(statsRes.data.stats);
                }
                if (visitorsRes.data.success) {
                    setVisitors(visitorsRes.data.visitors);
                }
            } catch (error) {
                console.error('Failed to fetch traffic stats', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return <div className="text-white text-center py-10">Loading statistics...</div>;
    }

    return (
        <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Visitors"
                    value={stats?.total || 0}
                    icon={Users}
                    color="bg-blue-500/20 text-blue-400"
                />
                <StatCard
                    title="Today's Visits"
                    value={stats?.today || 0}
                    icon={Clock}
                    color="bg-green-500/20 text-green-400"
                />
                <StatCard
                    title="This Month"
                    value={stats?.month || 0}
                    icon={Calendar}
                    color="bg-purple-500/20 text-purple-400"
                />
                <StatCard
                    title="Active Now"
                    value={1} // Real-time not implemented yet, placeholder
                    icon={Globe}
                    color="bg-orange-500/20 text-orange-400"
                />
            </div>

            {/* Traffic Chart */}
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                <h3 className="text-xl font-bold text-white mb-6">Traffic Overview (Last 7 Days)</h3>
                <div className="h-64 w-full">
                    {stats?.chartData && stats.chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                                <XAxis
                                    dataKey="_id"
                                    stroke="#9CA3AF"
                                    tick={{ fill: '#9CA3AF' }}
                                    tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, { weekday: 'short' })}
                                />
                                <YAxis stroke="#9CA3AF" tick={{ fill: '#9CA3AF' }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                    itemStyle={{ color: '#F3F4F6' }}
                                    labelStyle={{ color: '#9CA3AF', marginBottom: '4px' }}
                                />
                                <Bar dataKey="count" fill="#22d3ee" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="h-full w-full flex items-center justify-center text-text-secondary">
                            No traffic data available to display
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Visitors Table */}
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-white/10">
                    <h3 className="text-xl font-bold text-white">Recent Visitors</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-text-secondary">
                        <thead className="bg-white/5 text-white">
                            <tr>
                                <th className="p-4">Time</th>
                                <th className="p-4">Browser/OS</th>
                                <th className="p-4">Referrer</th>
                                <th className="p-4">Language</th>
                            </tr>
                        </thead>
                        <tbody>
                            {visitors.length > 0 ? (
                                visitors.map((visitor) => (
                                    <tr key={visitor._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="p-4">
                                            {new Date(visitor.timestamp).toLocaleString(undefined, {
                                                dateStyle: 'medium',
                                                timeStyle: 'short'
                                            })}
                                        </td>
                                        <td className="p-4 max-w-xs truncate" title={visitor.userAgent}>
                                            {visitor.userAgent?.split(')')[0] + ')' || 'Unknown'}
                                        </td>
                                        <td className="p-4 truncate max-w-[150px]" title={visitor.referrer}>
                                            {visitor.referrer || 'Direct'}
                                        </td>
                                        <td className="p-4">{visitor.language}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="p-8 text-center">No recent visitors found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TrafficStats;
