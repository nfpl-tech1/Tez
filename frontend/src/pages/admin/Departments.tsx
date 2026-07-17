import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { adminApi, publicApi, teamApi, type Department } from '@/lib/api';
import type { Subcategory } from '@/lib/types';
import { PageHeader, LoadingState, EmptyState } from '@/components/shared';
import { AlertMessage } from '@/components/ui/alert';
import { Plus, FolderOpen, Loader2, X, Check, Pencil } from 'lucide-react';
import { toast } from 'sonner';

interface AddSubcategoryInlineProps {
    departmentId: number;
    onCreate: (name: string, departmentId: number) => Promise<void>;
}

function AddSubcategoryInline({ departmentId, onCreate }: AddSubcategoryInlineProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [name, setName] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSave = async () => {
        if (!name.trim()) return;
        setSubmitting(true);
        try {
            await onCreate(name.trim(), departmentId);
            setName('');
            setIsAdding(false);
        } catch (err) {
            console.error('Failed to add subcategory:', err);
        } finally {
            setSubmitting(false);
        }
    };

    if (!isAdding) {
        return (
            <button
                type="button"
                onClick={() => setIsAdding(true)}
                className="px-2.5 py-1 rounded-full text-xs font-medium border border-dashed border-[hsl(var(--primary))]/50 text-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/10 transition-colors cursor-pointer flex items-center gap-0.5"
            >
                <Plus className="h-3 w-3" />
                Add new
            </button>
        );
    }

    return (
        <div className="flex items-center gap-1">
            <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSave();
                    } else if (e.key === 'Escape') {
                        setIsAdding(false);
                    }
                }}
                disabled={submitting}
                placeholder="New subcategory..."
                className="h-7 text-xs px-2 py-0.5 w-32 animate-in fade-in zoom-in-95 duration-100"
                autoFocus
            />
            <Button
                type="button"
                size="sm"
                onClick={handleSave}
                disabled={submitting || !name.trim()}
                className="h-7 px-2 flex items-center justify-center bg-[hsl(var(--primary))] text-white hover:opacity-90 disabled:opacity-50 text-xs"
            >
                {submitting ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                    <Check className="h-3 w-3" />
                )}
            </Button>
            <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsAdding(false)}
                disabled={submitting}
                className="h-7 px-2 flex items-center justify-center border border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))] text-xs"
            >
                <X className="h-3 w-3" />
            </Button>
        </div>
    );
}

