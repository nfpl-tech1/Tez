/**
 * Team Member Components
 * 
 * Reusable components for team member management.
 */
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Mail, Loader2, UserPlus } from 'lucide-react';

interface TeamMemberCardProps {
    member: {
        id: number;
        name: string;
        username: string;
        email: string;
        created_at: string;
    };
    onDelete: (id: number, name: string) => void;
}

export function TeamMemberCard({ member, onDelete }: TeamMemberCardProps) {
    return (
        <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[hsl(var(--primary))] to-blue-600 flex items-center justify-center text-white text-lg font-semibold shadow-md">
                            {member.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                            <h3 className="font-semibold">{member.name}</h3>
                            <p className="text-sm text-[hsl(var(--muted-foreground))]">@{member.username}</p>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => onDelete(member.id, member.name)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
                <div className="mt-4 pt-4 border-t border-[hsl(var(--border))]">
                    <a
                        href={`mailto:${member.email}`}
                        className="text-sm text-[hsl(var(--primary))] hover:underline flex items-center gap-2"
                    >
                        <Mail className="h-4 w-4" />
                        {member.email}
                    </a>
                    <p className="text-xs text-[hsl(var(--muted-foreground))] mt-2">
                        Joined {new Date(member.created_at).toLocaleDateString()}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}

interface AddMemberFormProps {
    formData: { username: string; email: string; password: string; name: string };
    onChange: (data: { username: string; email: string; password: string; name: string }) => void;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
    submitting: boolean;
}

export function AddMemberForm({ formData, onChange, onSubmit, onCancel, submitting }: AddMemberFormProps) {
    return (
        <Card className="border-[hsl(var(--primary))]/20 bg-[hsl(var(--primary))]/5">
            <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                    <UserPlus className="h-5 w-5" />
                    Add New Team Member
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => onChange({ ...formData, name: e.target.value })}
                            placeholder="John Doe"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => onChange({ ...formData, email: e.target.value })}
                            placeholder="john@example.com"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                            id="username"
                            value={formData.username}
                            onChange={(e) => onChange({ ...formData, username: e.target.value })}
                            placeholder="johndoe"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={formData.password}
                            onChange={(e) => onChange({ ...formData, password: e.target.value })}
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <div className="md:col-span-2 flex gap-3">
                        <Button type="submit" disabled={submitting}>
                            {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            Add Member
                        </Button>
                        <Button type="button" variant="outline" onClick={onCancel}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}
