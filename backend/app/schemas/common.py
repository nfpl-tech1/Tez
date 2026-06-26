"""
Common Schemas

Shared Pydantic models used across multiple routers.
Following DRY principle - these were previously duplicated in admin.py and team.py.
"""

from pydantic import BaseModel, EmailStr
from typing import Optional


class DepartmentResponse(BaseModel):
    """Department response model - used by both admin and team APIs."""
    id: int
    name: str
    description: Optional[str] = None
    tool_count: int = 0
    
    class Config:
        from_attributes = True


class NotificationResponse(BaseModel):
    """Notification response model - used by both admin and team APIs."""
    id: int
    message: str
    type: str
    tool_id: Optional[int] = None
    is_read: bool
    time_ago: str


class AdminNotificationResponse(NotificationResponse):
    """Extended notification for admin with tool status."""
    tool_status: Optional[str] = None
    
    class Config:
        from_attributes = True


class ProfileUpdate(BaseModel):
    """Profile update request model - used by both admin and team."""
    name: str
    username: str
    email: EmailStr
    password: Optional[str] = None


class ProfileResponse(BaseModel):
    """Basic profile response for team members."""
    id: int
    username: str
    email: str
    name: str
    
    class Config:
        from_attributes = True


class AdminProfileResponse(ProfileResponse):
    """Extended profile response for admin with role."""
    role: str
    
    class Config:
        from_attributes = True
