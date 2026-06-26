"""
Tool Schemas

Pydantic models for tool-related requests and responses.
"""

from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


class ToolResponse(BaseModel):
    """Team member tool response with full details."""
    id: int
    name: str
    description: str
    instruction_type: str
    instructions: Optional[str] = None
    instruction_pdf_name: Optional[str] = None
    file_name: Optional[str] = None
    file_size: int
    file_size_display: str
    status: str
    status_display: str
    status_color: str
    admin_remarks: Optional[str] = None
    department_ids: List[int]
    department_names: List[str]
    can_edit: bool
    can_update_content: bool
    download_count: int
    issue_count: int
    open_issue_count: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class ToolReviewResponse(BaseModel):
    """Admin tool review response with uploader info."""
    id: int
    name: str
    description: str
    instruction_type: str
    instructions: Optional[str] = None
    instruction_pdf_name: Optional[str] = None
    instruction_pdf_available: bool = False
    file_name: Optional[str] = None
    file_size: int
    status: str
    created_at: datetime
    updated_at: datetime
    uploader_name: str
    uploader_email: str
    department_names: List[str]
    download_count: int = 0
    
    class Config:
        from_attributes = True


class ToolStatusCounts(BaseModel):
    """Status counts for dashboard display."""
    draft: int
    pending: int
    approved: int
    changes_requested: int


class DashboardResponse(BaseModel):
    """Team dashboard response with tools and status counts."""
    tools: List[ToolResponse]
    status_counts: ToolStatusCounts


class ToolEditRequest(BaseModel):
    """Admin tool edit request."""
    name: str
    description: str
    instructions: Optional[str] = None
    department_ids: List[int] = []


class RemarksRequest(BaseModel):
    """Request changes with remarks."""
    remarks: str
