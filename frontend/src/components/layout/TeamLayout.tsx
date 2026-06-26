/**
 * TeamLayout Component
 * 
 * Layout wrapper for team member pages.
 * Includes sidebar with team navigation and notification support.
 */

import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { LayoutContent } from './LayoutContent';
import { ROUTES } from '@/lib/constants';
import {
    LayoutDashboard,
    Package2,
    Upload,
    MessageSquare,
    User,
} from 'lucide-react';
import type { LayoutProps, NavItem } from './types';

/**
 * Team navigation items
 */
const TEAM_NAV_ITEMS: NavItem[] = [
    { href: ROUTES.TEAM.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { href: ROUTES.TEAM.TOOLS, label: 'All Tools', icon: Package2 },
    { href: ROUTES.TEAM.TOOL_NEW, label: 'Upload Tool', icon: Upload },
    { href: ROUTES.TEAM.ISSUES, label: 'Issues', icon: MessageSquare },
];

const TEAM_BOTTOM_ITEMS: NavItem[] = [
    { href: ROUTES.TEAM.PROFILE, label: 'Profile', icon: User },
];

/**
 * Team Layout with sidebar navigation
 */
export function TeamLayout({ children, title }: LayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-[hsl(var(--background))]">
            <Sidebar
                navItems={TEAM_NAV_ITEMS}
                bottomItems={TEAM_BOTTOM_ITEMS}
                isOpen={sidebarOpen}
                onClose={() => setSidebarOpen(false)}
                homeLink={ROUTES.TEAM.DASHBOARD}
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

export default TeamLayout;
