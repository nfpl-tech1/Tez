/**
 * Layout Types
 * 
 * Shared type definitions for layout components.
 */

import type { ReactNode } from 'react';

export interface NavItem {
    href: string;
    label: string;
    icon: React.ElementType;
    badge?: number;
}

export interface LayoutProps {
    children: ReactNode;
    title?: string;
}

export interface SidebarProps {
    navItems: NavItem[];
    isOpen: boolean;
    onClose: () => void;
    homeLink: string;
    bottomItems?: NavItem[];
}

export interface LayoutContentProps {
    children: ReactNode;
    title?: string;
    onMenuClick: () => void;
    showNotifications?: boolean;
}
