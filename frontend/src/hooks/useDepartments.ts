/**
 * React Query Hooks for Departments
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { adminApi, teamApi, publicApi } from '@/lib/api';
import { showToast } from '@/components/ui/toaster';

export const departmentKeys = {
    all: ['departments'] as const,
    admin: () => [...departmentKeys.all, 'admin'] as const,
    team: () => [...departmentKeys.all, 'team'] as const,
    public: () => [...departmentKeys.all, 'public'] as const,
};

export function useAdminDepartments() {
    return useQuery({
        queryKey: departmentKeys.admin(),
        queryFn: () => adminApi.getDepartments(),
    });
}

export function useTeamDepartments() {
    return useQuery({
        queryKey: departmentKeys.team(),
        queryFn: () => teamApi.getDepartments(),
    });
}

export function usePublicDepartments() {
    return useQuery({
        queryKey: departmentKeys.public(),
        queryFn: () => publicApi.getDepartments(),
    });
}

export function useSubcategories() {
    return useQuery({
        queryKey: ['subcategories'] as const,
        queryFn: () => publicApi.getSubcategories(),
    });
}

export function useCreateDepartment() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { name: string; description?: string }) =>
            adminApi.createDepartment(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: departmentKeys.all });
            showToast.success('Department created');
        },
        onError: (error: Error) => {
            showToast.error('Failed to create department', error.message);
        },
    });
}

export function useCreateSubcategory() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: { name: string; department_id: number }) =>
            teamApi.createSubcategory(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['subcategories'] });
            showToast.success('Subcategory created');
        },
        onError: (error: any) => {
            const errorMsg = error.response?.data?.detail || error.message || 'Failed to create subcategory';
            showToast.error(errorMsg);
        },
    });
}
