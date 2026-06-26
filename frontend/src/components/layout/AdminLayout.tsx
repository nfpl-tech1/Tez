/**
 * AdminLayout Component
 * 
 * Layout wrapper for admin pages.
 * Includes sidebar with admin navigation and notification support.
 */

import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { LayoutContent } from './LayoutContent';
import { ROUTES } from '@/lib/constants';
import {
    LayoutDashboard,
    Package2,
    Users,
    Clock,
    FolderOpen,
    User,
} from 'lucide-react';
import type { LayoutProps, NavItem } from './types';

/**
 * Admin navigation items
 */
const ADMIN_NAV_ITEMS: NavItem[] = [
    { href: ROUTES.ADMIN.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { href: ROUTES.ADMIN.PENDING, label: 'Pending Reviews', icon: Clock },
    { href: ROUTES.ADMIN.TOOLS, label: 'All Tools', icon: Package2 },
    { href: ROUTES.ADMIN.TEAM_MEMBERS, label: 'Team Members', icon: Users },
    { href: ROUTES.ADMIN.DEPARTMENTS, label: 'Departments', icon: FolderOpen },
];

const ADMIN_BOTTOM_ITEMS: NavItem[] = [
    { href: ROUTES.ADMIN.PROFILE, label: 'Profile', icon: User },
];

/**
 * Admin Layout with sidebar navigation
 */
export function AdminLayout({ children, title }: LayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[hsl(var(--background))]">
            <Sidebar
                navItems={ADMIN_NAV_ITEMS}
                bottomItems={ADMIN_BOTTOM_ITEMS}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                homeLink={ROUTES.ADMIN.DASHBOARD}
            />
            <LayoutContent
                title={title}
                onMenuClick={() => setSidebarOpen(true)}
                showNotifications={true}
            >
                {children}
            </LayoutContent>
        </div>
    );
}

export default AdminLayout;
