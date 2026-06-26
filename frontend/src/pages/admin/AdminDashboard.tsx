/**
 * Admin Dashboard Page
 * 
 * Overview dashboard for administrators.
 * Refactored to use extracted components.
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { StatsGrid, LoadingState, type StatCard } from '@/components/shared';
import { QuickActionsCard, NotificationsCard } from '@/components/admin';
import { adminApi, type Notification } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';
import { Clock, Users, Package, Download, User } from 'lucide-react';

interface DashboardStats {
    pending_count: number;
    team_member_count: number;
    total_tools: number;
    total_downloads: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            loadData();
        }
    }, [isAuthenticated]);

    const loadData = async () => {
        try {
            setLoading(true);
            const [statsData, notificationsData] = await Promise.all([
                adminApi.getDashboard(),
                adminApi.getNotifications(),
            ]);
            setStats(statsData);
            setNotifications(notificationsData);
        } catch (error) {
            console.error('Failed to load dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAllRead = async () => {
        await adminApi.markAllNotificationsRead();
        setNotifications(notifications.map(n => ({ ...n, is_read: true })));
    };

    if (loading) {
        return (
            <AdminLayout title="Dashboard">
                <LoadingState fullScreen message="Loading dashboard..." />
            </AdminLayout>
        );
    }

    const statCards: StatCard[] = [
        { label: 'Pending Reviews', value: stats?.pending_count || 0, icon: Clock, color: 'text-amber-600', bgColor: 'bg-amber-100', onClick: () => navigate('/admin/tools/pending') },
        { label: 'Team Members', value: stats?.team_member_count || 0, icon: Users, color: 'text-blue-600', bgColor: 'bg-blue-100', onClick: () => navigate('/admin/team-members') },
        { label: 'Published Tools', value: stats?.total_tools || 0, icon: Package, color: 'text-green-600', bgColor: 'bg-green-100', onClick: () => navigate('/tools') },
        { label: 'Total Downloads', value: stats?.total_downloads || 0, icon: Download, color: 'text-purple-600', bgColor: 'bg-purple-100' },
    ];

    const quickActions = [
        { href: '/admin/tools/pending', label: 'Review Pending Tools', icon: Clock, badge: stats?.pending_count },
        { href: '/admin/team-members', label: 'Manage Team Members', icon: Users },
        { href: '/admin/departments', label: 'Manage Departments', icon: Package },
        { href: '/admin/profile', label: 'Edit My Profile', icon: User },
    ];

    return (
        <AdminLayout title="Dashboard">
            <div className="space-y-8">
                {/* Welcome Message */}
                <div className="bg-gradient-to-r from-[hsl(var(--primary))] to-blue-600 rounded-2xl p-6 text-white">
                    <h2 className="text-2xl font-bold mb-2">Welcome back!</h2>
                    <p className="text-blue-100">
                        {stats?.pending_count
                            ? `You have ${stats.pending_count} tool${stats.pending_count > 1 ? 's' : ''} waiting for review.`
                            : 'All caught up! No pending reviews at the moment.'}
                    </p>
                </div>

                <StatsGrid stats={statCards} columns={4} />

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    <QuickActionsCard actions={quickActions} />
                    <NotificationsCard notifications={notifications} onMarkAllRead={handleMarkAllRead} />
                </div>
            </div>
        </AdminLayout>
    );
}
