"""
User Schemas

Pydantic models for user/team member requests and responses.
"""

from pydantic import BaseModel, EmailStr
from datetime import datetime


class TeamMemberCreate(BaseModel):
    """Request model for creating a new team member."""
    username: str
    email: EmailStr
    password: str
    name: str


class TeamMemberResponse(BaseModel):
    """Response model for team member data."""
    id: int
    username: str
    email: str
    name: str
    created_at: datetime
    
    class Config:
        from_attributes = True
