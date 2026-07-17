import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Check, Plus, X, Loader2 } from 'lucide-react';
import type { Subcategory } from '@/lib/types';

interface Department {
    id: number;
    name: string;
}

interface SubcategorySelectorProps {
    subcategories: Subcategory[];
    selectedIds: number[];
    onToggle: (id: number) => void;
    disabled?: boolean;
    selectedDepartments?: number[];
    departments?: Department[];
    onCreateSubcategory?: (name: string, departmentId: number) => Promise<void>;
}

export function SubcategorySelector({
    subcategories,
    selectedIds,
    onToggle,
    disabled = false,
    selectedDepartments = [],
    departments = [],
    onCreateSubcategory
}: SubcategorySelectorProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [newName, setNewName] = useState('');
    const [selectedDeptId, setSelectedDeptId] = useState<number | ''>('');
    const [submitting, setSubmitting] = useState(false);

    // If no departments are selected, hide the section entirely
    if (selectedDepartments.length === 0) return null;

    const handleAddClick = () => {
        setIsAdding(true);
        if (selectedDepartments.length === 1) {
            setSelectedDeptId(selectedDepartments[0]);
        } else {
            setSelectedDeptId('');
        }
        setNewName('');
    };

    const handleSave = async () => {
        if (!newName.trim() || !selectedDeptId) return;
        setSubmitting(true);
        try {
            if (onCreateSubcategory) {
                await onCreateSubcategory(newName.trim(), Number(selectedDeptId));
            }
            setIsAdding(false);
            setNewName('');
        } catch (error) {
            console.error('Failed to create subcategory:', error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-2 mt-4 pt-4 border-t border-[hsl(var(--border))]">
            <Label className="text-sm font-medium">Subcategories</Label>
            <p className="text-xs text-[hsl(var(--muted-foreground))]">
                Select subcategories related to the selected departments
            </p>
            
            {subcategories.length === 0 ? (
                <p className="text-xs text-[hsl(var(--muted-foreground))] italic py-1">
                    No subcategories defined for selected department(s). Add one below if required.
                </p>
            ) : (
                <div className="flex flex-wrap gap-1.5">
                    {subcategories.map((sub) => {
                        const isSelected = selectedIds.includes(sub.id);
                        return (
                            <button
                                key={sub.id}
                                type="button"
                                onClick={() => onToggle(sub.id)}
                                disabled={disabled}
                                className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all flex items-center gap-1.5 ${isSelected
                                    ? 'bg-[hsl(var(--primary))] text-white border-[hsl(var(--primary))] shadow-sm'
                                    : 'bg-white border-[hsl(var(--border))] hover:border-[hsl(var(--primary))] hover:bg-[hsl(var(--muted))]'
                                    } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                            >
                                {isSelected && <Check className="h-3.5 w-3.5" />}
                                {sub.name}
                            </button>
                        );
                    })}
                </div>
            )}
            
            {selectedIds.length > 0 && subcategories.length > 0 && (
                <p className="text-[10px] text-[hsl(var(--primary))] font-medium">
                    {selectedIds.length} subcategory(s) selected
                </p>
            )}

            {!disabled && onCreateSubcategory && (
                <div className="mt-2 pt-1">
                    {!isAdding ? (
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleAddClick}
                            className="flex items-center gap-1 h-8 rounded-full text-xs font-medium"
                        >
                            <Plus className="h-3.5 w-3.5" />
                            Add New Subcategory
                        </Button>
                    ) : (
                        <div className="p-3 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))]/30 space-y-2.5 max-w-xs">
                            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))]">New Subcategory</h4>
                            
                            <div className="space-y-1">
                                <Label htmlFor="new-sub-name" className="text-[11px] text-[hsl(var(--muted-foreground))]">Subcategory Name</Label>
                                <Input
                                    id="new-sub-name"
                                    value={newName}
                                    onChange={(e) => setNewName(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault(); // Prevent submitting the parent tool form
                                            if (newName.trim() && selectedDeptId) {
                                                handleSave();
                                            }
                                        }
                                    }}
                                    placeholder="e.g., Data Analysis"
                                    className="h-8 text-xs"
                                    disabled={submitting}
                                    autoFocus
                                />
                            </div>

                            {selectedDepartments.length > 1 && (
                                <div className="space-y-1">
                                    <Label htmlFor="new-sub-dept" className="text-[11px] text-[hsl(var(--muted-foreground))]">Department</Label>
                                    <select
                                        id="new-sub-dept"
                                        value={selectedDeptId}
                                        onChange={(e) => setSelectedDeptId(Number(e.target.value))}
                                        className="w-full h-8 rounded-md border border-[hsl(var(--input))] bg-background px-2.5 py-1 text-xs shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                        disabled={submitting}
                                    >
                                        <option value="">Select department...</option>
                                        {selectedDepartments.map(id => {
                                            const dept = departments?.find(d => d.id === id);
                                            return (
                                                <option key={id} value={id}>
                                                    {dept?.name || `Department #${id}`}
                                                </option>
                                            );
                                        })}
                                    </select>
                                </div>
                            )}

                            <div className="flex gap-1.5 pt-0.5">
                                <Button
                                    type="button"
                                    size="sm"
                                    onClick={handleSave}
                                    disabled={submitting || !newName.trim() || !selectedDeptId}
                                    className="h-7 text-xs px-2.5 flex items-center gap-1"
                                >
                                    {submitting && <Loader2 className="h-3 w-3 animate-spin" />}
                                    Save
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setIsAdding(false)}
                                    disabled={submitting}
                                    className="h-7 text-xs px-2.5 flex items-center gap-1"
                                >
                                    <X className="h-3 w-3" />
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
