import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TeamLayout } from '@/components/layout/TeamLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatsGrid, LoadingState, EmptyState, type StatCard } from '@/components/shared';
import { teamApi, type Tool } from '@/lib/api';
import { Plus, Edit, Trash2, Eye, Clock, Check, AlertCircle, FileText, AlertTriangle } from 'lucide-react';

export default function TeamDashboard() {
    const [tools, setTools] = useState<Tool[]>([]);
    const [statusCounts, setStatusCounts] = useState({ draft: 0, pending: 0, approved: 0, changes_requested: 0 });
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const data = await teamApi.getDashboard();
            setTools(data.tools);
            setStatusCounts(data.status_counts);
        } catch (error) {
            console.error('Failed to load dashboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (e: React.MouseEvent, id: number, name: string) => {
        e.stopPropagation();
        if (!confirm(`Are you sure you want to delete "${name}"?`)) return;
        try {
            await teamApi.deleteTool(id);
            setTools(tools.filter(t => t.id !== id));
        } catch (error) {
            console.error('Failed to delete:', error);
        }
    };

    const handleCardClick = (tool: Tool) => {
        if (tool.status === 'approved') {
            navigate(`/tools/${tool.id}`);
        } else if (tool.can_edit) {
            navigate(`/team/tools/${tool.id}/edit`);
        }
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, any> = {
            draft: { variant: 'secondary', icon: FileText, label: 'Draft' },
            pending: { variant: 'pending', icon: Clock, label: 'Pending' },
            approved: { variant: 'success', icon: Check, label: 'Approved' },
            changes_requested: { variant: 'warning', icon: AlertCircle, label: 'Changes Requested' },
        };
        const config = variants[status] || variants.draft;
        return (
            <Badge variant={config.variant} className="flex items-center gap-1">
                <config.icon className="h-3 w-3" />
                {config.label}
            </Badge>
        );
    };

    if (loading) {
        return (
            <TeamLayout title="My Tools">
                <LoadingState fullScreen message="Loading your tools..." />
            </TeamLayout>
        );
    }

    const statCards: StatCard[] = [
        { label: 'Approved', value: statusCounts.approved, icon: Check, color: 'text-green-600', bgColor: 'bg-green-100' },
        { label: 'Pending', value: statusCounts.pending, icon: Clock, color: 'text-amber-600', bgColor: 'bg-amber-100' },
        { label: 'Changes Requested', value: statusCounts.changes_requested, icon: AlertCircle, color: 'text-orange-600', bgColor: 'bg-orange-100' },
        { label: 'Drafts', value: statusCounts.draft, icon: FileText, color: 'text-gray-600', bgColor: 'bg-gray-100' },
    ];

    return (
        <TeamLayout title="My Tools">
            <div className="space-y-8">
                {/* Stats */}
                <StatsGrid stats={statCards} columns={4} />

                {/* Header */}
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold">Your Tools</h2>
                    <Link to="/team/tools/new">
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Upload New Tool
                        </Button>
                    </Link>
                </div>

                {/* Tools List */}
                {tools.length === 0 ? (
                    <Card>
                        <CardContent className="p-0">
                            <EmptyState
                                icon={FileText}
                                title="No Tools Yet"
                                description="Upload your first tool to share with the team."
                                action={{
                                    label: 'Upload Tool',
                                    icon: Plus,
                                    onClick: () => navigate('/team/tools/new')
                                }}
                            />
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4">
                        {tools.map((tool) => (
                            <Card
                                key={tool.id}
                                className="cursor-pointer transition-all hover:shadow-lg hover:border-[hsl(var(--primary))]/50"
                                onClick={() => handleCardClick(tool)}
                            >
                                <CardContent className="p-6">
                                    <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-3 mb-2">
                                                <h3 className="text-lg font-semibold truncate">{tool.name}</h3>
                                                {getStatusBadge(tool.status)}
                                                {tool.open_issue_count > 0 && (
                                                    <Badge variant="destructive" className="flex items-center gap-1">
                                                        <AlertTriangle className="h-3 w-3" />
                                                        {tool.open_issue_count} {tool.open_issue_count === 1 ? 'Issue' : 'Issues'}
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-[hsl(var(--muted-foreground))] text-sm line-clamp-2 mb-3">
                                                {tool.description}
                                            </p>
                                            {tool.admin_remarks && (
                                                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-800 mb-3">
                                                    <strong>Admin remarks:</strong> {tool.admin_remarks}
                                                </div>
                                            )}
                                            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-[hsl(var(--muted-foreground))]">
                                                <span>{tool.file_size_display}</span>
                                                {tool.department_names.length > 0 && (
                                                    <span>• {tool.department_names.join(', ')}</span>
                                                )}
                                                <span>• {new Date(tool.updated_at).toLocaleDateString()}</span>
                                                {tool.download_count > 0 && <span>• {tool.download_count} downloads</span>}
                                            </div>
                                        </div>
                                        <div className="flex gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                                            {tool.status === 'approved' && (
                                                <Link to={`/tools/${tool.id}`}>
                                                    <Button variant="outline" size="sm">
                                                        <Eye className="h-4 w-4 mr-1" />
                                                        View
                                                    </Button>
                                                </Link>
                                            )}
                                            {(tool.can_edit || tool.can_update_content) && (
                                                <Link to={`/team/tools/${tool.id}/edit`}>
                                                    <Button variant="outline" size="sm">
                                                        <Edit className="h-4 w-4 mr-1" />
                                                        Edit
                                                    </Button>
                                                </Link>
                                            )}
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-red-600 hover:bg-red-50"
                                                onClick={(e) => handleDelete(e, tool.id, tool.name)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </TeamLayout>
    );
}
