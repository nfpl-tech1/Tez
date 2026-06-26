/**
 * Tool Header Card
 * 
 * Reusable gradient header card for tool pages.
 */
import { Card } from '@/components/ui/card';
import { ToolStatusBadge } from '@/components/tools';
import type { LucideIcon } from 'lucide-react';

interface ToolHeaderCardProps {
    title: string;
    description: string;
    icon: LucideIcon;
    status?: string;
    statusBadge?: React.ReactNode;
    gradient?: 'primary' | 'amber' | 'green';
    children?: React.ReactNode;
}

const gradientClasses = {
    primary: 'from-[hsl(var(--primary))] to-indigo-600',
    amber: 'from-amber-500 to-orange-500',
    green: 'from-green-500 to-emerald-600',
};

export function ToolHeaderCard({
    title,
    description,
    icon: Icon,
    status,
    statusBadge,
    gradient = 'primary',
    children,
}: ToolHeaderCardProps) {
    return (
        <Card className="mb-6 overflow-hidden">
            <div className={`bg-gradient-to-r ${gradientClasses[gradient]} p-6 text-white`}>
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                    <div className="h-20 w-20 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center flex-shrink-0">
                        <Icon className="h-10 w-10" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className="text-2xl lg:text-3xl font-bold">{title}</h1>
                            {status && <ToolStatusBadge status={status} />}
                            {statusBadge}
                        </div>
                        <p className="text-white/90 max-w-2xl">{description}</p>
                    </div>
                </div>
            </div>
            {children}
        </Card>
    );
}
