import { type UseFormRegister, type FieldErrors } from 'react-hook-form';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileCode, AlertCircle } from 'lucide-react';
import type { ToolFormValues } from '@/lib/schemas';
import { cn } from '@/lib/utils';

interface BasicInfoSectionProps {
    register: UseFormRegister<ToolFormValues>;
    errors: FieldErrors<ToolFormValues>;
    disabled?: boolean;
}

export function BasicInfoSection({ register, errors, disabled }: BasicInfoSectionProps) {
    return (
        <Card>
            <CardContent className="p-6 space-y-6">
                <h3 className="font-semibold text-lg flex items-center gap-2 pb-2 border-b border-[hsl(var(--border))]">
                    <FileCode className="h-5 w-5 text-[hsl(var(--primary))]" />
                    Basic Information
                </h3>

                <div className="space-y-2">
                    <Label htmlFor="name">Tool Name <span className="text-red-500">*</span></Label>
                    <Input
                        id="name"
                        {...register('name')}
                        disabled={disabled}
                        placeholder="e.g., Excel to CSV Converter"
                        className={cn("h-12", errors.name && 'border-destructive')}
                    />
                    {errors.name && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            {errors.name.message}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Short Description <span className="text-red-500">*</span></Label>
                    <Textarea
                        id="description"
                        {...register('description')}
                        disabled={disabled}
                        placeholder="Brief description of what the tool does and who it's for"
                        rows={3}
                        className={cn(errors.description && 'border-destructive')}
                    />
                    {errors.description && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            {errors.description.message}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="github_url">GitHub URL (Required for Submission) <span className="text-red-500">*</span></Label>
                    <Input
                        id="github_url"
                        {...register('github_url')}
                        disabled={disabled}
                        placeholder="https://github.com/org/repo"
                        className={cn("h-12", errors.github_url && 'border-destructive')}
                    />
                    {errors.github_url && (
                        <p className="text-sm text-destructive flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            {errors.github_url.message}
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
