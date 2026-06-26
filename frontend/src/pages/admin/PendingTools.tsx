import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { adminApi, type Tool } from '@/lib/api';
import { PageHeader, LoadingState, EmptyState } from '@/components/shared';
import { Clock, Eye, FileText, Mail, Calendar, User, Package } from 'lucide-react';

export default function PendingTools() {
    const [tools, setTools] = useState<Tool[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTools();
    }, []);

    const loadTools = async () => {
        try {
            const data = await adminApi.getPendingTools();
            setTools(data);
        } catch (error) {
            console.error('Failed to load pending tools:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout title="Pending Reviews">
                <LoadingState message="Loading pending tools..." />
            </AdminLayout>
        );
    }

    return (
        <AdminLayout title="Pending Reviews">
            <PageHeader
                description={`${tools.length} tool${tools.length !== 1 ? 's' : ''} waiting for review`}
            />

            {tools.length === 0 ? (
                <EmptyState
                    icon={Clock}
                    title="No Pending Reviews"
                    description="All tools have been reviewed. Check back later for new submissions."
                />
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {tools.map((tool: any) => (
                        <Card key={tool.id} className="group hover:shadow-lg transition-all duration-200 hover:border-[hsl(var(--primary))]/30">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                                        <Package className="h-7 w-7 text-amber-600" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="text-lg font-semibold truncate group-hover:text-[hsl(var(--primary))] transition-colors">
                                                {tool.name}
                                            </h3>
                                            <Badge variant="pending" className="flex-shrink-0">Pending</Badge>
                                        </div>
                                        <p className="text-[hsl(var(--muted-foreground))] text-sm line-clamp-2 mb-4">
                                            {tool.description}
                                        </p>

                                        <div className="space-y-2 mb-4">
                                            <div className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
                                                <User className="h-4 w-4 text-[hsl(var(--primary))]" />
                                                <span>Uploaded by <strong>{tool.uploader_name}</strong></span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
                                                <FileText className="h-4 w-4 text-[hsl(var(--primary))]" />
                                                <span className="truncate">{tool.file_name}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))]">
                                                <Calendar className="h-4 w-4 text-[hsl(var(--primary))]" />
                                                <span>{new Date(tool.created_at).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}</span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 pt-4 border-t border-[hsl(var(--border))]">
                                            <Link to={`/admin/tools/${tool.id}/review`} className="flex-1">
                                                <Button className="w-full">
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    Review Tool
                                                </Button>
                                            </Link>
                                            <a
                                                href={`mailto:${tool.uploader_email}?subject=Regarding your tool: ${tool.name}`}
                                                className="inline-flex items-center justify-center h-10 w-10 rounded-lg border border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))] transition-colors"
                                                title="Contact uploader"
                                            >
                                                <Mail className="h-4 w-4" />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </AdminLayout>
    );
}
