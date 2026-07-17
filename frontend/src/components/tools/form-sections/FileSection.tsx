import { Card, CardContent } from '@/components/ui/card';
import { Upload, Package, FileText } from 'lucide-react';
import { FileSelector } from '@/components/forms';

interface FileSectionProps {
    file: File | null;
    onFileChange: (file: File | null) => void;
    disabled?: boolean;
    // Current file info (for edit mode)
    currentFileName?: string;
    currentFileSize?: number;
    currentFileSizeDisplay?: string;
    error?: string;
}

export function FileSection({
    file,
    onFileChange,
    disabled,
    currentFileName,
    currentFileSizeDisplay,
    error
}: FileSectionProps) {
    return (
        <Card className="border-2 border-dashed border-[hsl(var(--primary))]/30">
            <CardContent className="p-6">
                <h3 className="font-semibold text-lg flex items-center gap-2 pb-4 border-b border-[hsl(var(--border))] mb-4">
                    <Upload className="h-5 w-5 text-[hsl(var(--primary))]" />
                    Tool File (.exe, .zip) <span className="text-red-500">*</span>
                </h3>

                {currentFileName && (
                    <div className="flex items-center gap-4 p-4 bg-[hsl(var(--muted))] rounded-xl mb-4">
                        <div className="h-12 w-12 rounded-xl bg-[hsl(var(--primary))]/10 flex items-center justify-center">
                            <FileText className="h-6 w-6 text-[hsl(var(--primary))]" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{currentFileName}</p>
                            {currentFileSizeDisplay && (
                                <p className="text-sm text-[hsl(var(--muted-foreground))]">{currentFileSizeDisplay}</p>
                            )}
                        </div>
                    </div>
                )}

                <FileSelector
                    id="file"
                    label={currentFileName ? "Replace with New File" : ""}
                    accept=".exe,.zip"
                    file={file}
                    onFileChange={onFileChange}
                    disabled={disabled}
                    description="Click to select or drag and drop"
                    maxSize="Only .exe or .zip files up to 150MB"
                    fileIcon={<Package className="h-10 w-10 text-[hsl(var(--primary))]" />}
                    error={error}
                />
            </CardContent>
        </Card>
    );
}
