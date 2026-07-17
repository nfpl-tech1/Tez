/**
 * Upload Tool Page
 * 
 * Tool upload form for team members.
 * Refactored to use shared form components.
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TeamLayout } from '@/components/layout/TeamLayout';
import { PageHeader, LoadingState } from '@/components/shared';
import { AlertMessage } from '@/components/ui/alert';
import { toast } from 'sonner';
import { teamApi, type Department } from '@/lib/api';
import { toolFormSchema, type ToolFormValues } from '@/lib/schemas';
import { VALIDATION_MESSAGES } from '@/lib/constants';
import {
    BasicInfoSection,
    InstructionsSection,
    FileSection,
    DepartmentsSection,
    ToolFormActions,
    SuccessOverlay,
} from '@/components/tools/form-sections';

export default function UploadTool() {
    const navigate = useNavigate();
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [savingDraft, setSavingDraft] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [fileError, setFileError] = useState('');
    const [pdfError, setPdfError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [pdfFile, setPdfFile] = useState<File | null>(null);

    const form = useForm<ToolFormValues>({
        resolver: zodResolver(toolFormSchema),
        defaultValues: { name: '', description: '', instructions: '', instructionType: 'markdown', selectedDepartments: [], selectedSubcategories: [], github_url: '' },
        mode: 'onChange',
    });

    const { register, handleSubmit, formState: { errors }, watch, setValue, setError: setFormError } = form;

    useEffect(() => {
        loadDepartments();
    }, []);

    const loadDepartments = async () => {
        try {
            const data = await teamApi.getDepartments();
            setDepartments(data);
        } catch (error) {
            console.error('Failed to load departments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFormSubmit = async (data: ToolFormValues, isDraft: boolean) => {
        if (!isDraft) {
            let hasError = false;
            if (!file) {
                setFileError('Required: Please attach an executable file');
                hasError = true;
            } else {
                setFileError('');
            }
            if (data.instructionType === 'pdf' && !pdfFile) {
                setPdfError('Required: Please upload a PDF for instructions');
                hasError = true;
            } else {
                setPdfError('');
            }
            if (!data.github_url) {
                setFormError('github_url', { type: 'manual', message: VALIDATION_MESSAGES.REQUIRED.GITHUB_URL });
                hasError = true;
            }
            if (hasError) {
                setTimeout(() => {
                    const firstErrorElement = document.querySelector('.border-destructive, .text-destructive, [data-invalid="true"], [aria-invalid="true"]');
                    if (firstErrorElement) {
                        firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }, 100);
                return;
            }
        }

        setFileError('');
        setPdfError('');
        setSuccessMessage('');
        isDraft ? setSavingDraft(true) : setSubmitting(true);

        try {
            const formData = new FormData();
            formData.append('name', data.name);
            formData.append('description', data.description);
            formData.append('instruction_type', data.instructionType);
            formData.append('save_as_draft', isDraft.toString());
            if (data.instructionType === 'markdown') formData.append('instructions', data.instructions || '');
            if (data.selectedDepartments.length > 0) formData.append('department_ids', data.selectedDepartments.join(','));
            if (data.selectedSubcategories.length > 0) formData.append('subcategory_ids', data.selectedSubcategories.join(','));
            if (data.github_url) formData.append('github_url', data.github_url);
            if (file) formData.append('file', file);
            if (data.instructionType === 'pdf' && pdfFile) formData.append('instruction_pdf', pdfFile);

            await teamApi.createTool(formData);

            if (isDraft) {
                setSuccessMessage('Draft saved successfully!');
                setTimeout(() => navigate('/team/dashboard'), 1500);
            } else {
                setSubmitted(true);
                setTimeout(() => navigate('/team/dashboard'), 2000);
            }
        } catch (err: any) {
            toast.error(err.response?.data?.detail || 'Failed to upload tool');
        } finally {
            setSubmitting(false);
            setSavingDraft(false);
        }
    };

    const onSubmit = (isDraft: boolean) => {
        if (isDraft && !form.getValues().name) {
            toast.error('Tool name is required for draft');
            return;
        }
        handleSubmit(
            (data) => handleFormSubmit(data, isDraft),
            (errors) => {
                setTimeout(() => {
                    const firstErrorElement = document.querySelector('.border-destructive, .text-destructive, [data-invalid="true"], [aria-invalid="true"]');
                    if (firstErrorElement) {
                        firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }, 100);
            }
        )();
    };

    if (loading) {
        return (
            <TeamLayout title="Upload Tool">
                <LoadingState message="Loading form..." />
            </TeamLayout>
        );
    }

    return (
        <TeamLayout title="Upload Tool">
            <PageHeader description="Share your tool with the team. Fill in the details below and submit for review." />

            {submitted && <SuccessOverlay message="Tool Submitted!" subMessage="Your tool has been submitted for review. Redirecting..." />}

            <div className="space-y-6">
                {successMessage && !submitted && <AlertMessage variant="success" message={successMessage} />}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <BasicInfoSection register={register} errors={errors} disabled={submitted} />
                        <InstructionsSection
                            register={register}
                            errors={errors}
                            watch={watch}
                            setValue={setValue}
                            pdfFile={pdfFile}
                            onPdfChange={(file) => {
                                setPdfFile(file);
                                if (file) setPdfError('');
                            }}
                            pdfError={pdfError}
                            disabled={submitted}
                        />
                    </div>

                    <div className="space-y-6">
                        <FileSection 
                            file={file} 
                            onFileChange={(f) => {
                                setFile(f);
                                if (f) setFileError('');
                            }} 
                            error={fileError}
                            disabled={submitted} 
                        />
                        <DepartmentsSection departments={departments} watch={watch} setValue={setValue} errors={errors} disabled={submitted} />
                        <ToolFormActions
                            onSubmit={() => onSubmit(false)}
                            onSaveDraft={() => onSubmit(true)}
                            onCancel={() => navigate('/team/dashboard')}
                            isSubmitting={submitting}
                            isSavingDraft={savingDraft}
                            disabled={submitted}
                        />
                    </div>
                </div>
            </div>
        </TeamLayout>
    );
}
