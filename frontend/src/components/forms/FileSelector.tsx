import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FileText } from 'lucide-react';

interface FileSelectorProps {
    id: string;
    label: string;
    accept: string;
    file: File | null;
    onFileChange: (file: File | null) => void;
    disabled?: boolean;
    description?: string;
    maxSize?: string;
    fileIcon?: React.ReactNode;
}

export function FileSelector({
    id,
    label,
    accept,
    file,
    onFileChange,
    disabled = false,
    description,
    maxSize,
    fileIcon
}: FileSelectorProps) {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            onFileChange(selectedFile);
        }
    };

    return (
        <div className="space-y-2">
            <Label htmlFor={id}>{label}</Label>
            <div className={`border-2 border-dashed border-[hsl(var(--border))] rounded-xl p-6 text-center relative transition-colors ${disabled ? 'opacity-50 bg-[hsl(var(--muted))]' : 'hover:border-[hsl(var(--primary))]/50 hover:bg-[hsl(var(--muted))]/50'
                }`}>
                {file ? (
                    <div className="flex items-center justify-center gap-3">
                        {fileIcon || <FileText className="h-10 w-10 text-[hsl(var(--primary))]" />}
                        <div className="text-left">
                            <p className="font-medium truncate max-w-[200px]">{file.name}</p>
                            <p className="text-sm text-[hsl(var(--muted-foreground))]">
                                {(file.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                        </div>
                        {!disabled && (
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => onFileChange(null)}
                            >
                                Change
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="space-y-2">
                        <div className="h-12 w-12 rounded-full bg-[hsl(var(--muted))] flex items-center justify-center mx-auto">
                            {fileIcon || <FileText className="h-6 w-6 text-[hsl(var(--muted-foreground))]" />}
                        </div>
                        <p className="text-sm text-[hsl(var(--muted-foreground))]">
                            {description || 'Click to select or drag and drop'}
                        </p>
                        {maxSize && (
                            <p className="text-xs text-[hsl(var(--muted-foreground))]">
                                {maxSize}
                            </p>
                        )}
                    </div>
                )}
                {!disabled && (
                    <input
                        id={id}
                        type="file"
                        accept={accept}
                        onChange={handleChange}
                        className={file ? 'hidden' : 'absolute inset-0 opacity-0 cursor-pointer'}
                        style={file ? {} : { position: 'absolute', inset: 0 }}
                    />
                )}
            </div>
        </div>
    );
}
