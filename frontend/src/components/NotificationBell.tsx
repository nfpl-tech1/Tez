import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, CheckCheck, X, AlertCircle, CheckCircle, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { teamApi, adminApi, type Notification } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

export function NotificationBell() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const isAdmin = user?.role === 'admin';
    const api = isAdmin ? adminApi : teamApi;

    useEffect(() => {
        loadNotifications();
    }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const loadNotifications = async () => {
        try {
            const data = await api.getNotifications();
            setNotifications(data.filter((n: Notification) => !n.is_read));
        } catch (err) {
            console.error('Failed to load notifications');
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            await api.markAllNotificationsRead();
            setNotifications([]);
        } catch (err) {
            console.error('Failed to mark all as read');
        }
    };

    const handleDismiss = async (id: number, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            if (isAdmin) {
                await adminApi.markNotificationRead(id);
            } else {
                await teamApi.markNotificationRead(id);
            }
            setNotifications(notifications.filter(n => n.id !== id));
        } catch (err) {
            console.error('Failed to dismiss notification');
        }
    };

    const handleNotificationClick = (notification: Notification) => {
        if (notification.tool_id) {
            if (isAdmin) {
                // Check tool status for admin navigation
                if (notification.tool_status === 'approved') {
                    navigate(`/tools/${notification.tool_id}`);
                } else {
                    navigate(`/admin/tools/${notification.tool_id}/review`);
                }
            } else {
                navigate(`/team/tools/${notification.tool_id}/edit`);
            }
        }
        setIsOpen(false);
    };

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'tool_approved':
                return <CheckCircle className="h-4 w-4 text-green-600" />;
            case 'changes_requested':
                return <AlertCircle className="h-4 w-4 text-orange-600" />;
            case 'issue':
                return <AlertCircle className="h-4 w-4 text-amber-600" />;
            default:
                return <Package className="h-4 w-4 text-blue-600" />;
        }
    };

    const unreadCount = notifications.length;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                className="relative p-2 hover:bg-[hsl(var(--muted))] rounded-lg transition-colors"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Bell className="h-5 w-5 text-[hsl(var(--muted-foreground))]" />
                {unreadCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 h-5 w-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-xl border border-[hsl(var(--border))] overflow-hidden z-50">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-[hsl(var(--border))] bg-[hsl(var(--muted))]/30">
                        <h3 className="font-semibold">Notifications</h3>
                        {unreadCount > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs"
                                onClick={handleMarkAllRead}
                            >
                                <CheckCheck className="h-3 w-3 mr-1" />
                                Mark all read
                            </Button>
                        )}
                    </div>

                    {/* Notifications List */}
                    <div className="max-h-96 overflow-y-auto">
                        {loading ? (
                            <div className="p-8 text-center text-[hsl(var(--muted-foreground))]">
                                <div className="h-6 w-6 border-2 border-[hsl(var(--muted-foreground))]/30 border-t-[hsl(var(--muted-foreground))] rounded-full animate-spin mx-auto mb-2" />
                                Loading...
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="p-8 text-center">
                                <Bell className="h-10 w-10 mx-auto text-[hsl(var(--muted-foreground))]/30 mb-2" />
                                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                                    No new notifications
                                </p>
                            </div>
                        ) : (
                            <div className="divide-y divide-[hsl(var(--border))]">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className="flex items-start gap-3 p-4 hover:bg-[hsl(var(--muted))]/50 cursor-pointer transition-colors group"
                                        onClick={() => handleNotificationClick(notification)}
                                    >
                                        <div className="flex-shrink-0 mt-0.5 p-1.5 rounded-lg bg-[hsl(var(--muted))]">
                                            {getNotificationIcon(notification.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium line-clamp-2">
                                                {notification.message}
                                            </p>
                                            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                                                {notification.time_ago}
                                            </p>
                                        </div>
                                        <button
                                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-[hsl(var(--muted))] rounded transition-opacity flex-shrink-0"
                                            onClick={(e) => handleDismiss(notification.id, e)}
                                            title="Dismiss"
                                        >
                                            <X className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="px-4 py-2 border-t border-[hsl(var(--border))] bg-[hsl(var(--muted))]/30">
                            <p className="text-xs text-center text-[hsl(var(--muted-foreground))]">
                                Click a notification to view details
                            </p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
