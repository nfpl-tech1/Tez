import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { TeamLayout } from '@/components/layout/TeamLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageHeader, LoadingState, EmptyState } from '@/components/shared';
import { AlertMessage } from '@/components/ui/alert';
import { teamApi, type Issue } from '@/lib/api';
import {
    AlertTriangle, CheckCircle, Mail, Calendar,
    User, Package, ExternalLink, MessageSquare
} from 'lucide-react';

export default function Issues() {
    const [issues, setIssues] = useState<Issue[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [resolving, setResolving] = useState<number | null>(null);

    useEffect(() => {
        loadIssues();
    }, []);

    const loadIssues = async () => {
        try {
            const data = await teamApi.getIssues();
            setIssues(data);
        } catch (err) {
            setError('Failed to load issues');
        } finally {
            setLoading(false);
        }
    };

    const handleResolve = async (issueId: number) => {
        setResolving(issueId);
        setError('');
        try {
            await teamApi.resolveIssue(issueId);
            setIssues(issues.map(i =>
                i.id === issueId ? { ...i, is_resolved: true, status_display: 'Resolved' } : i
            ));
            setSuccess('Issue marked as resolved');
            setTimeout(() => setSuccess(''), 3000);
        } catch (err) {
            setError('Failed to resolve issue');
        } finally {
            setResolving(null);
        }
    };

    if (loading) {
        return (
            <TeamLayout title="Issues">
                <LoadingState fullScreen message="Loading issues..." />
            </TeamLayout>
        );
    }

    const openIssues = issues.filter(i => !i.is_resolved);
    const resolvedIssues = issues.filter(i => i.is_resolved);

    return (
        <TeamLayout title="Issues">
            <PageHeader
                description={`${openIssues.length} open issue${openIssues.length !== 1 ? 's' : ''} reported on your tools`}
            />

            {error && <AlertMessage variant="destructive" message={error} onDismiss={() => setError('')} />}
            {success && <AlertMessage variant="success" message={success} onDismiss={() => setSuccess('')} />}

            {issues.length === 0 ? (
                <EmptyState
                    icon={MessageSquare}
                    title="No Issues Reported"
                    description="Great news! No issues have been reported on your tools yet."
                />
            ) : (
                <div className="space-y-8">
                    {/* Open Issues */}
                    {openIssues.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-amber-500" />
                                Open Issues ({openIssues.length})
                            </h3>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {openIssues.map((issue) => (
                                    <Card key={issue.id} className="border-amber-200 bg-gradient-to-br from-amber-50/50 to-orange-50/50">
                                        <CardHeader className="pb-3">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                                                        <Package className="h-5 w-5 text-amber-600" />
                                                    </div>
                                                    <div>
                                                        <CardTitle className="text-base">{issue.tool_name}</CardTitle>
                                                        <p className="text-sm text-[hsl(var(--muted-foreground))]">
                                                            Reported {new Date(issue.created_at).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Badge variant="pending" className="flex-shrink-0">Open</Badge>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            {/* Reporter Info */}
                                            <div className="flex items-center gap-4 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <User className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
                                                    <span className="font-medium">{issue.reporter_name}</span>
                                                </div>
                                                <a
                                                    href={`mailto:${issue.reporter_email}`}
                                                    className="flex items-center gap-1 text-[hsl(var(--primary))] hover:underline"
                                                >
                                                    <Mail className="h-4 w-4" />
                                                    {issue.reporter_email}
                                                </a>
                                            </div>

                                            {/* Issue Description */}
                                            <div className="p-4 bg-white rounded-lg border border-amber-200">
                                                <p className="text-sm whitespace-pre-wrap">{issue.description}</p>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-2 pt-2">
                                                <Button
                                                    onClick={() => handleResolve(issue.id)}
                                                    disabled={resolving === issue.id}
                                                    size="sm"
                                                >
                                                    {resolving === issue.id ? (
                                                        <span className="flex items-center">
                                                            <span className="h-4 w-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                            Resolving...
                                                        </span>
                                                    ) : (
                                                        <>
                                                            <CheckCircle className="h-4 w-4 mr-2" />
                                                            Mark Resolved
                                                        </>
                                                    )}
                                                </Button>
                                                <Link to={`/team/tools/${issue.tool_id}/edit`}>
                                                    <Button variant="outline" size="sm">
                                                        <ExternalLink className="h-4 w-4 mr-2" />
                                                        View Tool
                                                    </Button>
                                                </Link>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Resolved Issues */}
                    {resolvedIssues.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold flex items-center gap-2 text-[hsl(var(--muted-foreground))]">
                                <CheckCircle className="h-5 w-5 text-green-500" />
                                Resolved Issues ({resolvedIssues.length})
                            </h3>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {resolvedIssues.map((issue) => (
                                    <Card key={issue.id} className="bg-[hsl(var(--muted))]/30 border-[hsl(var(--border))]">
                                        <CardContent className="p-4">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                                                        <CheckCircle className="h-5 w-5 text-green-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{issue.tool_name}</p>
                                                        <p className="text-sm text-[hsl(var(--muted-foreground))]">
                                                            Reported by {issue.reporter_name}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Badge variant="success" className="flex-shrink-0">Resolved</Badge>
                                            </div>
                                            <p className="text-sm text-[hsl(var(--muted-foreground))] mt-3 line-clamp-2">
                                                {issue.description}
                                            </p>
                                            {issue.resolved_at && (
                                                <p className="text-xs text-[hsl(var(--muted-foreground))] mt-2 flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    Resolved on {new Date(issue.resolved_at).toLocaleDateString()}
                                                </p>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </TeamLayout>
    );
}
