import { Label } from '@/components/ui/label';
import { Check } from 'lucide-react';
import type { Subcategory } from '@/lib/types';

interface SubcategorySelectorProps {
    subcategories: Subcategory[];
    selectedIds: number[];
    onToggle: (id: number) => void;
    disabled?: boolean;
}

export function SubcategorySelector({
    subcategories,
    selectedIds,
    onToggle,
    disabled = false
}: SubcategorySelectorProps) {
    if (subcategories.length === 0) return null;

    return (
        <div className="space-y-3 mt-6 pt-6 border-t border-[hsl(var(--border))]">
            <Label>Subcategories</Label>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
                Select subcategories related to the selected departments
            </p>
            <div className="flex flex-wrap gap-2">
                {subcategories.map((sub) => {
                    const isSelected = selectedIds.includes(sub.id);
                    return (
                        <button
                            key={sub.id}
                            type="button"
                            onClick={() => onToggle(sub.id)}
                            disabled={disabled}
                            className={`px-4 py-2 rounded-full text-sm font-medium border-2 transition-all flex items-center gap-2 ${isSelected
                                ? 'bg-[hsl(var(--primary))] text-white border-[hsl(var(--primary))] shadow-md'
                                : 'bg-white border-[hsl(var(--border))] hover:border-[hsl(var(--primary))] hover:bg-[hsl(var(--muted))]'
                                } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                            {isSelected && <Check className="h-4 w-4" />}
                            {sub.name}
                        </button>
                    );
                })}
            </div>
            {selectedIds.length > 0 && (
                <p className="text-xs text-[hsl(var(--primary))]">
                    {selectedIds.length} subcategory(s) selected
                </p>
            )}
        </div>
    );
}
