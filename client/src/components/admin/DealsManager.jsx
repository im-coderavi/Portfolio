import React, { useState, useEffect } from 'react';
import { Briefcase, Mail, Phone, User, Calendar, DollarSign, Clock, Loader2, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';
import Button from '../common/Button';
import API_URL from '../../config/api';

const DealsManager = () => {
    const [deals, setDeals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    const fetchDeals = async () => {
        try {
            const password = localStorage.getItem('adminPassword');
            const url = filter === 'all'
                ? `${API_URL}/api/admin/deals`
                : `${API_URL}/api/admin/deals?status=${filter}`;

            const response = await axios.get(url, {
                headers: { 'X-Admin-Password': password }
            });
            if (response.data.success) {
                setDeals(response.data.deals);
            }
        } catch (error) {
            console.error('Failed to fetch deals', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDeals();
    }, [filter]);

    const updateDealStatus = async (dealId, newStatus) => {
        try {
            const password = localStorage.getItem('adminPassword');
            await axios.patch(`${API_URL}/api/admin/deals/${dealId}`,
                { status: newStatus },
                { headers: { 'X-Admin-Password': password } }
            );
            fetchDeals();
        } catch (error) {
            alert('Failed to update deal status');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'open': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
            case 'in-progress': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
            case 'closed': return 'bg-green-500/10 text-green-400 border-green-500/20';
            case 'cancelled': return 'bg-red-500/10 text-red-400 border-red-500/20';
            default: return 'bg-white/10 text-white border-white/20';
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="animate-spin text-accent-cyan" size={40} />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Filter Tabs */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="flex gap-2 flex-wrap">
                    {['all', 'open', 'in-progress', 'closed', 'cancelled'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all capitalize ${filter === status
                                ? 'bg-accent-cyan text-black'
                                : 'bg-white/5 text-text-secondary hover:bg-white/10'
                                }`}
                        >
                            {status === 'all' ? 'All Deals' : status.replace('-', ' ')}
                        </button>
                    ))}
                </div>
            </div>

            {/* Deals List */}
            <div className="space-y-4">
                {deals.length === 0 ? (
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-12 text-center">
                        <Briefcase className="mx-auto text-text-secondary mb-4" size={48} />
                        <p className="text-text-secondary">No deals found</p>
                    </div>
                ) : (
                    deals.map((deal) => (
                        <div
                            key={deal._id}
                            className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-accent-cyan/50 transition-colors"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="text-xl font-bold text-white">{deal.userInfo.name}</h3>
                                        <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${getStatusColor(deal.status)}`}>
                                            {deal.status.toUpperCase().replace('-', ' ')}
                                        </span>
                                    </div>
                                    <div className="grid md:grid-cols-2 gap-3 text-sm">
                                        <div className="flex items-center gap-2 text-text-secondary">
                                            <Mail size={16} className="text-accent-cyan" />
                                            {deal.userInfo.email}
                                        </div>
                                        {deal.userInfo.phone && (
                                            <div className="flex items-center gap-2 text-text-secondary">
                                                <Phone size={16} className="text-accent-cyan" />
                                                {deal.userInfo.phone}
                                            </div>
                                        )}
                                        <div className="flex items-center gap-2 text-text-secondary">
                                            <Calendar size={16} className="text-accent-cyan" />
                                            Created {new Date(deal.createdAt).toLocaleDateString()}
                                        </div>
                                        {deal.budget && (
                                            <div className="flex items-center gap-2 text-text-secondary">
                                                <DollarSign size={16} className="text-accent-cyan" />
                                                {deal.budget}
                                            </div>
                                        )}
                                        {deal.timeline && (
                                            <div className="flex items-center gap-2 text-text-secondary">
                                                <Clock size={16} className="text-accent-cyan" />
                                                {deal.timeline}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="bg-primary-dark/50 rounded-xl p-4 mb-4">
                                <h4 className="text-white font-semibold mb-2">Project Details:</h4>
                                <p className="text-text-secondary text-sm">{deal.projectDetails}</p>
                            </div>

                            {deal.notes && (
                                <div className="bg-primary-dark/50 rounded-xl p-4 mb-4">
                                    <h4 className="text-white font-semibold mb-2">Notes:</h4>
                                    <p className="text-text-secondary text-sm">{deal.notes}</p>
                                </div>
                            )}

                            <div className="flex gap-2 flex-wrap">
                                {deal.status !== 'in-progress' && deal.status !== 'closed' && (
                                    <Button
                                        variant="secondary"
                                        onClick={() => updateDealStatus(deal._id, 'in-progress')}
                                        className="!text-yellow-400 !border-yellow-500/20 hover:!bg-yellow-500/10"
                                    >
                                        Mark In Progress
                                    </Button>
                                )}
                                {deal.status !== 'closed' && (
                                    <Button
                                        variant="secondary"
                                        icon={CheckCircle}
                                        onClick={() => updateDealStatus(deal._id, 'closed')}
                                        className="!text-green-400 !border-green-500/20 hover:!bg-green-500/10"
                                    >
                                        Mark Closed
                                    </Button>
                                )}
                                {deal.status !== 'cancelled' && deal.status !== 'closed' && (
                                    <Button
                                        variant="secondary"
                                        icon={XCircle}
                                        onClick={() => updateDealStatus(deal._id, 'cancelled')}
                                        className="!text-red-400 !border-red-500/20 hover:!bg-red-500/10"
                                    >
                                        Cancel
                                    </Button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default DealsManager;
