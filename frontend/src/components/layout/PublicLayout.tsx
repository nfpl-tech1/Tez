/**
 * PublicLayout Component
 * 
 * Layout wrapper for public-facing pages.
 * Includes header with navigation and footer.
 */

import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Logo, APP_NAME, COMPANY_NAME } from '@/components/ui/Logo';
import { LayoutDashboard } from 'lucide-react';
import { ROUTES } from '@/lib/constants';
import { HeaderSearch } from './HeaderSearch';
import type { ReactNode } from 'react';

interface PublicLayoutProps {
    children: ReactNode;
}

/**
 * Public-facing layout with header and footer
 */
export function PublicLayout({ children }: PublicLayoutProps) {
    const { isAuthenticated, user } = useAuth();

    const dashboardLink = user?.role === 'admin'
        ? ROUTES.ADMIN.DASHBOARD
        : ROUTES.TEAM.DASHBOARD;

    return (
        <div className="min-h-screen bg-[hsl(var(--background))]">
            {/* Header */}
            <header className="bg-white border-b border-[hsl(var(--border))] sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16 gap-4">
                        <Link to={ROUTES.HOME} className="flex items-center gap-2.5 font-bold text-lg flex-shrink-0">
                            <Logo size="sm" className="translate-y-px" />
                            <span className="hidden sm:inline">{APP_NAME}</span>
                        </Link>

                        {/* Search - Center */}
                        <div className="flex-1 flex justify-center max-w-xl">
                            <HeaderSearch />
                        </div>

                        <nav className="flex items-center gap-3 flex-shrink-0">
                            <Link
                                to={ROUTES.TOOLS}
                                className="hidden sm:inline text-sm font-medium text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
                            >
                                Browse Tools
                            </Link>
                            {isAuthenticated ? (
                                <Link to={dashboardLink}>
                                    <Button size="sm" className="shadow-sm">
                                        <LayoutDashboard className="h-4 w-4 sm:mr-2" />
                                        <span className="hidden sm:inline">Dashboard</span>
                                    </Button>
                                </Link>
                            ) : (
                                <Link to={ROUTES.LOGIN}>
                                    <Button size="sm" className="shadow-sm">Sign in</Button>
                                </Link>
                            )}
                        </nav>
                    </div>
                </div>
            </header>

            {/* Content */}
            <main>{children}</main>

            {/* Footer */}
            <footer className="bg-white border-t border-[hsl(var(--border))] py-8 mt-auto">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-[hsl(var(--muted-foreground))]">
                    <p>© 2026 {COMPANY_NAME}. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

export default PublicLayout;
