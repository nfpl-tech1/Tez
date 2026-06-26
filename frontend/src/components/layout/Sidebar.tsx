/**
 * Sidebar Component
 * 
 * Shared sidebar navigation for authenticated layouts (Admin & Team).
 */

import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/Logo';
import { LogOut, X } from 'lucide-react';
import { ROUTES } from '@/lib/constants';
import type { SidebarProps, NavItem } from './types';

/**
 * Navigation link component with active state styling
 */
function NavLink({ item, onClose }: { item: NavItem; onClose: () => void }) {
    const location = useLocation();
    const isActive = location.pathname === item.href;

    return (
        <Link
            to={item.href}
            className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                ? 'bg-[hsl(var(--primary))] text-white shadow-md'
                : 'text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]'
                }`}
            onClick={onClose}
        >
            <span className="flex items-center gap-3">
                <item.icon className="h-5 w-5" />
                {item.label}
            </span>
            {item.badge !== undefined && item.badge > 0 && (
                <span className={`text-xs px-2 py-0.5 rounded-full ${isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))]'
                    }`}>
                    {item.badge}
                </span>
            )}
        </Link>
    );
}

/**
 * Sidebar component with navigation, user info, and logout
 */
export function Sidebar({
    navItems,
    isOpen,
    onClose,
    homeLink,
    bottomItems
}: SidebarProps) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate(ROUTES.LOGIN);
    };

    return (
        <>
            {/* Mobile overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 h-full w-72 bg-white border-r border-[hsl(var(--border))] z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
                } lg:translate-x-0 shadow-xl lg:shadow-none`}>
                <div className="flex flex-col h-full">
                    {/* Logo - Fixed height to match main header */}
                    <div className="h-16 flex items-center justify-center px-4 border-b border-[hsl(var(--border))] relative">
                        <Link to={homeLink}>
                            <Logo size="sm" />
                        </Link>
                        <button
                            className="lg:hidden absolute right-4 p-1.5 hover:bg-[hsl(var(--muted))] rounded-md"
                            onClick={onClose}
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
                        <p className="text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider px-3 mb-3">
                            Menu
                        </p>
                        {navItems.map((item) => (
                            <NavLink key={item.href} item={item} onClose={onClose} />
                        ))}

                        {bottomItems && bottomItems.length > 0 && (
                            <>
                                <div className="my-4 border-t border-[hsl(var(--border))]" />
                                <p className="text-xs font-semibold text-[hsl(var(--muted-foreground))] uppercase tracking-wider px-3 mb-3">
                                    Settings
                                </p>
                                {bottomItems.map((item) => (
                                    <NavLink key={item.href} item={item} onClose={onClose} />
                                ))}
                            </>
                        )}
                    </nav>

                    {/* User section */}
                    <div className="p-4 border-t border-[hsl(var(--border))] bg-[hsl(var(--muted))]/30">
                        <div className="flex items-center gap-3 mb-4 p-2 rounded-lg bg-white">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[hsl(var(--primary))] to-blue-600 flex items-center justify-center text-white font-semibold shadow-md">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold truncate">{user?.name}</p>
                                <p className="text-xs text-[hsl(var(--muted-foreground))] truncate">{user?.email}</p>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            className="w-full justify-center hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                            onClick={handleLogout}
                        >
                            <LogOut className="h-4 w-4 mr-2" />
                            Sign out
                        </Button>
                    </div>
                </div>
            </aside>
        </>
    );
}

export default Sidebar;
