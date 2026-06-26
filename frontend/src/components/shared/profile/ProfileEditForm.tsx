/**
 * Profile Edit Form
 * 
 * Reusable form component for editing user profiles.
 * Refactored to use extracted form field components.
 */
import { useState, useEffect, type FormEvent } from 'react';
import { User, Save, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertMessage } from '@/components/ui/alert';
import { UsernameField, NameField, EmailField, PasswordFields } from './ProfileFormFields';
import type { ProfileData } from '@/lib/types';

interface ProfileEditFormProps {
    initialData: ProfileData;
    onSubmit: (data: Record<string, unknown>) => Promise<void>;
    usernameEditable?: boolean;
    showConfirmPassword?: boolean;
}

export function ProfileEditForm({
    initialData,
    onSubmit,
    usernameEditable = false,
    showConfirmPassword = true,
}: ProfileEditFormProps) {
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    useEffect(() => {
        if (initialData) {
            setFormData(prev => ({
                ...prev,
                name: initialData.name,
                username: initialData.username,
                email: initialData.email,
            }));
        }
    }, [initialData]);

    const validateForm = (): boolean => {
        if (showConfirmPassword && formData.password && formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        if (formData.password && formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!validateForm()) return;

        setSubmitting(true);
        try {
            const updateData: Record<string, unknown> = { name: formData.name, email: formData.email };
            if (usernameEditable) updateData.username = formData.username;
            if (formData.password) updateData.password = formData.password;

            await onSubmit(updateData);
            setSuccess('Profile updated successfully');
            setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
        } catch (err: any) {
            setError(err.message || 'Failed to update profile');
        } finally {
            setSubmitting(false);
        }
    };

    const updateField = (field: keyof typeof formData) => (value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Edit Profile
                </CardTitle>
                <CardDescription>Update your personal information and password</CardDescription>
            </CardHeader>
            <CardContent>
                {error && <AlertMessage variant="destructive" message={error} onDismiss={() => setError('')} className="mb-4" />}
                {success && <AlertMessage variant="success" message={success} onDismiss={() => setSuccess('')} className="mb-4" />}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <UsernameField value={formData.username} onChange={updateField('username')} editable={usernameEditable} disabled={submitting} />
                        <NameField value={formData.name} onChange={updateField('name')} disabled={submitting} />
                        <EmailField value={formData.email} onChange={updateField('email')} disabled={submitting} />
                        <PasswordFields
                            password={formData.password}
                            confirmPassword={formData.confirmPassword}
                            onPasswordChange={updateField('password')}
                            onConfirmChange={updateField('confirmPassword')}
                            showConfirm={showConfirmPassword}
                            disabled={submitting}
                        />
                    </div>

                    <p className="text-xs text-[hsl(var(--muted-foreground))]">
                        Leave password fields empty to keep your current password
                    </p>

                    <div className="flex justify-end pt-4 border-t border-[hsl(var(--border))]">
                        <Button type="submit" disabled={submitting}>
                            {submitting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                            Save Changes
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
