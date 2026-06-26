/**
 * API Module
 * 
 * Re-exports from modular API structure for backwards compatibility.
 */
export { api as default, authApi, adminApi, teamApi, publicApi } from './api/index';
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
} from './types';
