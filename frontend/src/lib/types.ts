/**
 * Centralized TypeScript Types
 * 
 * All shared type definitions for the application.
 * Following DRY principle - single source of truth for types.
 */

// ============================================================================
// User Types
// ============================================================================

export type UserRole = 'admin' | 'team_member';

export interface User {
    id: number;
    username: string;
    email: string;
    name: string;
    role: UserRole;
}

export interface ProfileData {
    name: string;
    username: string;
    email: string;
    role?: string;
}

export interface TeamMember {
    id: number;
    username: string;
    email: string;
    name: string;
    created_at: string;
}

// ============================================================================
// Tool Types
// ============================================================================

export type ToolStatus = 'draft' | 'pending' | 'approved' | 'changes_requested';
export type InstructionType = 'markdown' | 'pdf';

export interface Tool {
    id: number;
    name: string;
    description: string;
    instruction_type: InstructionType;
    instructions: string | null;
    instruction_pdf_name: string | null;
    file_name: string | null;
    file_size: number;
    file_size_display: string;
    status: ToolStatus;
    status_display: string;
    status_color: string;
    admin_remarks: string | null;
    department_ids: number[];
    department_names: string[];
    subcategory_ids?: number[];
    subcategory_names: string[];
    github_url: string | null;
    can_edit: boolean;
    can_update_content: boolean;
    download_count: number;
    issue_count: number;
    open_issue_count: number;
    created_at: string;
    updated_at: string;
}

export interface ToolDetail {
    id: number;
    name: string;
    description: string;
    instruction_type: InstructionType;
    instructions: string | null;
    instructions_html: string | null;
    instruction_pdf_available: boolean;
    file_name: string | null;
    file_size: number;
    file_size_display: string;
    department_names: string[];
    subcategory_names: string[];
    github_url: string | null;
    uploader_name: string;
    uploader_email: string;
    download_count: number;
    created_at: string;
    updated_at: string;
}

export interface ToolReview {
    id: number;
    name: string;
    description: string;
    instruction_type: InstructionType;
    instructions: string | null;
    instruction_pdf_name: string | null;
    instruction_pdf_available: boolean;
    file_name: string | null;
    file_size: number;
    status: ToolStatus;
    created_at: string;
    updated_at: string;
    uploader_name: string;
    uploader_email: string;
    department_ids: number[];
    department_names: string[];
    subcategory_ids: number[];
    subcategory_names: string[];
    github_url: string | null;
    download_count: number;
}

// ============================================================================
// Department Types
// ============================================================================

export interface Department {
    id: number;
    name: string;
    description: string | null;
    tool_count?: number;
}

export interface Subcategory {
    id: number;
    name: string;
    department_id: number;
    sort_order?: number;
}

// ============================================================================
// Notification Types
// ============================================================================

export type NotificationType =
    | 'new_submission'
    | 'tool_approved'
    | 'changes_requested'
    | 'tool_resubmitted';

export interface Notification {
    id: number;
    message: string;
    type: NotificationType | string;
    tool_id: number | null;
    tool_status: ToolStatus | null;
    is_read: boolean;
    time_ago: string;
}

// ============================================================================
// Issue Types
// ============================================================================

export interface Issue {
    id: number;
    reporter_name: string;
    reporter_email: string;
    description: string;
    is_resolved: boolean;
    status_display: string;
    tool_id: number;
    tool_name: string;
    created_at: string;
    resolved_at: string | null;
}

// ============================================================================
// Dashboard Types
// ============================================================================

export interface DashboardStats {
    pending_count: number;
    team_member_count: number;
    total_tools: number;
    total_downloads: number;
}

export interface ToolStatusCounts {
    draft: number;
    pending: number;
    approved: number;
    changes_requested: number;
}

export interface TeamDashboard {
    tools: Tool[];
    status_counts: ToolStatusCounts;
}

// ============================================================================
// Form Types
// ============================================================================

export interface ProfileFormData {
    name: string;
    username: string;
    email: string;
    password?: string;
}

export interface ToolFormData {
    name: string;
    description: string;
    instructions: string;
    instructionType: InstructionType;
    selectedDepartments: number[];
    selectedSubcategories: number[];
    github_url?: string;
}

export interface TeamMemberFormData {
    username: string;
    email: string;
    password: string;
    name: string;
}

// ============================================================================
// API Response Types
// ============================================================================

export interface ApiSuccessResponse {
    success: boolean;
    message?: string;
}

export interface UnreadCountResponse {
    count: number;
}
