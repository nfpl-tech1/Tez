/**
 * ToolCard Component
 * 
 * Reusable card component for displaying tool information in lists.
 * Extracted from AllToolsList for better modularity and reusability.
 */

import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ToolStatusBadge } from './ToolStatusBadge';
import { ROUTES } from '@/lib/constants';
import type { ToolStatus } from '@/lib/types';
import {
    Edit, Trash2, Eye, AlertTriangle,
    Package, User, Download, FolderOpen
} from 'lucide-react';

export interface ToolCardData {
    id: number;
    name: string;
    description: string;
    status: ToolStatus | string;
    file_name: string | null;
    file_size: number;
    file_size_display?: string;
    download_count: number;
    department_names: string[];
    department_ids?: number[];
    uploader_name?: string;
    created_at: string;
    updated_at: string;
    can_edit?: boolean;
    can_update_content?: boolean;
    open_issue_count?: number;
    admin_remarks?: string | null;
}

export interface ToolCardProps {
    /** Tool data to display */
    tool: ToolCardData;
    /** Whether the current user is an admin */
    isAdmin: boolean;
    /** Callback when delete button is clicked */
    onDelete?: (e: React.MouseEvent, id: number, name: string) => void;
    /** Custom edit path (optional, will use ROUTES if not provided) */
    editPath?: string;
    /** Additional CSS classes */
    className?: string;
}

/**
 * Formats file size to human-readable string
 */
function formatFileSize(bytes: number, display?: string): string {
    if (display) return display;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * ToolCard displays tool information in a card format with actions.
 */
export function ToolCard({
    tool,
    isAdmin,
    onDelete,
    editPath,
    className = ''
}: ToolCardProps) {
    const computedEditPath = editPath ?? (
        isAdmin
            ? ROUTES.ADMIN.TOOL_EDIT(tool.id)
            : ROUTES.TEAM.TOOL_EDIT(tool.id)
    );

    const canShowEditButton = isAdmin || tool.can_edit || tool.can_update_content;
    const showReviewButton = isAdmin && tool.status === 'pending';

    return (
        <Card className={`transition-all hover:shadow-md ${className}`}>
            <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Icon */}
                    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-[hsl(var(--primary))]/10 to-[hsl(var(--primary))]/20 flex items-center justify-center flex-shrink-0">
                        <Package className="h-6 w-6 text-[hsl(var(--primary))]" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        {/* Header with badges */}
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg truncate">{tool.name}</h3>
                            <ToolStatusBadge status={tool.status} size="sm" />

                            {/* Issue count badge */}
                            {tool.open_issue_count !== undefined && tool.open_issue_count > 0 && (
                                <Badge variant="destructive" className="flex items-center gap-1">
                                    <AlertTriangle className="h-3 w-3" />
                                    {tool.open_issue_count} {tool.open_issue_count === 1 ? 'Issue' : 'Issues'}
                                </Badge>
                            )}

                            {/* Department badges */}
                            {tool.department_names.map((dept, idx) => (
                                <Badge key={idx} variant="outline" className="gap-1">
                                    <FolderOpen className="h-3 w-3" />
                                    {dept}
                                </Badge>
                            ))}
                        </div>

                        {/* Description */}
                        <p className="text-sm text-[hsl(var(--muted-foreground))] line-clamp-1 mb-2">
                            {tool.description}
                        </p>

                        {/* Admin remarks for team members */}
                        {!isAdmin && tool.admin_remarks && (
                            <div className="p-2 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-800 mb-2">
                                <strong>Admin remarks:</strong> {tool.admin_remarks}
                            </div>
                        )}

                        {/* Metadata row */}
                        <div className="flex flex-wrap gap-4 text-xs text-[hsl(var(--muted-foreground))]">
                            {/* Show uploader for admin */}
                            {isAdmin && tool.uploader_name && (
                                <span className="flex items-center gap-1">
                                    <User className="h-3 w-3" />
                                    {tool.uploader_name}
                                </span>
                            )}
                            <span className="flex items-center gap-1">
                                <Download className="h-3 w-3" />
                                {tool.download_count} downloads
                            </span>
                            <span>{formatFileSize(tool.file_size, tool.file_size_display)}</span>
                            <span>{new Date(tool.updated_at).toLocaleDateString()}</span>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 flex-shrink-0">
                        {/* View button for approved tools */}
                        {tool.status === 'approved' && (
                            <Link to={ROUTES.TOOL_DETAIL(tool.id)}>
                                <Button variant="outline" size="sm">
                                    <Eye className="h-4 w-4 mr-1" />
                                    View
                                </Button>
                            </Link>
                        )}

                        {/* Review button - Admin only, pending tools */}
                        {showReviewButton && (
                            <Link to={ROUTES.ADMIN.TOOL_REVIEW(tool.id)}>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-amber-600 border-amber-300 hover:bg-amber-50"
                                >
                                    <AlertTriangle className="h-4 w-4 mr-1" />
                                    Review
                                </Button>
                            </Link>
                        )}

                        {/* Edit button */}
                        {canShowEditButton && (
                            <Link to={computedEditPath}>
                                <Button variant="default" size="sm">
                                    <Edit className="h-4 w-4 mr-1" />
                                    Edit
                                </Button>
                            </Link>
                        )}

                        {/* Delete button - Team members only */}
                        {!isAdmin && onDelete && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:bg-red-50"
                                onClick={(e) => onDelete(e, tool.id, tool.name)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default ToolCard;
