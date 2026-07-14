import { type UseFormWatch, type UseFormSetValue, type FieldErrors } from 'react-hook-form';
import { Card, CardContent } from '@/components/ui/card';
import { DepartmentSelector, SubcategorySelector } from '@/components/forms';
import type { Department } from '@/lib/api';
import type { ToolFormValues } from '@/lib/schemas';
import { AlertCircle } from 'lucide-react';
import { useSubcategories } from '@/hooks/useDepartments';
import { useEffect } from 'react';

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
    const selectedSubcategories = watch('selectedSubcategories') || [];
    const { data: allSubcategories = [], isLoading } = useSubcategories();

    // Filter subcategories by selected departments
    const filteredSubcategories = allSubcategories.filter(sub => 
        selectedDepartments?.includes(sub.department_id)
    );

    // Auto-remove subcategories if their parent department is unchecked
    useEffect(() => {
        if (isLoading || allSubcategories.length === 0) return;

        if (!selectedDepartments || selectedDepartments.length === 0) {
            if (selectedSubcategories.length > 0) {
                setValue('selectedSubcategories', []);
            }
            return;
        }

        const validSubIds = filteredSubcategories.map(s => s.id);
        const newSelected = selectedSubcategories.filter(id => validSubIds.includes(id));
        
        if (newSelected.length !== selectedSubcategories.length) {
            setValue('selectedSubcategories', newSelected);
        }
    }, [selectedDepartments, filteredSubcategories, selectedSubcategories, setValue]);

    const toggleDepartment = (deptId: number) => {
        const current = selectedDepartments || [];
        const updated = current.includes(deptId)
            ? current.filter(id => id !== deptId)
            : [...current, deptId];
        setValue('selectedDepartments', updated, { shouldValidate: true });
    };

    const toggleSubcategory = (subId: number) => {
        const updated = selectedSubcategories.includes(subId)
            ? selectedSubcategories.filter(id => id !== subId)
            : [...selectedSubcategories, subId];
        setValue('selectedSubcategories', updated, { shouldValidate: true });
    };

    return (
        <Card>
            <CardContent className="p-6">
                <DepartmentSelector
                    departments={departments}
                    selectedIds={selectedDepartments || []}
                    onToggle={toggleDepartment}
                    disabled={disabled}
                />
                {errors.selectedDepartments && (
                    <p className="text-sm text-destructive flex items-center gap-1 mt-2">
                        <AlertCircle className="h-4 w-4" />
                        {errors.selectedDepartments.message}
                    </p>
                )}

                <SubcategorySelector
                    subcategories={filteredSubcategories}
                    selectedIds={selectedSubcategories}
                    onToggle={toggleSubcategory}
                    disabled={disabled}
                />
            </CardContent>
        </Card>
    );
}

