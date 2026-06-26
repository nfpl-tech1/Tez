/**
 * Admin Dashboard Components
 * 
 * Extracted components for the admin dashboard page.
 */
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Notification } from '@/lib/api';
import {
    Bell, CheckCircle2, AlertCircle, ExternalLink, type LucideIcon
} from 'lucide-react';

// ============================================================================
// Types
// ============================================================================
interface QuickAction {
    href: string;
    label: string;
    icon: LucideIcon;
    badge?: number;
}

interface QuickActionsCardProps {
    actions: QuickAction[];
}

interface NotificationsCardProps {
    notifications: Notification[];
    onMarkAllRead: () => void;
}

// ============================================================================
// Quick Actions Card
// ============================================================================
export function QuickActionsCard({ actions }: QuickActionsCardProps) {
    return (
        <Card className="xl:col-span-1">
            <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                {actions.map((action, idx) => (
                    <Link key={idx} to={action.href} className="block">
                        <Button
                            variant="outline"
                            className="w-full justify-between h-12 text-left hover:bg-[hsl(var(--muted))] hover:border-[hsl(var(--primary))]"
                        >
                            <span className="flex items-center gap-3">
                                <action.icon className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                                {action.label}
                            </span>
                            {action.badge !== undefined && action.badge > 0 && (
                                <Badge variant="pending">{action.badge}</Badge>
                            )}
                        </Button>
                    </Link>
                ))}
            </CardContent>
        </Card>
    );
}

// ============================================================================
// Notifications Card
// ============================================================================
export function NotificationsCard({ notifications, onMarkAllRead }: NotificationsCardProps) {
    const navigate = useNavigate();
    const unreadCount = notifications.filter(n => !n.is_read).length;

    const handleNotificationClick = (notification: Notification) => {
        if (notification.tool_id) {
            if (notification.tool_status === 'approved') {
                navigate(`/tools/${notification.tool_id}`);
            } else {
                navigate(`/admin/tools/${notification.tool_id}/review`);
            }
        }
    };

    return (
        <Card className="xl:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Recent Notifications
                    {unreadCount > 0 && (
                        <Badge className="ml-2">{unreadCount} new</Badge>
                    )}
                </CardTitle>
                {unreadCount > 0 && (
                    <Button variant="ghost" size="sm" onClick={onMarkAllRead}>
                        Mark all read
                    </Button>
                )}
            </CardHeader>
            <CardContent>
                {notifications.length === 0 ? (
                    <div className="text-center py-8 text-[hsl(var(--muted-foreground))]">
                        <Bell className="h-12 w-12 mx-auto mb-3 opacity-30" />
                        <p>No notifications yet</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {notifications.slice(0, 6).map((notification) => (
                            <NotificationItem
                                key={notification.id}
                                notification={notification}
                                onClick={() => handleNotificationClick(notification)}
                            />
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

// ============================================================================
// Notification Item
// ============================================================================
interface NotificationItemProps {
    notification: Notification;
    onClick: () => void;
}

function NotificationItem({ notification, onClick }: NotificationItemProps) {
    const isWarning = notification.type === 'tool_resubmitted' || notification.type === 'issue';

    return (
        <div
            className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-all hover:shadow-md ${
                notification.is_read
                    ? 'bg-white border-[hsl(var(--border))]'
                    : 'bg-blue-50 border-blue-200'
            }`}
            onClick={onClick}
        >
            <div className={`p-2 rounded-lg ${isWarning ? 'bg-amber-100' : 'bg-green-100'}`}>
                {isWarning ? (
                    <AlertCircle className="h-5 w-5 text-amber-600" />
                ) : (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                )}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{notification.message}</p>
                <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">
                    {notification.time_ago}
                </p>
            </div>
            {notification.tool_id && (
                <ExternalLink className="h-4 w-4 text-[hsl(var(--muted-foreground))] flex-shrink-0" />
            )}
        </div>
    );
}
