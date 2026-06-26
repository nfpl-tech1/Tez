/**
 * Tool Info Cards
 * 
 * Reusable sidebar info cards for tool pages.
 * Extracted from EditTool, ReviewTool for DRY principle.
 */
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, FileText, Download, User, Mail, Calendar, FolderOpen } from 'lucide-react';

interface FileInfoCardProps {
    fileName: string;
    fileSizeDisplay: string;
    readOnly?: boolean;
}

export function FileInfoCard({ fileName, fileSizeDisplay, readOnly = true }: FileInfoCardProps) {
    return (
        <Card>
            <CardHeader className="border-b border-[hsl(var(--border))]">
                <CardTitle className="text-lg flex items-center gap-2">
                    <Package className="h-5 w-5 text-[hsl(var(--primary))]" />
                    Executable File
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <div className="flex items-center gap-4 p-4 bg-[hsl(var(--muted))] rounded-xl">
                    <div className="h-14 w-14 rounded-xl bg-[hsl(var(--primary))]/10 flex items-center justify-center flex-shrink-0">
                        <FileText className="h-7 w-7 text-[hsl(var(--primary))]" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">{fileName}</p>
                        <p className="text-sm text-[hsl(var(--muted-foreground))]">{fileSizeDisplay}</p>
                    </div>
                </div>
                {readOnly && (
                    <p className="text-xs text-[hsl(var(--muted-foreground))] mt-3 flex items-center gap-1">
                        <Package className="h-3 w-3" />
                        Executable files cannot be changed after upload
                    </p>
                )}
            </CardContent>
        </Card>
    );
}

interface StatsCardProps {
    downloadCount: number;
}

export function StatsCard({ downloadCount }: StatsCardProps) {
    return (
        <Card>
            <CardHeader className="border-b border-[hsl(var(--border))]">
                <CardTitle className="text-lg flex items-center gap-2">
                    <Download className="h-5 w-5 text-[hsl(var(--primary))]" />
                    Statistics
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
                    <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center">
                        <Download className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-green-600">{downloadCount}</p>
                        <p className="text-sm text-[hsl(var(--muted-foreground))]">Total Downloads</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

interface UploaderCardProps {
    name: string;
    email?: string;
    toolName?: string;
}

export function UploaderCard({ name, email, toolName }: UploaderCardProps) {
    const initial = name?.charAt(0).toUpperCase() || '?';
    const mailSubject = toolName ? `?subject=Regarding your tool: ${toolName}` : '';

    return (
        <Card>
            <CardHeader className="border-b border-[hsl(var(--border))]">
                <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5 text-[hsl(var(--primary))]" />
                    Uploaded By
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
                <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-full bg-gradient-to-br from-[hsl(var(--primary))] to-indigo-600 flex items-center justify-center text-white text-xl font-semibold flex-shrink-0">
                        {initial}
                    </div>
                    <div className="min-w-0">
                        <p className="font-semibold text-lg truncate">{name}</p>
                        {email && (
                            <a
                                href={`mailto:${email}${mailSubject}`}
                                className="text-sm text-[hsl(var(--primary))] hover:underline flex items-center gap-1"
                            >
                                <Mail className="h-4 w-4 flex-shrink-0" />
                                <span className="truncate">{email}</span>
                            </a>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

interface TimelineCardProps {
    createdAt?: string;
    updatedAt?: string;
}

export function TimelineCard({ createdAt, updatedAt }: TimelineCardProps) {
    const formatDate = (date?: string) => {
        if (!date) return null;
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <Card>
            <CardHeader className="border-b border-[hsl(var(--border))]">
                <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-[hsl(var(--primary))]" />
                    Timeline
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
                {createdAt && (
                    <div>
                        <p className="text-sm text-[hsl(var(--muted-foreground))] mb-1">Created</p>
                        <p className="font-medium">{formatDate(createdAt)}</p>
                    </div>
                )}
                {updatedAt && (
                    <div>
                        <p className="text-sm text-[hsl(var(--muted-foreground))] mb-1">Last Updated</p>
                        <p className="font-medium">{formatDate(updatedAt)}</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

interface DepartmentBadgesProps {
    departments: string[];
}

export function DepartmentBadges({ departments }: DepartmentBadgesProps) {
    if (!departments || departments.length === 0) return null;

    return (
        <div>
            <p className="text-sm text-[hsl(var(--muted-foreground))] mb-2">Departments</p>
            <div className="flex flex-wrap gap-2">
                {departments.map((dept, idx) => (
                    <Badge key={idx} variant="secondary" className="flex items-center gap-1">
                        <FolderOpen className="h-3 w-3" />
                        {dept}
                    </Badge>
                ))}
            </div>
        </div>
    );
}
