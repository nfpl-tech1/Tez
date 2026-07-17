import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TeamLayout } from '@/components/layout/TeamLayout';
import { PageHeader, LoadingState } from '@/components/shared';
import { AlertMessage } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ToolStatusBadge, ToolStatusBanner } from '@/components/tools';
import { Loader2, Save, Send, X } from 'lucide-react';
import { toast } from 'sonner';
import { useTeamTool, useTeamDepartments, useUpdateTool } from '@/hooks';
import { toolFormSchema, type ToolFormValues } from '@/lib/schemas';
import { VALIDATION_MESSAGES } from '@/lib/constants';
import { BasicInfoSection, InstructionsSection, FileSection, DepartmentsSection } from '@/components/tools/form-sections';

export default function EditTool() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const toolId = Number(id);

    // Queries & Mutations
    const { data: tool, isLoading: toolLoading } = useTeamTool(toolId);
    const { data: departments, isLoading: deptLoading } = useTeamDepartments();
    const updateTool = useUpdateTool();

    // Local state for files (not handled by react-hook-form)
    const [file, setFile] = useState<File | null>(null);
    const [pdfFile, setPdfFile] = useState<File | null>(null);

    const form = useForm<ToolFormValues>({
        resolver: zodResolver(toolFormSchema),
        defaultValues: {
            name: '',
            description: '',
            instructions: '',
            instructionType: 'markdown',
            selectedDepartments: [],
            selectedSubcategories: [],
            github_url: '',
        },
    });

    const { register, handleSubmit, formState: { errors }, watch, setValue, reset, setError: setFormError } = form;

    // Load initial data into form
    useEffect(() => {
        if (tool) {
            reset({
                name: tool.name,
                description: tool.description,
                instructions: tool.instructions || '',
                instructionType: tool.instruction_type as 'markdown' | 'pdf',
                selectedDepartments: tool.department_ids || [],
                selectedSubcategories: tool.subcategory_ids || [],
                github_url: tool.github_url || '',
            });
        }
    }, [tool, reset]);

    if (toolLoading || deptLoading) {
        return (
            <TeamLayout title="Edit Tool">
                <LoadingState message="Loading tool details..." />
            </TeamLayout>
        );
    }

    if (!tool) return null;

    const handleFormSubmit = (data: ToolFormValues, isDraft: boolean) => {
        if (!isDraft) {
            let hasError = false;
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

        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('description', data.description);
        formData.append('instruction_type', data.instructionType);
        formData.append('save_as_draft', isDraft.toString());

        if (data.instructionType === 'markdown') {
            formData.append('instructions', data.instructions || '');
        }
        if (data.selectedDepartments.length > 0) {
            formData.append('department_ids', data.selectedDepartments.join(','));
        }
        if (data.selectedSubcategories.length > 0) {
            formData.append('subcategory_ids', data.selectedSubcategories.join(','));
        }
        if (data.github_url) {
            formData.append('github_url', data.github_url);
        }
        if (file) formData.append('file', file);
        if (data.instructionType === 'pdf' && pdfFile) {
            formData.append('instruction_pdf', pdfFile);
        }

        updateTool.mutate(
            { id: toolId, formData },
            {
                onSuccess: () => {
                    navigate('/team/dashboard');
                },
                onError: (err: any) => {
                    toast.error(err.response?.data?.detail || 'Failed to update tool');
                }
            }
        );
    };

    const onSubmit = (isDraft: boolean) => {
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

    const isSubmitting = updateTool.isPending;

    return (
        <TeamLayout title="Edit Tool">
            <PageHeader
                description="Update your tool's information and resubmit for review if needed."
            >
                <ToolStatusBadge status={tool.status} />
            </PageHeader>

            {/* Admin Remarks Banner */}
            {tool.admin_remarks && (
                <ToolStatusBanner
                    status={tool.status}
                    remarks={tool.admin_remarks}
                    className="mb-6"
                />
            )}

            <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-6">
                        <BasicInfoSection
                            register={register}
                            errors={errors}
                        />
                        <InstructionsSection
                            register={register}
                            errors={errors}
                            watch={watch}
                            setValue={setValue}
                            pdfFile={pdfFile}
                            onPdfChange={setPdfFile}
                            currentPdfName={tool.instruction_pdf_name}
                        />
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        <FileSection
                            file={file}
                            onFileChange={setFile}
                            currentFileName={tool.file_name || undefined}
                            currentFileSizeDisplay={tool.file_size_display}
                        />

                        <DepartmentsSection
                            departments={departments || []}
                            watch={watch}
                            setValue={setValue}
                            errors={errors}
                        />

                        {/* Action Buttons */}
                        <Card>
                            <CardContent className="p-6 space-y-3">
                                <Button
                                    type="button"
                                    onClick={() => onSubmit(false)}
                                    disabled={isSubmitting}
                                    className="w-full h-12"
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                    ) : (
                                        <Send className="h-5 w-5 mr-2" />
                                    )}
                                    {tool.status === 'draft' ? 'Submit for Review' : 'Save & Resubmit'}
                                </Button>

                                {tool.status === 'draft' && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => onSubmit(true)}
                                        disabled={isSubmitting}
                                        className="w-full h-12"
                                    >
                                        <Save className="h-5 w-5 mr-2" />
                                        Save Draft
                                    </Button>
                                )}

                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => navigate('/team/dashboard')}
                                    disabled={isSubmitting}
                                    className="w-full"
                                >
                                    <X className="h-4 w-4 mr-2" />
                                    Cancel
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </TeamLayout>
    );
}
