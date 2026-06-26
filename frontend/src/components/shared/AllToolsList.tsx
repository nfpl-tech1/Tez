/**
 * All Tools List Component
 * 
 * Shared component for displaying tool lists with filtering.
 * Used by both admin and team member views.
 */
import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LoadingState, EmptyState } from '@/components/shared';
import { ToolFilters } from './ToolFilters';
import { ToolCard, type ToolCardData } from '@/components/tools';
import { useAuth } from '@/contexts/AuthContext';
import { adminApi, teamApi, type Department } from '@/lib/api';
import { ROUTES } from '@/lib/constants';
import { Plus, Package } from 'lucide-react';

interface AllToolsListProps {
    Layout: React.ComponentType<{ title: string; children: React.ReactNode }>;
}

export default function AllToolsList({ Layout }: AllToolsListProps) {
    const { isAdmin } = useAuth();
    const navigate = useNavigate();
    const [tools, setTools] = useState<ToolCardData[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [departmentFilter, setDepartmentFilter] = useState('all');

    useEffect(() => {
        loadData();
    }, [isAdmin]);

    const loadData = async () => {
        try {
            if (isAdmin) {
                const [toolsData, deptsData] = await Promise.all([
                    adminApi.getAllTools(),
                    adminApi.getDepartments(),
                ]);
                setTools(toolsData);
                setDepartments(deptsData);
            } else {
                const [dashboardData, deptsData] = await Promise.all([
                    teamApi.getDashboard(),
                    teamApi.getDepartments()
                ]);
                setTools(dashboardData.tools);
                setDepartments(deptsData);
            }
        } catch (error) {
            console.error('Failed to load tools:', error);
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

    const filteredTools = useMemo(() => {
        return tools.filter(tool => {
            const matchesSearch = !searchQuery.trim() ||
                tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                tool.description.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesStatus = statusFilter === 'all' || tool.status === statusFilter;

            let matchesDepartment = departmentFilter === 'all';
            if (!matchesDepartment) {
                if (tool.department_ids) {
                    matchesDepartment = tool.department_ids.includes(Number(departmentFilter));
                } else if (tool.department_names) {
                    const deptName = departments.find(d => d.id === Number(departmentFilter))?.name;
                    matchesDepartment = tool.department_names.includes(deptName || '');
                }
            }

            return matchesSearch && matchesStatus && matchesDepartment;
        });
    }, [tools, searchQuery, statusFilter, departmentFilter, departments]);

    const clearFilters = () => {
        setSearchQuery('');
        setStatusFilter('all');
        setDepartmentFilter('all');
    };

    const hasActiveFilters = searchQuery || statusFilter !== 'all' || departmentFilter !== 'all';
    const uploadPath = isAdmin ? ROUTES.ADMIN.TOOLS : ROUTES.TEAM.TOOL_NEW;

    if (loading) {
        return (
            <Layout title="All Tools">
                <LoadingState message="Loading tools..." />
            </Layout>
        );
    }

    return (
        <Layout title="All Tools">
            <div className="space-y-6">
                <ToolFilters
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    statusFilter={statusFilter}
                    onStatusChange={setStatusFilter}
                    departmentFilter={departmentFilter}
                    onDepartmentChange={setDepartmentFilter}
                    departments={departments}
                    toolCount={filteredTools.length}
                    totalCount={tools.length}
                >
                    {!isAdmin && (
                        <Link to={uploadPath}>
                            <Button className="w-full lg:w-auto whitespace-nowrap">
                                <Plus className="h-4 w-4 mr-2" />
                                Upload New Tool
                            </Button>
                        </Link>
                    )}
                </ToolFilters>

                {filteredTools.length === 0 ? (
                    <EmptyState
                        icon={Package}
                        title="No Tools Found"
                        description={hasActiveFilters ? 'Try adjusting your filters' : 'No tools in the repository yet'}
                        action={
                            hasActiveFilters
                                ? { label: 'Clear Filters', onClick: clearFilters }
                                : !isAdmin
                                    ? { label: 'Upload Tool', icon: Plus, onClick: () => navigate(uploadPath) }
                                    : undefined
                        }
                    />
                ) : (
                    <div className="space-y-4">
                        {filteredTools.map((tool) => (
                            <ToolCard key={tool.id} tool={tool} isAdmin={isAdmin} onDelete={handleDelete} />
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
}
