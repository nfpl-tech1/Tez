import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { adminApi, type Department } from '@/lib/api';
import { PageHeader, LoadingState, EmptyState } from '@/components/shared';
import { AlertMessage } from '@/components/ui/alert';
import { Plus, FolderOpen, Loader2, X, Hash } from 'lucide-react';

export default function Departments() {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({ name: '', description: '' });

    useEffect(() => {
        loadDepartments();
    }, []);

    const loadDepartments = async () => {
        try {
            const data = await adminApi.getDepartments();
            setDepartments(data);
        } catch (error) {
            console.error('Failed to load departments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setSubmitting(true);

        try {
            await adminApi.createDepartment(formData);
            setSuccess('Department created successfully');
            setFormData({ name: '', description: '' });
            setShowForm(false);
            loadDepartments();
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to create department');
        } finally {
            setSubmitting(false);
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

                {/* Department Grid */}
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
                    departments.map((dept, index) => (
                        <Card
                            key={dept.id}
                            className="group hover:shadow-lg transition-all duration-200 hover:border-[hsl(var(--primary))]/30"
                        >
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className={`h-14 w-14 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform ${index % 4 === 0 ? 'bg-gradient-to-br from-blue-500/20 to-indigo-500/20' :
                                        index % 4 === 1 ? 'bg-gradient-to-br from-emerald-500/20 to-teal-500/20' :
                                            index % 4 === 2 ? 'bg-gradient-to-br from-amber-500/20 to-orange-500/20' :
                                                'bg-gradient-to-br from-purple-500/20 to-pink-500/20'
                                        }`}>
                                        <FolderOpen className={`h-7 w-7 ${index % 4 === 0 ? 'text-blue-600' :
                                            index % 4 === 1 ? 'text-emerald-600' :
                                                index % 4 === 2 ? 'text-amber-600' :
                                                    'text-purple-600'
                                            }`} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-lg group-hover:text-[hsl(var(--primary))] transition-colors">
                                            {dept.name}
                                        </h3>
                                        {dept.description ? (
                                            <p className="text-sm text-[hsl(var(--muted-foreground))] mt-2 line-clamp-2">
                                                {dept.description}
                                            </p>
                                        ) : (
                                            <p className="text-sm text-[hsl(var(--muted-foreground))]/50 mt-2 italic">
                                                No description
                                            </p>
                                        )}
                                        <div className="mt-4 pt-4 border-t border-[hsl(var(--border))] flex items-center gap-2 text-xs text-[hsl(var(--muted-foreground))]">
                                            <Hash className="h-3 w-3" />
                                            ID: {dept.id}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </AdminLayout>
    );
}
