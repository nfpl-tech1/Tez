/**
 * React Query Hooks for Tools
 * 
 * Provides data fetching and mutation hooks for tool operations.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi, teamApi, publicApi } from '@/lib/api';
import { showToast } from '@/components/ui/toaster';

// ============================================================================
// Query Keys
// ============================================================================

export const toolKeys = {
    all: ['tools'] as const,
    lists: () => [...toolKeys.all, 'list'] as const,
    list: (filters: Record<string, unknown>) => [...toolKeys.lists(), filters] as const,
    details: () => [...toolKeys.all, 'detail'] as const,
    detail: (id: number) => [...toolKeys.details(), id] as const,
    pending: () => [...toolKeys.all, 'pending'] as const,
    myTools: () => [...toolKeys.all, 'my'] as const,
    public: () => [...toolKeys.all, 'public'] as const,
};

// ============================================================================
// Admin Hooks
// ============================================================================

export function useAdminAllTools() {
    return useQuery({
        queryKey: toolKeys.lists(),
        queryFn: () => adminApi.getAllTools(),
    });
}

export function useAdminPendingTools() {
    return useQuery({
        queryKey: toolKeys.pending(),
        queryFn: () => adminApi.getPendingTools(),
    });
}

export function useAdminTool(id: number) {
    return useQuery({
        queryKey: toolKeys.detail(id),
        queryFn: () => adminApi.getToolForReview(id),
        enabled: id > 0,
    });
}

export function useApproveTool() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => adminApi.approveTool(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: toolKeys.all });
            showToast.success('Tool approved', 'The tool is now available for download');
        },
        onError: (error: Error) => {
            showToast.error('Failed to approve tool', error.message);
        },
    });
}

export function useRequestChanges() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, remarks }: { id: number; remarks: string }) =>
            adminApi.requestChanges(id, remarks),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: toolKeys.all });
            showToast.success('Changes requested', 'The uploader has been notified');
        },
        onError: (error: Error) => {
            showToast.error('Failed to request changes', error.message);
        },
    });
}

export function useAdminUpdateTool() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: { name: string; description: string; instructions?: string; department_ids: number[] } }) =>
            adminApi.updateTool(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: toolKeys.detail(variables.id) });
            queryClient.invalidateQueries({ queryKey: toolKeys.lists() });
            showToast.success('Tool updated', 'Changes saved successfully');
        },
        onError: (error: Error) => {
            showToast.error('Failed to update tool', error.message);
        },
    });
}

// ============================================================================
// Team Hooks
// ============================================================================

export function useMyTools() {
    return useQuery({
        queryKey: toolKeys.myTools(),
        queryFn: async () => {
            const dashboard = await teamApi.getDashboard();
            return dashboard.tools;
        },
    });
}

export function useTeamTool(id: number) {
    return useQuery({
        queryKey: toolKeys.detail(id),
        queryFn: () => teamApi.getTool(id),
        enabled: id > 0,
    });
}

export function useCreateTool() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (formData: FormData) => teamApi.createTool(formData),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: toolKeys.myTools() });
            const isDraft = variables.get('save_as_draft') === 'true';
            showToast.success(
                isDraft ? 'Draft saved' : 'Tool submitted',
                isDraft ? 'You can continue editing later' : 'Your tool is now pending review'
            );
        },
        onError: (error: Error) => {
            showToast.error('Failed to create tool', error.message);
        },
    });
}

export function useUpdateTool() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, formData }: { id: number; formData: FormData }) =>
            teamApi.updateTool(id, formData),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: toolKeys.detail(variables.id) });
            queryClient.invalidateQueries({ queryKey: toolKeys.myTools() });
            const isDraft = variables.formData.get('save_as_draft') === 'true';
            showToast.success(
                isDraft ? 'Draft saved' : 'Tool updated',
                isDraft ? 'You can continue editing later' : 'Your changes are pending review'
            );
        },
        onError: (error: Error) => {
            showToast.error('Failed to update tool', error.message);
        },
    });
}

export function useDeleteTool() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: number) => teamApi.deleteTool(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: toolKeys.myTools() });
            showToast.success('Tool deleted');
        },
        onError: (error: Error) => {
            showToast.error('Failed to delete tool', error.message);
        },
    });
}

// ============================================================================
// Public Hooks
// ============================================================================

export function usePublicTools() {
    return useQuery({
        queryKey: toolKeys.public(),
        queryFn: () => publicApi.getTools(),
    });
}

export function usePublicTool(id: number) {
    return useQuery({
        queryKey: [...toolKeys.public(), id],
        queryFn: () => publicApi.getToolDetail(id),
        enabled: id > 0,
    });
}
