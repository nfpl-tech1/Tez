/**
 * useToolForm Hook
 * 
 * Custom hook for tool form state management.
 * Consolidates form logic shared between admin and team edit pages.
 */
import { useState, useCallback } from 'react';
import { VALIDATION_MESSAGES, FILE_CONFIG } from '@/lib/constants';

export interface ToolFormData {
    name: string;
    description: string;
    instructions: string;
    instructionType: 'markdown' | 'pdf';
    selectedDepartments: number[];
}

const DEFAULT_FORM_DATA: ToolFormData = {
    name: '', description: '', instructions: '', instructionType: 'markdown', selectedDepartments: [],
};

/**
 * Custom hook for managing tool form state and validation
 */
export function useToolForm(initialData: Partial<ToolFormData> = {}) {
    // Form state
    const [formData, setFormData] = useState<ToolFormData>({ ...DEFAULT_FORM_DATA, ...initialData });
    const [file, setFile] = useState<File | null>(null);
    const [pdfFile, setPdfFile] = useState<File | null>(null);

    // UI state
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSavingDraft, setIsSavingDraft] = useState(false);

    /** Update a single form field */
    const updateField = useCallback(<K extends keyof ToolFormData>(field: K, value: ToolFormData[K]) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    }, []);

    /** Handle executable file selection with validation */
    const handleFileChange = useCallback((newFile: File | null) => {
        if (newFile) {
            if (!newFile.name.endsWith('.exe')) return setError(VALIDATION_MESSAGES.INVALID.EXE_ONLY);
            if (newFile.size > FILE_CONFIG.EXECUTABLE.maxSizeBytes) return setError(`File size exceeds ${FILE_CONFIG.EXECUTABLE.maxSizeMB}MB limit`);
        }
        setFile(newFile);
        setError('');
    }, []);

    /** Handle PDF file selection for instructions */
    const handlePdfChange = useCallback((newFile: File | null) => {
        if (newFile) {
            if (!newFile.name.endsWith('.pdf')) return setError(VALIDATION_MESSAGES.INVALID.PDF_ONLY);
            if (newFile.size > FILE_CONFIG.PDF.maxSizeBytes) return setError(`PDF size exceeds ${FILE_CONFIG.PDF.maxSizeMB}MB limit`);
        }
        setPdfFile(newFile);
        setError('');
    }, []);

    /** Toggle department selection */
    const toggleDepartment = useCallback((deptId: number) => {
        setFormData(prev => ({
            ...prev,
            selectedDepartments: prev.selectedDepartments.includes(deptId)
                ? prev.selectedDepartments.filter(id => id !== deptId)
                : [...prev.selectedDepartments, deptId]
        }));
    }, []);

    /** Reset form to initial/default state */
    const resetForm = useCallback(() => {
        setFormData({ ...DEFAULT_FORM_DATA, ...initialData });
        setFile(null);
        setPdfFile(null);
        setError('');
        setSuccess('');
    }, [initialData]);

    /** Validate form data */
    const validateForm = useCallback((requireFile = false): boolean => {
        if (!formData.name.trim()) return (setError(VALIDATION_MESSAGES.REQUIRED.NAME), false);
        if (!formData.description.trim()) return (setError(VALIDATION_MESSAGES.REQUIRED.DESCRIPTION), false);
        if (formData.instructionType === 'markdown' && !formData.instructions.trim()) return (setError(VALIDATION_MESSAGES.REQUIRED.INSTRUCTIONS), false);
        if (formData.selectedDepartments.length === 0) return (setError(VALIDATION_MESSAGES.REQUIRED.DEPARTMENT), false);
        if (requireFile && !file) return (setError(VALIDATION_MESSAGES.REQUIRED.FILE), false);
        if (formData.instructionType === 'pdf' && !pdfFile) return (setError(VALIDATION_MESSAGES.REQUIRED.PDF), false);
        return true;
    }, [formData, file, pdfFile]);

    return {
        // State
        formData, file, pdfFile, error, success, isSubmitting, isSavingDraft,
        // Setters
        setFormData, setError, setSuccess, setIsSubmitting, setIsSavingDraft,
        // Handlers
        updateField, handleFileChange, handlePdfChange, toggleDepartment, resetForm, validateForm,
    };
}

export default useToolForm;
