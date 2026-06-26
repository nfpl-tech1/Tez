/**
 * Layout Components
 * 
 * Barrel export for all layout components.
 */

// Main layouts
export { AdminLayout } from './AdminLayout';
export { TeamLayout } from './TeamLayout';
export { PublicLayout } from './PublicLayout';

// Internal components (for extension/customization)
export { Sidebar } from './Sidebar';
export { LayoutContent } from './LayoutContent';

// Types
export type { NavItem, LayoutProps, SidebarProps, LayoutContentProps } from './types';
