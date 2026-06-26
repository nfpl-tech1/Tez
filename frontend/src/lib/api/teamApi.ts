/**
 * Team API Module
 * 
 * API functions for team member operations.
 */
import api from './axios';
import type { Notification, Department, Tool, Issue } from '../types';

export const teamApi = {
    getDashboard: async () => {
        const response = await api.get('/team/dashboard');
        return response.data;
    },

    getNotifications: async (): Promise<Notification[]> => {
        const response = await api.get('/team/notifications');
        return response.data;
    },

    getDepartments: async (): Promise<Department[]> => {
        const response = await api.get('/team/departments');
        return response.data;
    },

    getTools: async (): Promise<Tool[]> => {
        const response = await api.get('/team/tools');
        return response.data;
    },

    getTool: async (id: number): Promise<Tool> => {
        const response = await api.get(`/team/tools/${id}`);
        return response.data;
    },

    createTool: async (formData: FormData) => {
        const response = await api.post('/team/tools', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    updateTool: async (id: number, formData: FormData) => {
        const response = await api.put(`/team/tools/${id}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    updateToolContent: async (id: number, formData: FormData) => {
        const response = await api.patch(`/team/tools/${id}/content`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    deleteTool: async (id: number) => {
        const response = await api.delete(`/team/tools/${id}`);
        return response.data;
    },

    getIssues: async (): Promise<Issue[]> => {
        const response = await api.get('/team/issues');
        return response.data;
    },

    getToolIssues: async (toolId: number): Promise<Issue[]> => {
        const response = await api.get(`/team/tools/${toolId}/issues`);
        return response.data;
    },

    resolveIssue: async (issueId: number) => {
        const response = await api.post(`/team/issues/${issueId}/resolve`);
        return response.data;
    },

    getProfile: async () => {
        const response = await api.get('/team/profile');
        return response.data;
    },

    updateProfile: async (data: { name: string; username: string; email: string; password?: string }) => {
        const response = await api.put('/team/profile', data);
        return response.data;
    },

    markNotificationRead: async (id: number) => {
        const response = await api.post(`/team/notifications/${id}/read`);
        return response.data;
    },

    markAllNotificationsRead: async () => {
        const response = await api.post('/team/notifications/mark-all-read');
        return response.data;
    },
};
