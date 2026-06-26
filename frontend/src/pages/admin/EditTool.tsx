/**
 * Admin Edit Tool Page
 * 
 * Allows admins to edit tool details.
 * Refactored to use shared components for DRY principle.
 */
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LoadingState } from '@/components/shared';
import { useAdminTool, useAdminDepartments, useAdminUpdateTool } from '@/hooks';
import { 
    ToolHeaderCard, 
    FileInfoCard, 
    StatsCard, 
    UploaderCard, 
    TimelineCard 
} from '@/components/tools';
import { ArrowLeft, Edit, Loader2, Save } from 'lucide-react';
import { toolFormSchema, type ToolFormValues } from '@/lib/schemas';
import { BasicInfoSection, InstructionsSection, DepartmentsSection } from '@/components/tools/form-sections';
import { AlertMessage } from '@/components/ui/alert';
import { useState, useEffect } from 'react';

export default function AdminEditTool() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const toolId = Number(id);

    const { data: tool, isLoading: toolLoading } = useAdminTool(toolId);
    const { data: departments, isLoading: deptLoading } = useAdminDepartments();
    const updateTool = useAdminUpdateTool();
    const [error, setError] = useState('');

    const form = useForm<ToolFormValues>({
        resolver: zodResolver(toolFormSchema),
        defaultValues: {
            name: '',
            description: '',
            instructions: '',
            instructionType: 'markdown',
            selectedDepartments: [],
        },
    });

    const { register, handleSubmit, formState: { errors }, watch, setValue, reset } = form;

    useEffect(() => {
        if (tool) {
            reset({
                name: tool.name,
                description: tool.description,
                instructions: tool.instructions || '',
                instructionType: tool.instruction_type as 'markdown' | 'pdf',
                selectedDepartments: tool.department_ids || [],
            });
        }
    }, [tool, reset]);

    if (toolLoading || deptLoading) {
        return (
            <AdminLayout title="Edit Tool">
                <LoadingState message="Loading tool details..." />
            </AdminLayout>
        );
    }

    if (!tool) return null;

    const onSubmit = (data: ToolFormValues) => {
        setError('');
        updateTool.mutate(
            {
                id: toolId,
                data: {
                    name: data.name,
                    description: data.description,
                    instructions: data.instructions,
                    department_ids: data.selectedDepartments,
                }
            },
            {
                onSuccess: () => navigate('/admin/tools'),
                onError: (err: any) => setError(err.response?.data?.detail || 'Failed to update tool')
            }
        );
    };

    const isSaving = updateTool.isPending;

    return (
        <AdminLayout title="Edit Tool">
            <Button variant="ghost" onClick={() => navigate('/admin/tools')} className="mb-4 -ml-2">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to All Tools
            </Button>

            <ToolHeaderCard
                title="Edit Tool"
                description="Make changes to this tool. As an admin, your changes take effect immediately without review."
                icon={Edit}
                status={tool.status}
            />

            {error && <AlertMessage variant="destructive" message={error} onDismiss={() => setError('')} className="mb-6" />}

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <BasicInfoSection register={register} errors={errors} />
                        <InstructionsSection
                            register={register}
                            errors={errors}
                            watch={watch}
                            setValue={setValue}
                            pdfFile={null}
                            onPdfChange={() => {}}
                            currentPdfName={tool.instruction_pdf_name}
                            disabled={false}
                        />
                        <DepartmentsSection
                            departments={departments || []}
                            watch={watch}
                            setValue={setValue}
                            errors={errors}
                        />

                        <Card className="bg-[hsl(var(--muted))]/30">
                            <CardContent className="p-6">
                                <div className="flex flex-wrap gap-4">
                                    <Button type="submit" disabled={isSaving} className="h-12 px-8 text-base">
                                        {isSaving ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : <Save className="h-5 w-5 mr-2" />}
                                        Save Changes
                                    </Button>
                                    <Button type="button" variant="outline" onClick={() => navigate('/admin/tools')} disabled={isSaving} className="h-12 px-8 text-base">
                                        Cancel
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <FileInfoCard fileName={tool.file_name} fileSizeDisplay={tool.file_size_display} />
                        <StatsCard downloadCount={tool.download_count} />
                        {tool.uploader && (
                            <UploaderCard name={tool.uploader.name} email={tool.uploader.email} />
                        )}
                        <TimelineCard createdAt={tool.created_at} updatedAt={tool.updated_at} />
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}
