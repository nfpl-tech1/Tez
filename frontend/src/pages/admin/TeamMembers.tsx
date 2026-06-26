/**
 * Team Members Page
 * 
 * Admin page for managing team members.
 * Refactored to use shared components.
 */
import { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageHeader, LoadingState, EmptyState } from '@/components/shared';
import { AlertMessage } from '@/components/ui/alert';
import { adminApi, type TeamMember } from '@/lib/api';
import { TeamMemberCard, AddMemberForm } from '@/components/admin/TeamMemberComponents';
import { Plus, Users, X } from 'lucide-react';

const EMPTY_FORM = { username: '', email: '', password: '', name: '' };

export default function TeamMembers() {
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState(EMPTY_FORM);

    useEffect(() => {
        loadMembers();
    }, []);

    const loadMembers = async () => {
        try {
            const data = await adminApi.getTeamMembers();
            setMembers(data);
        } catch (error) {
            console.error('Failed to load team members:', error);
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
            await adminApi.addTeamMember(formData);
            setSuccess('Team member added successfully');
            setFormData(EMPTY_FORM);
            setShowForm(false);
            loadMembers();
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Failed to add team member');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: number, name: string) => {
        if (!confirm(`Are you sure you want to remove ${name}?`)) return;
        try {
            await adminApi.deleteTeamMember(id);
            setMembers(members.filter(m => m.id !== id));
            setSuccess('Team member removed');
        } catch {
            setError('Failed to remove team member');
        }
    };

    if (loading) {
        return (
            <AdminLayout title="Team Members">
                <LoadingState fullScreen message="Loading team members..." />
            </AdminLayout>
        );
    }

    return (
        <AdminLayout title="Team Members">
            <div className="space-y-6">
                <PageHeader description="Manage team members who can upload and manage tools">
                    <Button onClick={() => setShowForm(!showForm)}>
                        {showForm ? <X className="h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                        {showForm ? 'Cancel' : 'Add Team Member'}
                    </Button>
                </PageHeader>

                {error && <AlertMessage variant="destructive" message={error} onDismiss={() => setError('')} />}
                {success && <AlertMessage variant="success" message={success} onDismiss={() => setSuccess('')} />}

                {showForm && (
                    <AddMemberForm
                        formData={formData}
                        onChange={setFormData}
                        onSubmit={handleSubmit}
                        onCancel={() => setShowForm(false)}
                        submitting={submitting}
                    />
                )}

                {members.length === 0 ? (
                    <Card>
                        <CardContent className="p-0">
                            <EmptyState
                                icon={Users}
                                title="No team members yet"
                                description="Add your first team member to allow them to upload tools."
                                action={{ label: 'Add Team Member', icon: Plus, onClick: () => setShowForm(true) }}
                            />
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {members.map((member) => (
                            <TeamMemberCard key={member.id} member={member} onDelete={handleDelete} />
                        ))}
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
