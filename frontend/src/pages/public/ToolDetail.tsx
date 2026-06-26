import { useParams, Link } from 'react-router-dom';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LoadingState } from '@/components/shared';
import { Package, ArrowLeft } from 'lucide-react';
import { usePublicTool } from '@/hooks';
import { publicApi } from '@/lib/api';
import {
    ToolDetailHeader,
    ToolStatsGrid,
    ToolInstructions,
    ToolIssueReportCard,
    ToolSidebar
} from '@/components/tools/detail';

export default function ToolDetail() {
    const { id } = useParams<{ id: string }>();
    const toolId = Number(id);

    const { data: tool, isLoading } = usePublicTool(toolId);

    const handleDownload = () => {
        if (tool) {
            window.location.href = publicApi.getDownloadUrl(tool.id);
        }
    };

    if (isLoading) {
        return (
            <PublicLayout>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <LoadingState message="Loading tool details..." />
                </div>
            </PublicLayout>
        );
    }

    if (!tool) {
        return (
            <PublicLayout>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <Card className="max-w-lg mx-auto">
                        <CardContent className="py-12 text-center">
                            <div className="h-16 w-16 rounded-full bg-[hsl(var(--muted))] flex items-center justify-center mx-auto mb-4">
                                <Package className="h-8 w-8 text-[hsl(var(--muted-foreground))]" />
                            </div>
                            <h2 className="text-xl font-semibold mb-2">Tool Not Found</h2>
                            <p className="text-[hsl(var(--muted-foreground))] mb-6">
                                This tool may have been removed or is not yet approved.
                            </p>
                            <Link to="/tools">
                                <Button>
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Browse All Tools
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
            </PublicLayout>
        );
    }

    return (
        <PublicLayout>
            <ToolDetailHeader tool={tool} onDownload={handleDownload} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        <ToolStatsGrid tool={tool} />
                        <ToolInstructions
                            instructionsHtml={tool.instructions_html}
                            pdfAvailable={tool.instruction_pdf_available}
                            pdfUrl={tool.instruction_pdf_available ? publicApi.getInstructionPdfUrl(tool.id) : undefined}
                            onViewPdf={() => window.open(publicApi.getInstructionPdfUrl(tool.id), '_blank')}
                        />
                        <ToolIssueReportCard toolId={tool.id} />
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <ToolSidebar tool={tool} />
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
}
