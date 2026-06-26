/**
 * Admin Review Tool Page
 * 
 * Tool review interface for administrators.
 * Refactored to use shared components for DRY principle.
 */
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { adminApi } from '@/lib/api';
import { LoadingState } from '@/components/shared';
import { ToolInstructions } from '@/components/tools/detail';
import { FileInfoCard, UploaderCard, DepartmentBadges } from '@/components/tools';
import { ArrowLeft, Check, MessageSquare, Loader2, Package, X, Calendar } from 'lucide-react';

export default function ReviewTool() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [tool, setTool] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [remarks, setRemarks] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [showRemarksForm, setShowRemarksForm] = useState(false);

    useEffect(() => {
        loadTool();
    }, [id]);

    const loadTool = async () => {
        try {
            const data = await adminApi.getToolForReview(Number(id));
            setTool(data);
        } catch (error) {
            console.error('Failed to load tool:', error);
            navigate('/admin/tools/pending');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async () => {
        setSubmitting(true);
        try {
            await adminApi.approveTool(Number(id));
            navigate('/admin/tools/pending');
        } catch (error) {
            console.error('Failed to approve:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleRequestChanges = async () => {
        if (!remarks.trim()) return;
        setSubmitting(true);
        try {
            await adminApi.requestChanges(Number(id), remarks);
            navigate('/admin/tools/pending');
        } catch (error) {
            console.error('Failed to request changes:', error);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout title="Review Tool">
                <LoadingState message="Loading tool for review..." />
            </AdminLayout>
        );
    }

    if (!tool) return null;

    return (
        <AdminLayout title="Review Tool">
            <Button variant="ghost" onClick={() => navigate('/admin/tools/pending')} className="mb-4 -ml-2">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Pending Reviews
            </Button>

            {/* Tool Header */}
            <Card className="mb-6 overflow-hidden">
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-6 text-white">
                    <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                        <div className="h-20 w-20 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center flex-shrink-0">
                            <Package className="h-10 w-10" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <h1 className="text-2xl lg:text-3xl font-bold">{tool.name}</h1>
                                <Badge className="bg-white/20 text-white border-white/30">Pending Review</Badge>
                            </div>
                            <p className="text-white/90 max-w-2xl">{tool.description}</p>
                        </div>
                    </div>
                </div>

                <CardContent className="p-6 bg-[hsl(var(--muted))]/30">
                    <div className="flex flex-wrap gap-3">
                        <Button onClick={handleApprove} disabled={submitting} className="bg-green-600 hover:bg-green-700 h-12 px-6">
                            <Check className="h-5 w-5 mr-2" />
                            Approve Tool
                        </Button>
                        <Button
                            variant={showRemarksForm ? "default" : "outline"}
                            onClick={() => setShowRemarksForm(!showRemarksForm)}
                            className={showRemarksForm ? "bg-amber-600 hover:bg-amber-700 h-12 px-6" : "text-amber-600 border-amber-300 hover:bg-amber-50 h-12 px-6"}
                        >
                            <MessageSquare className="h-5 w-5 mr-2" />
                            Request Changes
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Request Changes Form */}
            {showRemarksForm && (
                <Card className="border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 mb-6">
                    <CardContent className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-lg flex items-center gap-2">
                                <MessageSquare className="h-5 w-5 text-amber-600" />
                                Request Changes
                            </h3>
                            <Button variant="ghost" size="sm" onClick={() => setShowRemarksForm(false)}>
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="remarks">Remarks for the uploader *</Label>
                            <Textarea
                                id="remarks"
                                placeholder="Describe what changes are needed..."
                                value={remarks}
                                onChange={(e) => setRemarks(e.target.value)}
                                rows={5}
                                className="bg-white"
                            />
                        </div>
                        <div className="flex gap-3">
                            <Button onClick={handleRequestChanges} disabled={submitting || !remarks.trim()} className="bg-amber-600 hover:bg-amber-700 h-12">
                                {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                                Send Request
                            </Button>
                            <Button variant="outline" onClick={() => setShowRemarksForm(false)} className="h-12">
                                Cancel
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Tool Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <ToolInstructions
                        instructionsHtml={tool.instructions_html}
                        pdfAvailable={tool.instruction_pdf_available}
                        pdfUrl={tool.instruction_pdf_available ? adminApi.getInstructionPdfUrl(tool.id) : undefined}
                        onViewPdf={() => window.open(adminApi.getInstructionPdfUrl(tool.id), '_blank')}
                    />
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader className="border-b border-[hsl(var(--border))]">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Package className="h-5 w-5 text-[hsl(var(--primary))]" />
                                File Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <FileInfoCard fileName={tool.file_name} fileSizeDisplay={`${(tool.file_size / (1024 * 1024)).toFixed(2)} MB`} readOnly={false} />
                            <DepartmentBadges departments={tool.department_names} />
                        </CardContent>
                    </Card>

                    <UploaderCard name={tool.uploader_name} email={tool.uploader_email} toolName={tool.name} />

                    <Card>
                        <CardHeader className="border-b border-[hsl(var(--border))]">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-[hsl(var(--primary))]" />
                                Submitted
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <p className="font-medium">
                                {new Date(tool.created_at).toLocaleDateString('en-US', {
                                    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                                })}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
