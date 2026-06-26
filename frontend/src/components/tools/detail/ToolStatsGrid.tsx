import { Card, CardContent } from '@/components/ui/card';
import { Download, FileText, Calendar } from 'lucide-react';
import type { ToolDetail as ToolDetailType } from '@/lib/api';

interface ToolStatsGridProps {
    tool: ToolDetailType;
}

export function ToolStatsGrid({ tool }: ToolStatsGridProps) {
    const stats = [
        { icon: Download, label: 'Downloads', value: tool.download_count },
        { icon: FileText, label: 'File Size', value: tool.file_size_display },
        { icon: Calendar, label: 'Updated', value: new Date(tool.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) },
    ];

    return (
        <div className="grid grid-cols-3 gap-4">
            {stats.map((stat, idx) => (
                <Card key={idx}>
                    <CardContent className="p-4 text-center">
                        <stat.icon className="h-5 w-5 mx-auto mb-2 text-[hsl(var(--primary))]" />
                        <p className="font-semibold">{stat.value}</p>
                        <p className="text-xs text-[hsl(var(--muted-foreground))]">{stat.label}</p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
