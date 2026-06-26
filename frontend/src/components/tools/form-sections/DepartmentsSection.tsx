import { type UseFormWatch, type UseFormSetValue, type FieldErrors } from 'react-hook-form';
import { Card, CardContent } from '@/components/ui/card';
import { DepartmentSelector } from '@/components/forms';
import type { Department } from '@/lib/api';
import type { ToolFormValues } from '@/lib/schemas';
import { AlertCircle } from 'lucide-react';

interface DepartmentsSectionProps {
    departments: Department[];
    watch: UseFormWatch<ToolFormValues>;
    setValue: UseFormSetValue<ToolFormValues>;
    errors: FieldErrors<ToolFormValues>;
    disabled?: boolean;
}

export function DepartmentsSection({
    departments,
    watch,
    setValue,
    errors,
    disabled
}: DepartmentsSectionProps) {
    const selectedDepartments = watch('selectedDepartments');

    const toggleDepartment = (deptId: number) => {
        const current = selectedDepartments || [];
        const updated = current.includes(deptId)
            ? current.filter(id => id !== deptId)
            : [...current, deptId];
        setValue('selectedDepartments', updated, { shouldValidate: true });
    };

    return (
        <Card>
            <CardContent className="p-6">
                <DepartmentSelector
                    departments={departments}
                    selectedIds={selectedDepartments}
                    onToggle={toggleDepartment}
                    disabled={disabled}
                />
                {errors.selectedDepartments && (
                    <p className="text-sm text-destructive flex items-center gap-1 mt-2">
                        <AlertCircle className="h-4 w-4" />
                        {errors.selectedDepartments.message}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
