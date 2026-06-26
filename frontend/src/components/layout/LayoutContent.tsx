/**
 * LayoutContent Component
 * 
 * Shared content wrapper for authenticated layouts.
 * Provides sticky header with title and optional notifications.
 */

import { NotificationBell } from '@/components/NotificationBell';
import { Menu } from 'lucide-react';
import type { LayoutContentProps } from './types';

/**
 * Main content area with header, used by Admin and Team layouts
 */
export function LayoutContent({
    children,
    title,
    onMenuClick,
    showNotifications = false
}: LayoutContentProps) {
    return (
        <div className="lg:pl-72 min-h-screen">
            {/* Top bar */}
            <header className="sticky top-0 z-30 h-16 bg-white/80 backdrop-blur-md border-b border-[hsl(var(--border))] flex items-center justify-between px-4 lg:px-8">
                <div className="flex items-center gap-4">
                    <button
                        className="lg:hidden p-2 hover:bg-[hsl(var(--muted))] rounded-lg transition-colors"
                        onClick={onMenuClick}
                    >
                        <Menu className="h-5 w-5" />
                    </button>
                    {title && (
                        <div className="flex items-center gap-2">
                            <h1 className="text-xl font-bold text-[hsl(var(--foreground))]">{title}</h1>
                        </div>
                    )}
                </div>
                {showNotifications && (
                    <div className="flex items-center gap-2">
                        <NotificationBell />
                    </div>
                )}
            </header>

            {/* Page content */}
            <main className="p-4 lg:p-8 bg-[hsl(var(--muted))]/50 min-h-[calc(100vh-4rem)]">
                <div className="max-w-[1600px] mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}

export default LayoutContent;
