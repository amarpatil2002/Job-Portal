import { useEffect, useState } from 'react';
import api from '../../api/axios';

const StatCard = ({ title, value }) => {
    return (
        <div className="bg-white rounded-none shadow-sm border p-5">
            <p className="text-sm text-gray-500 mb-1">{title}</p>
            <p className="text-3xl font-semibold text-gray-900">{value}</p>
        </div>
    );
};

const CandidateDashboard = () => {
    const [stats, setStats] = useState({
        offerAccepted: 0,
        jobApplied: 0,
        offerRejected: 0,
        shortlisted: 0,
        offerProcessing: 0,
        profileViews: 0,
        subscriptionPlan: 'Free',
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardStats = async () => {
            try {
                const res = await api.get('/dashboard/stats');
                setStats(res.data);
            } catch (error) {
                console.error('Dashboard fetch failed', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardStats();
    }, []);

    if (loading) {
        return (
            <div className="p-6">
                <p className="text-gray-500">Loading dashboard...</p>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-500">Overview of your job activity</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard title="Offer Accepted Count" value={stats.offerAccepted} />
                <StatCard title="Job Applied Count" value={stats.jobApplied} />
                <StatCard title="Offer Rejected Count" value={stats.offerRejected} />
                <StatCard title="Shortlisted Count" value={stats.shortlisted} />
                <StatCard title="Offer Processing Count" value={stats.offerProcessing} />
                <StatCard title="Profile View Count" value={stats.profileViews} />
            </div>

            {/* Subscription Section */}
            <div className="bg-white rounded-none border shadow-sm p-5">
                <p className="text-sm text-gray-500 mb-1">Subscription Plan</p>
                <p className="text-lg font-semibold text-indigo-600">{stats.subscriptionPlan}</p>
            </div>
        </div>
    );
};

export default CandidateDashboard;
