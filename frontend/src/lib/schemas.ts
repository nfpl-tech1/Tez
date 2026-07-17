/**
 * Zod Validation Schemas
 * 
 * Centralized validation schemas for forms.
 */

import { z } from 'zod';
import { VALIDATION_MESSAGES } from './constants';

// ============================================================================
// Tool Schemas
// ============================================================================

export const toolFormSchema = z.object({
    name: z.string()
        .min(1, VALIDATION_MESSAGES.REQUIRED.NAME)
        .min(3, 'Tool name must be at least 3 characters'),
    description: z.string()
        .min(1, VALIDATION_MESSAGES.REQUIRED.DESCRIPTION)
        .min(10, 'Description must be at least 10 characters'),
    instructionType: z.enum(['markdown', 'pdf']),
    instructions: z.string().optional(),
    selectedDepartments: z.array(z.number())
        .min(1, VALIDATION_MESSAGES.REQUIRED.DEPARTMENT),
    selectedSubcategories: z.array(z.number()),
    github_url: z.string()
        .optional()
        .or(z.literal(''))
        .refine(
            (val) => {
                if (!val) return true;
                try {
                    const url = new URL(val);
                    return url.hostname === 'github.com' || url.hostname === 'www.github.com';
                } catch {
                    return false;
                }
            },
            { message: VALIDATION_MESSAGES.INVALID.GITHUB_URL_INVALID }
        ),
});

export type ToolFormValues = z.infer<typeof toolFormSchema>;

// Conditional validation for instructions based on type
export const toolSubmitSchema = toolFormSchema.refine(
    (data) => {
        if (data.instructionType === 'markdown') {
            return data.instructions && data.instructions.trim().length > 0;
        }
        return true;
    },
    {
        message: VALIDATION_MESSAGES.REQUIRED.INSTRUCTIONS,
        path: ['instructions'],
    }
);

// ============================================================================
// Profile Schemas
// ============================================================================

export const profileSchema = z.object({
    name: z.string()
        .min(1, 'Name is required')
        .min(2, 'Name must be at least 2 characters'),
    username: z.string()
        .min(1, 'Username is required')
        .min(3, 'Username must be at least 3 characters')
        .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    email: z.string()
        .min(1, 'Email is required')
        .email(VALIDATION_MESSAGES.INVALID.EMAIL),
    password: z.string()
        .optional()
        .refine(
            (val) => !val || val.length >= 6,
            { message: 'Password must be at least 6 characters' }
        ),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

// ============================================================================
// Auth Schemas  
// ============================================================================

export const loginSchema = z.object({
    username: z.string().min(1, 'Username is required'),
    password: z.string().min(1, 'Password is required'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

// ============================================================================
// Team Member Schemas
// ============================================================================

export const teamMemberSchema = z.object({
    username: z.string()
        .min(3, 'Username must be at least 3 characters')
        .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    email: z.string().email('Invalid email address'),
    name: z.string().min(2, 'Name must be at least 2 characters'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type TeamMemberFormValues = z.infer<typeof teamMemberSchema>;

// ============================================================================
// Department Schemas
// ============================================================================

export const departmentSchema = z.object({
    name: z.string()
        .min(2, 'Department name must be at least 2 characters')
        .max(50, 'Department name must be at most 50 characters'),
    description: z.string().optional(),
});

export type DepartmentFormValues = z.infer<typeof departmentSchema>;

// ============================================================================
// Issue Report Schema
// ============================================================================

export const issueReportSchema = z.object({
    reporter_name: z.string().min(2, 'Name must be at least 2 characters'),
    reporter_email: z.string().email('Invalid email address'),
    description: z.string()
        .min(10, 'Description must be at least 10 characters')
        .max(1000, 'Description must be at most 1000 characters'),
});

export type IssueReportFormValues = z.infer<typeof issueReportSchema>;
