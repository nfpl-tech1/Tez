import { Label } from '@/components/ui/label';
import { Check } from 'lucide-react';

interface Department {
    id: number;
    name: string;
}

interface DepartmentSelectorProps {
    departments: Department[];
    selectedIds: number[];
    onToggle: (id: number) => void;
    disabled?: boolean;
}

export function DepartmentSelector({
    departments,
    selectedIds,
    onToggle,
    disabled = false
}: DepartmentSelectorProps) {
    return (
        <div className="space-y-3">
            <Label>Departments</Label>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
                Select one or more departments this tool belongs to
            </p>
            <div className="flex flex-wrap gap-2">
                {departments.map((dept) => {
                    const isSelected = selectedIds.includes(dept.id);
                    return (
                        <button
                            key={dept.id}
                            type="button"
                            onClick={() => onToggle(dept.id)}
                            disabled={disabled}
                            className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all flex items-center gap-2 ${isSelected
                                ? 'bg-[hsl(var(--primary))] text-white border-[hsl(var(--primary))] shadow-md'
                                : 'bg-white border-[hsl(var(--border))] hover:border-[hsl(var(--primary))] hover:bg-[hsl(var(--muted))]'
                                } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                            {isSelected && <Check className="h-4 w-4" />}
                            {dept.name}
                        </button>
                    );
                })}
            </div>
            {selectedIds.length > 0 && (
                <p className="text-xs text-[hsl(var(--primary))]">
                    {selectedIds.length} department(s) selected
                </p>
            )}
        </div>
    );
}
