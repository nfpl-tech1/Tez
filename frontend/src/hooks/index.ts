/**
 * Custom Hooks
 * 
 * Barrel export for all custom hooks.
 */

// Form hooks
export { useToolForm, type ToolFormData } from './useToolForm';

// React Query hooks - Tools
export {
    useAdminAllTools,
    useAdminPendingTools,
    useAdminTool,
    useApproveTool,
    useRequestChanges,
    useAdminUpdateTool,
    useMyTools,
    useTeamTool,
    useCreateTool,
    useUpdateTool,
    useDeleteTool,
    usePublicTools,
    usePublicTool,
    toolKeys,
} from './useTools';

// React Query hooks - Departments
export {
    useAdminDepartments,
    useTeamDepartments,
    usePublicDepartments,
    useCreateDepartment,
    departmentKeys,
} from './useDepartments';
