/**
 * Tool Filters Component
 * 
 * Reusable search and filter controls for tool lists.
 * Extracted from AllToolsList for SRP and reusability.
 */
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Search, X, ChevronDown } from 'lucide-react';
import type { Department } from '@/lib/api';

interface ToolFiltersProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
    statusFilter: string;
    onStatusChange: (status: string) => void;
    departmentFilter: string;
    onDepartmentChange: (dept: string) => void;
    departments: Department[];
    toolCount: number;
    totalCount: number;
    children?: React.ReactNode;
}

const STATUS_OPTIONS = [
    { value: 'all', label: 'All Statuses' },
    { value: 'approved', label: 'Approved' },
    { value: 'pending', label: 'Pending' },
    { value: 'changes_requested', label: 'Changes Requested' },
    { value: 'draft', label: 'Draft' },
];

export function ToolFilters({
    searchQuery,
    onSearchChange,
    statusFilter,
    onStatusChange,
    departmentFilter,
    onDepartmentChange,
    departments,
    toolCount,
    totalCount,
    children,
}: ToolFiltersProps) {
    const getStatusLabel = (value: string) => 
        STATUS_OPTIONS.find(s => s.value === value)?.label || 'All Statuses';

    const getDepartmentLabel = (value: string) => {
        if (value === 'all') return 'All Departments';
        return departments.find(d => d.id.toString() === value)?.name || 'Unknown';
    };

    return (
        <Card className="shadow-sm">
            <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search tools..."
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            className="pl-10 h-11"
                        />
                        {searchQuery && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => onSearchChange('')}
                                className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8"
                            >
                                <X className="h-4 w-4 text-muted-foreground" />
                            </Button>
                        )}
                    </div>

                    {/* Status Filter */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-full lg:w-40 h-11 justify-between">
                                {getStatusLabel(statusFilter)}
                                <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                            {STATUS_OPTIONS.map(({ value, label }) => (
                                <DropdownMenuItem key={value} onClick={() => onStatusChange(value)}>
                                    {label}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Department Filter */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-full lg:w-44 h-11 justify-between">
                                <span className="truncate">{getDepartmentLabel(departmentFilter)}</span>
                                <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 max-h-[300px] overflow-y-auto">
                            <DropdownMenuItem onClick={() => onDepartmentChange('all')}>
                                All Departments
                            </DropdownMenuItem>
                            {departments.map((dept) => (
                                <DropdownMenuItem key={dept.id} onClick={() => onDepartmentChange(dept.id.toString())}>
                                    {dept.name}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <div className="hidden lg:block h-8 w-px bg-border" />

                    <span className="text-sm text-muted-foreground whitespace-nowrap">
                        Showing {toolCount} of {totalCount} tools
                    </span>

                    {children}
                </div>
            </CardContent>
        </Card>
    );
}
