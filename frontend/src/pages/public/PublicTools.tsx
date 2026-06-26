/**
 * Public Tools Page
 * 
 * Modern redesign with search in header and better space utilization.
 */
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Badge } from '@/components/ui/badge';
import { publicApi, type Department } from '@/lib/api';
import { LoadingState, EmptyState } from '@/components/shared';
import { PublicToolCard } from '@/components/tools';
import { Package, Sparkles } from 'lucide-react';
import { APP_NAME } from '@/components/ui/Logo';

export default function PublicTools() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [tools, setTools] = useState<any[]>([]);
    const [allTools, setAllTools] = useState<any[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedDept, setSelectedDept] = useState<number | null>(
        searchParams.get('department') ? Number(searchParams.get('department')) : null
    );

    useEffect(() => {
        loadTools();
    }, [searchParams]);

    const loadTools = async () => {
        setLoading(true);
        try {
            const q = searchParams.get('q') || undefined;
            const dept = searchParams.get('department') ? Number(searchParams.get('department')) : undefined;
            const data = await publicApi.getTools(q, dept);
            setTools(data.tools);
            setDepartments(data.departments);
            // Load all tools for autocomplete if not already loaded
            if (allTools.length === 0) {
                const allData = await publicApi.getTools();
                setAllTools(allData.tools);
            }
        } catch (error) {
            console.error('Failed to load tools:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (query: string) => {
        const params = new URLSearchParams(searchParams);
        if (query) params.set('q', query);
        else params.delete('q');
        setSearchParams(params);
    };

    const handleDeptFilter = (deptId: number | null) => {
        setSelectedDept(deptId);
        const params = new URLSearchParams(searchParams);
        if (deptId) params.set('department', deptId.toString());
        else params.delete('department');
        setSearchParams(params);
    };

    const clearFilters = () => {
        setSelectedDept(null);
        setSearchParams(new URLSearchParams());
    };

    const currentQuery = searchParams.get('q') || '';
    const totalDownloads = allTools.reduce((sum, t) => sum + (t.download_count || 0), 0);

    return (
        <PublicLayout>
            {/* Compact Hero Section */}
            <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white overflow-hidden">
                {/* Subtle background pattern */}
                <div className="absolute inset-0">
                    <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-white/5 to-transparent rounded-full -translate-y-1/2 translate-x-1/4" />
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-white/5 to-transparent rounded-full translate-y-1/2 -translate-x-1/4" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        {/* Left: Title */}
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 rounded-full text-sm mb-3 backdrop-blur-sm">
                                <Sparkles className="h-3.5 w-3.5" />
                                <span className="text-blue-100">Discover tools built by our team</span>
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                                Developer {APP_NAME}
                            </h1>
                            <p className="text-blue-100 mt-2 text-lg max-w-lg">
                                Browse, search, and download tools to boost your productivity
                            </p>
                        </div>

                        {/* Right: Stats */}
                        <div className="flex items-center gap-6 lg:gap-8">
                            <StatItem value={allTools.length} label="Tools" />
                            <div className="w-px h-10 bg-white/20" />
                            <StatItem value={departments.length} label="Departments" />
                            <div className="w-px h-10 bg-white/20" />
                            <StatItem value={totalDownloads} label="Downloads" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Department Pills */}
            <section className="bg-white border-b sticky top-0 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2 py-3 overflow-x-auto scrollbar-hide">
                        <button
                            onClick={() => handleDeptFilter(null)}
                            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all ${!selectedDept
                                    ? 'bg-[hsl(var(--primary))] text-white shadow-md'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            All Tools
                        </button>
                        {departments.map((dept) => (
                            <button
                                key={dept.id}
                                onClick={() => handleDeptFilter(dept.id)}
                                className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all inline-flex items-center gap-2 ${selectedDept === dept.id
                                        ? 'bg-[hsl(var(--primary))] text-white shadow-md'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {dept.name}
                                {(dept.tool_count ?? 0) > 0 && (
                                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${selectedDept === dept.id ? 'bg-white/20' : 'bg-gray-200'
                                        }`}>
                                        {dept.tool_count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Tools Grid - Full Width */}
            <section className="py-8 bg-[hsl(var(--muted))]/30 min-h-[60vh]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl font-semibold">
                                {selectedDept ? departments.find(d => d.id === selectedDept)?.name : 'All Tools'}
                            </h2>
                            {currentQuery && (
                                <Badge variant="secondary" className="gap-1">
                                    Search: "{currentQuery}"
                                    <button onClick={() => handleSearch('')} className="ml-1 hover:text-red-500">×</button>
                                </Badge>
                            )}
                        </div>
                        <span className="text-sm text-[hsl(var(--muted-foreground))]">
                            {tools.length} result{tools.length !== 1 ? 's' : ''}
                        </span>
                    </div>

                    {/* Content */}
                    {loading ? (
                        <LoadingState message="Loading tools..." />
                    ) : tools.length === 0 ? (
                        <EmptyState
                            icon={Package}
                            title="No Tools Found"
                            description={currentQuery || selectedDept ? 'Try adjusting your search or filters' : 'No tools have been published yet'}
                            action={(currentQuery || selectedDept) ? { label: 'Clear Filters', onClick: clearFilters } : undefined}
                        />
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                            {tools.map((tool) => (
                                <PublicToolCard key={tool.id} tool={tool} />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </PublicLayout>
    );
}

// Stat Item Component - Clean minimal design
function StatItem({ value, label }: { value: number; label: string }) {
    return (
        <div className="text-center">
            <div className="text-3xl lg:text-4xl font-bold tracking-tight">{value}</div>
            <div className="text-sm text-blue-200 font-medium">{label}</div>
        </div>
    );
}
