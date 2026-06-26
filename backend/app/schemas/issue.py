"""
Issue Schemas

Pydantic models for issue-related requests and responses.
"""

from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class IssueResponse(BaseModel):
    """Response model for issue data."""
    id: int
    reporter_name: str
    reporter_email: str
    description: str
    is_resolved: bool
    status_display: str
    tool_id: int
    tool_name: str
    created_at: datetime
    resolved_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class IssueCreateRequest(BaseModel):
    """Request model for creating a new issue."""
    name: str
    email: str
    description: str
