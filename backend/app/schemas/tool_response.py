"""
Tool Response Schemas

Pydantic models for tool API responses - shared across routers.
"""
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


def format_file_size(size: int) -> str:
    """Format file size in human-readable format."""
    if size < 1024:
        return f"{size} B"
    elif size < 1024 * 1024:
        return f"{size / 1024:.1f} KB"
    return f"{size / (1024 * 1024):.1f} MB"


class DepartmentResponse(BaseModel):
    """Department response model."""
    id: int
    name: str
    description: Optional[str] = None
    tool_count: int = 0
    
    class Config:
        from_attributes = True


class ToolListItem(BaseModel):
    """Minimal tool info for list views."""
    id: int
    name: str
    description: str
    file_size_display: str
    department_names: List[str]
    uploader_name: str
    download_count: int
    updated_at: datetime
    
    class Config:
        from_attributes = True


class ToolResponse(BaseModel):
    """Full tool response for team member views."""
    id: int
    name: str
    description: str
    instruction_type: str
    instructions: Optional[str] = None
    instruction_pdf_name: Optional[str] = None
    file_name: Optional[str] = None
    file_size: int = 0
    file_size_display: str = ""
    status: str
    admin_remarks: Optional[str] = None
    department_ids: List[int] = []
    department_names: List[str] = []
    can_edit: bool = False
    can_update_content: bool = False
    download_count: int = 0
    issue_count: int = 0
    open_issue_count: int = 0
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ToolDetail(BaseModel):
    """Detailed tool view for public pages."""
    id: int
    name: str
    description: str
    instruction_type: str
    instructions: Optional[str] = None
    instructions_html: Optional[str] = None
    instruction_pdf_available: bool = False
    file_name: Optional[str] = None
    file_size: int = 0
    file_size_display: str = ""
    department_names: List[str] = []
    uploader_name: str
    uploader_email: str
    download_count: int = 0
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True


class ToolsSearchResponse(BaseModel):
    """Response for tool search with filtering."""
    tools: List[ToolListItem]
    departments: List[DepartmentResponse]
    search_query: Optional[str] = None
    selected_department: Optional[int] = None
