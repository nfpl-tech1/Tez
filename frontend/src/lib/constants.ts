/**
 * Centralized Constants
 * 
 * Single source of truth for status configurations, route paths,
 * and other constant values used across the application.
 * Following DRY and Convention over Configuration principles.
 */

import {
    FileText,
    Clock,
    Check,
    AlertCircle,
    type LucideIcon
} from 'lucide-react';
import type { ToolStatus } from './types';

// ============================================================================
// Status Configuration
// ============================================================================

export interface StatusConfig {
    /** Display label for the status */
    label: string;
    /** Icon component to display */
    icon: LucideIcon;
    /** Badge variant for shadcn Badge component */
    variant: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning' | 'pending';
    /** Tailwind text color class */
    textColor: string;
    /** Tailwind background color class */
    bgColor: string;
    /** Tailwind border color class */
    borderColor: string;
}

export const TOOL_STATUS_CONFIG: Record<ToolStatus, StatusConfig> = {
    draft: {
        label: 'Draft',
        icon: FileText,
        variant: 'secondary',
        textColor: 'text-gray-600',
        bgColor: 'bg-gray-100',
        borderColor: 'border-gray-200',
    },
    pending: {
        label: 'Pending Review',
        icon: Clock,
        variant: 'pending',
        textColor: 'text-amber-600',
        bgColor: 'bg-amber-100',
        borderColor: 'border-amber-200',
    },
    approved: {
        label: 'Approved',
        icon: Check,
        variant: 'success',
        textColor: 'text-green-600',
        bgColor: 'bg-green-100',
        borderColor: 'border-green-200',
    },
    changes_requested: {
        label: 'Changes Requested',
        icon: AlertCircle,
        variant: 'warning',
        textColor: 'text-orange-600',
        bgColor: 'bg-orange-100',
        borderColor: 'border-orange-200',
    },
} as const;

/**
 * Get status configuration for a given status string
 * Returns draft config as fallback for unknown statuses
 */
export function getStatusConfig(status: string): StatusConfig {
    return TOOL_STATUS_CONFIG[status as ToolStatus] ?? TOOL_STATUS_CONFIG.draft;
}

// ============================================================================
// Route Paths
// ============================================================================

export const ROUTES = {
    // Public routes
    HOME: '/',
    LOGIN: '/login',
    TOOLS: '/tools',
    TOOL_DETAIL: (id: number) => `/tools/${id}`,

    // Admin routes
    ADMIN: {
        DASHBOARD: '/admin/dashboard',
        TOOLS: '/admin/tools',
        TOOL_EDIT: (id: number) => `/admin/tools/${id}/edit`,
        TOOL_REVIEW: (id: number) => `/admin/tools/${id}/review`,
        PENDING: '/admin/tools/pending',
        TEAM_MEMBERS: '/admin/team-members',
        DEPARTMENTS: '/admin/departments',
        PROFILE: '/admin/profile',
    },

    // Team routes
    TEAM: {
        DASHBOARD: '/team/dashboard',
        TOOLS: '/team/tools',
        TOOL_NEW: '/team/tools/new',
        TOOL_EDIT: (id: number) => `/team/tools/${id}/edit`,
        ISSUES: '/team/issues',
        PROFILE: '/team/profile',
    },
} as const;

// ============================================================================
// File Configuration
// ============================================================================

export const FILE_CONFIG = {
    EXECUTABLE: {
        accept: '.exe',
        maxSizeMB: 150,
        maxSizeBytes: 150 * 1024 * 1024,
        description: 'Only .exe files up to 150MB',
    },
    PDF: {
        accept: '.pdf',
        maxSizeMB: 50,
        maxSizeBytes: 50 * 1024 * 1024,
        description: 'Only .pdf files up to 50MB',
    },
} as const;

// ============================================================================
// UI Configuration
// ============================================================================

export const UI_CONFIG = {
    /** Delay in ms before redirecting after success */
    SUCCESS_REDIRECT_DELAY: 1500,
    /** Delay in ms before redirecting after submission */
    SUBMISSION_REDIRECT_DELAY: 2000,
    /** Maximum notifications to display */
    MAX_NOTIFICATIONS: 10,
    /** Admin notifications limit */
    ADMIN_NOTIFICATIONS_LIMIT: 20,
} as const;

// ============================================================================
// Validation Messages
// ============================================================================

export const VALIDATION_MESSAGES = {
    REQUIRED: {
        NAME: 'Tool name is required',
        DESCRIPTION: 'Description is required',
        INSTRUCTIONS: 'Instructions are required',
        FILE: 'Please select an executable file to upload',
        PDF: 'Please upload a PDF file for instructions',
        DEPARTMENT: 'Please select at least one department',
        GITHUB_URL: 'GitHub URL is required for submission',
    },
    INVALID: {
        EXE_ONLY: 'Only .exe files are allowed',
        PDF_ONLY: 'Only .pdf files are allowed for instructions',
        EMAIL: 'Please enter a valid email address',
        GITHUB_URL_INVALID: 'Must be a valid GitHub URL (e.g., https://github.com/username/repo)',
    },
} as const;

// ============================================================================
// API Endpoints (relative paths)
// ============================================================================

export const API_ENDPOINTS = {
    AUTH: {
        LOGIN: '/auth/login',
        LOGOUT: '/auth/logout',
        ME: '/auth/me',
        CHECK: '/auth/check',
    },
    ADMIN: {
        DASHBOARD: '/admin/dashboard',
        PROFILE: '/admin/profile',
        NOTIFICATIONS: '/admin/notifications',
        UNREAD_COUNT: '/admin/notifications/unread-count',
        TEAM_MEMBERS: '/admin/team-members',
        TOOLS: '/admin/tools',
        PENDING_TOOLS: '/admin/tools/pending',
        DEPARTMENTS: '/admin/departments',
    },
    TEAM: {
        DASHBOARD: '/team/dashboard',
        NOTIFICATIONS: '/team/notifications',
        DEPARTMENTS: '/team/departments',
        TOOLS: '/team/tools',
        ISSUES: '/team/issues',
        PROFILE: '/team/profile',
    },
    PUBLIC: {
        TOOLS: '/public/tools',
        DEPARTMENTS: '/public/departments',
        STATS: '/public/stats',
    },
} as const;
