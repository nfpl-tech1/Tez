/**
 * Toast Notifications
 * 
 * Wrapper around sonner for consistent toast styling.
 */

import { Toaster as SonnerToaster, toast } from 'sonner';

/**
 * Toast container component - add to app root
 */
export function Toaster() {
    return (
        <SonnerToaster
            position="bottom-right"
            toastOptions={{
                duration: 4000,
                className: 'font-sans',
                style: {
                    background: 'hsl(var(--background))',
                    color: 'hsl(var(--foreground))',
                    border: '1px solid hsl(var(--border))',
                },
            }}
            closeButton
            richColors
        />
    );
}

/**
 * Toast API for easy use throughout the app
 */
export const showToast = {
    success: (message: string, description?: string) => {
        toast.success(message, { description });
    },
    error: (message: string, description?: string) => {
        toast.error(message, { description });
    },
    info: (message: string, description?: string) => {
        toast.info(message, { description });
    },
    warning: (message: string, description?: string) => {
        toast.warning(message, { description });
    },
    loading: (message: string) => {
        return toast.loading(message);
    },
    dismiss: (toastId?: string | number) => {
        toast.dismiss(toastId);
    },
    promise: <T,>(
        promise: Promise<T>,
        messages: {
            loading: string;
            success: string | ((data: T) => string);
            error: string | ((error: Error) => string);
        }
    ) => {
        return toast.promise(promise, messages);
    },
};

export { toast };
