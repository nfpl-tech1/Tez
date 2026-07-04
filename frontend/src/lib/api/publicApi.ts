/**
 * Public API Module
 * 
 * API functions for public (unauthenticated) operations.
 */
import api from './axios';
import type { ToolDetail, Department, Subcategory } from '../types';

export const publicApi = {
    getTools: async (query?: string, departmentId?: number) => {
        const params = new URLSearchParams();
        if (query) params.append('q', query);
        if (departmentId) params.append('department', departmentId.toString());

        const response = await api.get(`/public/tools?${params.toString()}`);
        return response.data;
    },

    getToolDetail: async (id: number): Promise<ToolDetail> => {
        const response = await api.get(`/public/tools/${id}`);
        return response.data;
    },

    getDepartments: async (): Promise<Department[]> => {
        const response = await api.get('/public/departments');
        return response.data;
    },

    getSubcategories: async (): Promise<Subcategory[]> => {
        const response = await api.get('/public/subcategories');
        return response.data;
    },

    getStats: async () => {
        const response = await api.get('/public/stats');
        return response.data;
    },

    reportIssue: async (toolId: number, data: { name: string; email: string; description: string }) => {
        const response = await api.post(`/public/tools/${toolId}/issues`, data);
        return response.data;
    },

    getDownloadUrl: (id: number) => `/api/public/tools/${id}/download`,

    getInstructionPdfUrl: (id: number) => `/api/public/tools/${id}/instructions-pdf`,
};
