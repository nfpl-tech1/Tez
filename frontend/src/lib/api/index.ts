/**
 * API Module Index
 * 
 * Re-exports all API modules for easy importing.
 */
export { default as api } from './axios';
export { authApi } from './authApi';
export { adminApi } from './adminApi';
export { teamApi } from './teamApi';
export { publicApi } from './publicApi';

// Re-export types for backwards compatibility
export type {
    User,
    Tool,
    ToolDetail,
    TeamMember,
    Department,
    Notification,
    Issue,
    ToolStatus,
    InstructionType,
    UserRole,
} from '../types';
