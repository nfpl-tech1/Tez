import { type UseFormRegister, type FieldErrors, type UseFormWatch, type UseFormSetValue } from 'react-hook-form';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FileText, Info, AlertCircle } from 'lucide-react';
import type { ToolFormValues } from '@/lib/schemas';
import { cn } from '@/lib/utils';
import { FileSelector } from '@/components/forms';

interface InstructionsSectionProps {
    register: UseFormRegister<ToolFormValues>;
    errors: FieldErrors<ToolFormValues>;
    watch: UseFormWatch<ToolFormValues>;
    setValue: UseFormSetValue<ToolFormValues>;
    disabled?: boolean;
    // PDF handling
    pdfFile: File | null;
    onPdfChange: (file: File | null) => void;
    currentPdfName?: string | null;
}

export function InstructionsSection({
    register,
    errors,
    watch,
    disabled,
    pdfFile,
    onPdfChange,
    currentPdfName
}: InstructionsSectionProps) {
    const instructions = watch('instructions');
    const hasPdf = pdfFile || currentPdfName;
    const hasMarkdown = instructions && instructions.trim().length > 0;

    // Validation: at least one must be provided
    const showValidationError = !hasMarkdown && !hasPdf && errors.instructions;

    return (
        <Card>
            <CardContent className="p-6 space-y-6">
                <div>
                    <h3 className="font-semibold text-lg flex items-center gap-2 pb-2 border-b border-[hsl(var(--border))]">
                        <FileText className="h-5 w-5 text-[hsl(var(--primary))]" />
                        Instructions
                    </h3>
                    <p className="text-sm text-[hsl(var(--muted-foreground))] mt-2">
                        Provide at least one: markdown instructions, PDF document, or both.
                    </p>
                </div>

                {/* Markdown Instructions */}
                <div className="space-y-2">
                    <Label htmlFor="instructions" className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Markdown Instructions {!hasPdf && <span className="text-red-500">*</span>}
                    </Label>
                    <Textarea
                        id="instructions"
                        {...register('instructions')}
                        disabled={disabled}
                        placeholder="# How to Use&#10;&#10;1. Download the tool&#10;2. Run the .exe file&#10;3. ..."
                        rows={10}
                        className={cn("font-mono text-sm", showValidationError && 'border-destructive')}
                    />
                    <p className="text-xs text-[hsl(var(--muted-foreground))] flex items-center gap-1">
                        <Info className="h-3 w-3" />
                        Supports Markdown: headers, lists, code blocks, links, etc.
                    </p>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-4">
                    <div className="flex-1 border-t border-[hsl(var(--border))]"></div>
                    <span className="text-sm text-[hsl(var(--muted-foreground))] font-medium">AND / OR</span>
                    <div className="flex-1 border-t border-[hsl(var(--border))]"></div>
                </div>

                {/* PDF Upload */}
                <div className="space-y-4">
                    <Label className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        PDF Instructions {!hasMarkdown && <span className="text-red-500">*</span>}
                    </Label>

                    {currentPdfName && !pdfFile && (
                        <div className="flex items-center gap-4 p-4 bg-red-50 rounded-xl border border-red-100">
                            <FileText className="h-10 w-10 text-red-500" />
                            <div>
                                <p className="font-medium">Current PDF: {currentPdfName}</p>
                                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                                    Upload a new PDF to replace it, or leave as is
                                </p>
                            </div>
                        </div>
                    )}

                    <FileSelector
                        id="pdfFile"
                        label={pdfFile ? "New Instructions PDF" : currentPdfName ? "Replace PDF" : "Upload Instructions PDF"}
                        accept=".pdf"
                        file={pdfFile}
                        onFileChange={onPdfChange}
                        disabled={disabled}
                        description="Click to select a PDF file"
                        maxSize="Only .pdf files up to 50MB"
                        fileIcon={<FileText className="h-10 w-10 text-red-500" />}
                    />
                </div>

                {/* Validation Error */}
                {showValidationError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-destructive flex items-center gap-1">
                            <AlertCircle className="h-4 w-4" />
                            Please provide at least one: markdown instructions or PDF document
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
