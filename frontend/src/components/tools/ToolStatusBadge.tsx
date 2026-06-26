/**
 * ToolStatusBadge Component
 * 
 * Reusable status badge for tool status display.
 * Consolidates status display logic that was duplicated across multiple files.
 */

import { Badge } from '@/components/ui/badge';
import { getStatusConfig } from '@/lib/constants';
import type { ToolStatus } from '@/lib/types';

interface ToolStatusBadgeProps {
    /** Tool status to display */
    status: ToolStatus | string;
    /** Show icon alongside label */
    showIcon?: boolean;
    /** Additional CSS classes */
    className?: string;
    /** Size variant */
    size?: 'sm' | 'default';
}

/**
 * Displays a status badge with consistent styling across the application.
 * Uses centralized status configuration from constants.ts
 */
export function ToolStatusBadge({
    status,
    showIcon = true,
    className = '',
    size = 'default'
}: ToolStatusBadgeProps) {
    const config = getStatusConfig(status);
    const Icon = config.icon;

    const sizeClasses = size === 'sm'
        ? 'text-xs px-2 py-0.5'
        : 'px-2.5 py-1';

    return (
        <Badge
            variant={config.variant}
            className={`flex items-center gap-1 ${sizeClasses} ${className}`}
        >
            {showIcon && <Icon className={size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'} />}
            {config.label}
        </Badge>
    );
}

/**
 * Returns a status indicator dot for compact displays
 */
export function ToolStatusDot({ status, className = '' }: { status: ToolStatus | string; className?: string }) {
    const config = getStatusConfig(status);

    return (
        <span
            className={`inline-block w-2 h-2 rounded-full ${config.bgColor} ${className}`}
            title={config.label}
        />
    );
}

/**
 * Status banner component for page headers
 * Shows status info and admin remarks when applicable
 */
export function ToolStatusBanner({
    status,
    remarks,
    className = ''
}: {
    status: ToolStatus | string;
    remarks?: string | null;
    className?: string;
}) {
    const config = getStatusConfig(status);
    const Icon = config.icon;

    // Only show banner for statuses that need attention or when there are remarks
    if (status === 'approved' && !remarks) return null;
    // Don't show banner for draft status unless there are remarks
    if (status === 'draft' && !remarks) return null;

    return (
        <div className={`flex items-start gap-3 p-4 rounded-xl ${config.bgColor} border ${config.borderColor} ${className}`}>
            <div className="p-2 rounded-lg bg-white shadow-sm">
                <Icon className={`h-5 w-5 ${config.textColor}`} />
            </div>
            <div className="flex-1">
                <h4 className={`font-medium ${config.textColor}`}>
                    {status === 'changes_requested' ? 'Changes Requested by Admin' : `Status: ${config.label}`}
                </h4>
                {remarks && (
                    <p className={`text-sm mt-1 ${config.textColor} opacity-80`}>
                        {remarks}
                    </p>
                )}
            </div>
        </div>
    );
}

export default ToolStatusBadge;