export default function Departments() {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({ name: '', description: '' });

    const [editingDeptId, setEditingDeptId] = useState<number | null>(null);
    const [editingDeptName, setEditingDeptName] = useState('');
    const [editingSubId, setEditingSubId] = useState<number | null>(null);
    const [editingSubName, setEditingSubName] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [deptsData, subsData] = await Promise.all([
                adminApi.getDepartments(),
                publicApi.getSubcategories()
            ]);
            setDepartments(deptsData);
            setSubcategories(subsData);
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadSubcategories = async () => {
        try {
            const subsData = await publicApi.getSubcategories();
            setSubcategories(subsData);
        } catch (error) {
            console.error('Failed to reload subcategories:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setSubmitting(true);

        try {
            await adminApi.createDepartment(formData);
            toast.success('Department created successfully', { duration: 7000 });
            setFormData({ name: '', description: '' });
            setShowForm(false);
            loadData();
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to create department');
        } finally {
            setSubmitting(false);
        }
    };

    const handleCreateSubcategory = async (name: string, departmentId: number) => {
        try {
            setError('');
            await teamApi.createSubcategory({ name, department_id: departmentId });
            loadSubcategories();
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to create subcategory');
        }
    };

    const handleDeleteSubcategory = async (id: number) => {
        if (!confirm('Are you sure you want to delete this subcategory?')) return;
        try {
            setError('');
            await adminApi.deleteSubcategory(id);
            loadSubcategories();
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to delete subcategory');
        }
    };

    const handleSaveDeptName = async (id: number) => {
        if (!editingDeptName.trim()) return;
        try {
            setError('');
            const currentDept = departments.find(d => d.id === id);
            await adminApi.updateDepartment(id, { 
                name: editingDeptName.trim(), 
                description: currentDept?.description ?? undefined 
            });
            setEditingDeptId(null);
            loadData();
            toast.success('Department updated successfully');
        } catch (err: any) {
            toast.error(err.response?.data?.detail || 'Failed to update department');
        }
    };

    const handleSaveSubName = async (id: number) => {
        if (!editingSubName.trim()) return;
        try {
            setError('');
            await adminApi.updateSubcategory(id, { name: editingSubName.trim() });
            setEditingSubId(null);
            loadSubcategories();
            toast.success('Subcategory updated successfully');
        } catch (err: any) {
            toast.error(err.response?.data?.detail || 'Failed to update subcategory');
        }
    };

    if (loading) {
        return (
            <AdminLayout title="Departments">
                <LoadingState message="Loading departments..." />
            </AdminLayout>
        );
    }

    return (
        <AdminLayout title="Departments">
            <PageHeader
                description={`${departments.length} department${departments.length !== 1 ? 's' : ''} for organizing tools`}
            >
                <Button onClick={() => setShowForm(!showForm)} size="lg">
                    {showForm ? (
                        <>
                            <X className="h-5 w-5 mr-2" />
                            Cancel
                        </>
                    ) : (
                        <>
                            <Plus className="h-5 w-5 mr-2" />
                            Add Department
                        </>
                    )}
                </Button>
            </PageHeader>

            {error && <AlertMessage variant="destructive" message={error} onDismiss={() => setError('')} />}
            {success && <AlertMessage variant="success" message={success} onDismiss={() => setSuccess('')} />}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Add Department Form */}
                {showForm && (
                    <Card className="lg:col-span-1 border-2 border-dashed border-[hsl(var(--primary))]/30 bg-[hsl(var(--primary))]/5">
                        <CardContent className="p-6">
                            <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                                <Plus className="h-5 w-5 text-[hsl(var(--primary))]" />
                                New Department
                            </h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Department Name *</Label>
                                    <Input
                                        id="name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g., Development Tools"
                                        required
                                        className="h-12"
                                        autoFocus
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Brief description of the department"
                                        rows={3}
                                    />
                                </div>
                                <Button type="submit" disabled={submitting} className="w-full h-12">
                                    {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                                    Create Department
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                )}

                {/* Department Row List */}
                {departments.length === 0 && !showForm ? (
                    <div className="lg:col-span-3">
                        <EmptyState
                            icon={FolderOpen}
                            title="No Departments Yet"
                            description="Create your first department to organize tools"
                            action={{
                                label: 'Add Department',
                                onClick: () => setShowForm(true),
                                icon: Plus
                            }}
                        />
                    </div>
                ) : (
                    <div className={showForm ? "lg:col-span-2" : "lg:col-span-3"}>
                        <Card>
                            <CardContent className="p-6 divide-y divide-[hsl(var(--border))]">
                                {departments.map((dept) => {
                                    const deptSubcategories = subcategories.filter(
                                        (sub) => sub.department_id === dept.id
                                    );
                                    return (
                                        <div
                                            key={dept.id}
                                            className="grid grid-cols-1 md:grid-cols-4 gap-4 py-4 first:pt-0 last:pb-0 items-start"
                                        >
                                            {/* Department Info */}
                                            <div className="md:col-span-1 space-y-1">
                                                {editingDeptId === dept.id ? (
                                                    <Input
                                                        value={editingDeptName}
                                                        onChange={(e) => setEditingDeptName(e.target.value)}
                                                        onKeyDown={(e) => {
                                                            if (e.key === 'Enter') {
                                                                e.preventDefault();
                                                                handleSaveDeptName(dept.id);
                                                            } else if (e.key === 'Escape') {
                                                                setEditingDeptId(null);
                                                            }
                                                        }}
                                                        onBlur={() => handleSaveDeptName(dept.id)}
                                                        className="h-8 py-0.5 text-sm font-bold w-full"
                                                        autoFocus
                                                    />
                                                ) : (
                                                    <h3
                                                        onDoubleClick={() => {
                                                            setEditingDeptId(dept.id);
                                                            setEditingDeptName(dept.name);
                                                        }}
                                                        className="font-bold text-lg flex items-center gap-1.5 text-[hsl(var(--foreground))] cursor-pointer select-none"
                                                        title="Double click to rename"
                                                    >
                                                        <FolderOpen className="h-4 w-4 text-[hsl(var(--primary))]" />
                                                        {dept.name}
                                                    </h3>
                                                )}
                                                {dept.description && (
                                                    <p className="text-xs text-[hsl(var(--muted-foreground))]">
                                                        {dept.description}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Subcategories */}
                                            <div className="md:col-span-3 flex flex-wrap items-center gap-1.5 min-h-[36px]">
                                                {deptSubcategories.map((sub) => (
                                                    <div key={sub.id} className="relative">
                                                        {editingSubId === sub.id ? (
                                                            <div className="flex items-center gap-1">
                                                                <Input
                                                                    value={editingSubName}
                                                                    onChange={(e) => setEditingSubName(e.target.value)}
                                                                    onKeyDown={(e) => {
                                                                        if (e.key === 'Enter') {
                                                                            e.preventDefault();
                                                                            handleSaveSubName(sub.id);
                                                                        } else if (e.key === 'Escape') {
                                                                            setEditingSubId(null);
                                                                        }
                                                                    }}
                                                                    onBlur={() => handleSaveSubName(sub.id)}
                                                                    className="h-7 text-xs px-2 py-0.5 w-28"
                                                                    autoFocus
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleSaveSubName(sub.id)}
                                                                    className="h-6 w-6 rounded flex items-center justify-center bg-[hsl(var(--primary))] text-white hover:opacity-90"
                                                                >
                                                                    <Check className="h-3 w-3" />
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setEditingSubId(null)}
                                                                    className="h-6 w-6 rounded flex items-center justify-center border border-[hsl(var(--border))] hover:bg-[hsl(var(--muted))]"
                                                                >
                                                                    <X className="h-3 w-3" />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <div
                                                                className="px-2.5 py-1 rounded-full text-xs font-medium border border-[hsl(var(--border))] bg-white text-[hsl(var(--foreground))] flex items-center gap-1 transition-all duration-200"
                                                            >
                                                                {sub.name}
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setEditingSubId(sub.id);
                                                                        setEditingSubName(sub.name);
                                                                    }}
                                                                    className="p-0.5 hover:bg-[hsl(var(--muted))] rounded text-[hsl(var(--muted-foreground))] hover:text-foreground cursor-pointer flex items-center ml-1"
                                                                    title="Rename Subcategory"
                                                                >
                                                                    <Pencil className="h-3 w-3" />
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleDeleteSubcategory(sub.id)}
                                                                    className="p-0.5 hover:bg-destructive/15 rounded text-destructive cursor-pointer flex items-center"
                                                                    title="Delete Subcategory"
                                                                >
                                                                    <X className="h-3 w-3" />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}

                                                <AddSubcategoryInline
                                                    departmentId={dept.id}
                                                    onCreate={handleCreateSubcategory}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
