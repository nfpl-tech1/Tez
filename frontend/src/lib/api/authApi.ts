/**
 * Auth API Module
 * 
 * API functions for authentication operations.
 */
import api from './axios';
import type { User } from '../types';

export const authApi = {
    login: async (usernameOrEmail: string, password: string) => {
        const response = await api.post('/auth/login', {
            username_or_email: usernameOrEmail,
            password,
        });
        return response.data;
    },

    logout: async () => {
        const response = await api.post('/auth/logout');
        return response.data;
    },

    getCurrentUser: async (): Promise<User | null> => {
        const response = await api.get('/auth/me');
        return response.data;
    },

    checkAuth: async () => {
        const response = await api.get('/auth/check');
        return response.data;
    },
};
