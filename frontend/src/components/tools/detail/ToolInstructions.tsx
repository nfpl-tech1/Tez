import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Maximize2 } from 'lucide-react';
import { useState } from 'react';

interface ToolInstructionsProps {
    instructionType?: string;
    instructionsHtml?: string | null;
    pdfAvailable?: boolean;
    pdfUrl?: string;
    onViewPdf?: () => void;
}

export function ToolInstructions({
    instructionsHtml,
    pdfAvailable,
    pdfUrl,
    onViewPdf
}: ToolInstructionsProps) {
    const [showPdfFullscreen, setShowPdfFullscreen] = useState(false);

    const hasMarkdown = instructionsHtml && instructionsHtml.trim().length > 0;
    const hasPdf = pdfAvailable && pdfUrl;

    // Show both if both exist, otherwise show what's available
    const showMarkdownSection = hasMarkdown;
    const showPdfSection = hasPdf;

    return (
        <Card>
            <CardHeader className="border-b border-[hsl(var(--border))]">
                <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-[hsl(var(--primary))]" />
                    Instructions
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
                {/* Markdown Instructions */}
                {showMarkdownSection && (
                    <div
                        className="markdown-content prose prose-sm max-w-none prose-headings:text-[hsl(var(--foreground))] prose-p:text-[hsl(var(--muted-foreground))] prose-li:text-[hsl(var(--muted-foreground))]"
                        dangerouslySetInnerHTML={{ __html: instructionsHtml! }}
                    />
                )}

                {/* Separator if both exist */}
                {showMarkdownSection && showPdfSection && (
                    <div className="border-t border-[hsl(var(--border))] pt-6">
                        <h4 className="font-semibold mb-4 flex items-center gap-2">
                            <FileText className="h-4 w-4 text-red-600" />
                            PDF Document
                        </h4>
                    </div>
                )}

                {/* PDF Section with embedded viewer */}
                {showPdfSection && (
                    <div className="space-y-3">
                        {!showMarkdownSection && (
                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                                <FileText className="h-4 w-4 text-red-600" />
                                PDF Instructions
                            </h4>
                        )}

                        {/* Embedded PDF Viewer */}
                        <div className="border border-[hsl(var(--border))] rounded-lg overflow-hidden bg-gray-100">
                            <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-b border-[hsl(var(--border))]">
                                <span className="text-sm font-medium text-gray-600">PDF Preview</span>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setShowPdfFullscreen(true)}
                                    >
                                        <Maximize2 className="h-4 w-4 mr-1" />
                                        Fullscreen
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={onViewPdf}
                                    >
                                        <Download className="h-4 w-4 mr-1" />
                                        Download
                                    </Button>
                                </div>
                            </div>
                            <iframe
                                src={pdfUrl}
                                className="w-full h-[500px]"
                                title="PDF Instructions"
                            />
                        </div>
                    </div>
                )}

                {/* No instructions */}
                {!showMarkdownSection && !showPdfSection && (
                    <div className="text-center py-8">
                        <FileText className="h-12 w-12 mx-auto text-[hsl(var(--muted-foreground))]/50 mb-3" />
                        <p className="text-[hsl(var(--muted-foreground))]">
                            No instructions provided for this tool.
                        </p>
                    </div>
                )}

                {/* Fullscreen PDF Modal */}
                {showPdfFullscreen && pdfUrl && (
                    <div
                        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
                        onClick={() => setShowPdfFullscreen(false)}
                    >
                        <div
                            className="bg-white rounded-lg w-full max-w-6xl h-[90vh] flex flex-col"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between px-4 py-3 border-b">
                                <span className="font-semibold">PDF Instructions</span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setShowPdfFullscreen(false)}
                                >
                                    Close
                                </Button>
                            </div>
                            <iframe
                                src={pdfUrl}
                                className="flex-1 w-full"
                                title="PDF Instructions Fullscreen"
                            />
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
