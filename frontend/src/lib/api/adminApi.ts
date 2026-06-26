/**
 * Admin API Module
 * 
 * API functions for admin-related operations.
 */
import api from './axios';
import type { Notification, TeamMember, Department, Tool } from '../types';

export const adminApi = {
    getDashboard: async () => {
        const response = await api.get('/admin/dashboard');
        return response.data;
    },

    getProfile: async () => {
        const response = await api.get('/admin/profile');
        return response.data;
    },

    updateProfile: async (data: { name: string; username: string; email: string; password?: string }) => {
        const response = await api.put('/admin/profile', data);
        return response.data;
    },

    getNotifications: async (): Promise<Notification[]> => {
        const response = await api.get('/admin/notifications');
        return response.data;
    },

    getUnreadCount: async () => {
        const response = await api.get('/admin/notifications/unread-count');
        return response.data;
    },

    markNotificationRead: async (id: number) => {
        const response = await api.post(`/admin/notifications/${id}/read`);
        return response.data;
    },

    markAllNotificationsRead: async () => {
        const response = await api.post('/admin/notifications/read-all');
        return response.data;
    },

    getTeamMembers: async (): Promise<TeamMember[]> => {
        const response = await api.get('/admin/team-members');
        return response.data;
    },

    addTeamMember: async (data: { username: string; email: string; password: string; name: string }) => {
        const response = await api.post('/admin/team-members', data);
        return response.data;
    },

    deleteTeamMember: async (id: number) => {
        const response = await api.delete(`/admin/team-members/${id}`);
        return response.data;
    },

    getAllTools: async () => {
        const response = await api.get('/admin/tools');
        return response.data;
    },

    getPendingTools: async (): Promise<Tool[]> => {
        const response = await api.get('/admin/tools/pending');
        return response.data;
    },

    getToolForReview: async (id: number) => {
        const response = await api.get(`/admin/tools/${id}`);
        return response.data;
    },

    updateTool: async (id: number, data: { name: string; description: string; instructions?: string; department_ids: number[] }) => {
        const response = await api.put(`/admin/tools/${id}`, data);
        return response.data;
    },

    approveTool: async (id: number) => {
        const response = await api.post(`/admin/tools/${id}/approve`);
        return response.data;
    },

    requestChanges: async (id: number, remarks: string) => {
        const response = await api.post(`/admin/tools/${id}/request-changes`, { remarks });
        return response.data;
    },

    getDepartments: async (): Promise<Department[]> => {
        const response = await api.get('/admin/departments');
        return response.data;
    },

    createDepartment: async (data: { name: string; description?: string }) => {
        const response = await api.post('/admin/departments', data);
        return response.data;
    },

    getInstructionPdfUrl: (id: number) => `/api/admin/tools/${id}/instructions-pdf`,
};
