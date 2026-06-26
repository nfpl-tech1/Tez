"""
Centralized Pydantic Schemas

All request/response models are defined here to follow DRY principle.
Import from this module instead of defining inline in routers.
"""

from .common import (
    DepartmentResponse,
    NotificationResponse,
    ProfileUpdate,
    ProfileResponse,
    AdminProfileResponse,
)
from .tool import (
    ToolResponse,
    ToolReviewResponse,
    ToolStatusCounts,
    DashboardResponse,
    ToolEditRequest,
    RemarksRequest,
)
from .user import (
    TeamMemberCreate,
    TeamMemberResponse,
)
from .issue import (
    IssueResponse,
)

__all__ = [
    # Common
    "DepartmentResponse",
    "NotificationResponse", 
    "ProfileUpdate",
    "ProfileResponse",
    "AdminProfileResponse",
    # Tool
    "ToolResponse",
    "ToolReviewResponse",
    "ToolStatusCounts",
    "DashboardResponse",
    "ToolEditRequest",
    "RemarksRequest",
    # User
    "TeamMemberCreate",
    "TeamMemberResponse",
    # Issue
    "IssueResponse",
]
