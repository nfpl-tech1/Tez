/**
 * Tool Form Action Buttons
 * 
 * Reusable action button component for tool forms.
 */
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Save, Send, X } from 'lucide-react';

interface ToolFormActionsProps {
    onSubmit: () => void;
    onSaveDraft: () => void;
    onCancel: () => void;
    isSubmitting: boolean;
    isSavingDraft: boolean;
    disabled?: boolean;
}

export function ToolFormActions({
    onSubmit,
    onSaveDraft,
    onCancel,
    isSubmitting,
    isSavingDraft,
    disabled = false,
}: ToolFormActionsProps) {
    const isDisabled = isSubmitting || isSavingDraft || disabled;

    return (
        <Card>
            <CardContent className="p-6 space-y-3">
                <Button type="button" onClick={onSubmit} disabled={isDisabled} className="w-full h-12">
                    {isSubmitting ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : <Send className="h-5 w-5 mr-2" />}
                    Submit for Review
                </Button>
                <Button type="button" variant="outline" onClick={onSaveDraft} disabled={isDisabled} className="w-full h-12">
                    {isSavingDraft ? <Loader2 className="h-5 w-5 mr-2 animate-spin" /> : <Save className="h-5 w-5 mr-2" />}
                    Save as Draft
                </Button>
                <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting || isSavingDraft} className="w-full">
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                </Button>
            </CardContent>
        </Card>
    );
}

interface SuccessOverlayProps {
    message: string;
    subMessage?: string;
}

export function SuccessOverlay({ message, subMessage }: SuccessOverlayProps) {
    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="max-w-md w-full mx-4 shadow-2xl">
                <CardContent className="p-8 text-center">
                    <div className="h-20 w-20 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4 border border-green-200">
                        <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-green-800 mb-2">{message}</h3>
                    {subMessage && <p className="text-muted-foreground">{subMessage}</p>}
                </CardContent>
            </Card>
        </div>
    );
}
