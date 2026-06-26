import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, User, Mail, Calendar, Clock } from 'lucide-react';
import type { ToolDetail as ToolDetailType } from '@/lib/api';

interface ToolSidebarProps {
    tool: ToolDetailType;
}

export function ToolSidebar({ tool }: ToolSidebarProps) {
    return (
        <div className="space-y-6">
            {/* File Info Card */}
            <Card>
                <CardHeader className="border-b border-[hsl(var(--border))]">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <FileText className="h-5 w-5 text-[hsl(var(--primary))]" />
                        File Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 p-4 bg-[hsl(var(--muted))]/50 rounded-xl">
                            <div className="h-12 w-12 rounded-xl bg-[hsl(var(--primary))]/10 flex items-center justify-center">
                                <FileText className="h-6 w-6 text-[hsl(var(--primary))]" />
                            </div>
                            <div>
                                <p className="font-medium">{tool.file_name}</p>
                                <p className="text-sm text-[hsl(var(--muted-foreground))]">{tool.file_size_display}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Author Info */}
            <Card>
                <CardHeader className="border-b border-[hsl(var(--border))]">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <User className="h-5 w-5 text-[hsl(var(--primary))]" />
                        Uploaded By
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-full bg-gradient-to-br from-[hsl(var(--primary))] to-indigo-600 flex items-center justify-center text-white text-xl font-semibold">
                            {tool.uploader_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <p className="font-semibold text-lg">{tool.uploader_name}</p>
                            <a
                                href={`mailto:${tool.uploader_email}?subject=Question about ${tool.name}`}
                                className="text-sm text-[hsl(var(--primary))] hover:underline flex items-center gap-1.5 mt-1"
                            >
                                <Mail className="h-4 w-4" />
                                Contact Developer
                            </a>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Metadata */}
            <Card>
                <CardHeader className="border-b border-[hsl(var(--border))]">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Clock className="h-5 w-5 text-[hsl(var(--primary))]" />
                        Details
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-[hsl(var(--muted-foreground))]">Last Updated</span>
                        <span className="font-medium flex items-center gap-1.5">
                            <Calendar className="h-4 w-4 text-[hsl(var(--primary))]" />
                            {new Date(tool.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-[hsl(var(--muted-foreground))]">Published</span>
                        <span className="font-medium">
                            {new Date(tool.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-[hsl(var(--muted-foreground))]">Total Downloads</span>
                        <span className="font-semibold text-[hsl(var(--primary))]">{tool.download_count}</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
