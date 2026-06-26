"""
Team Dashboard Routes

Dashboard and notification endpoints for team members.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, timezone

from ...database import get_db
from ...models.user import User
from ...models.tool import Tool
from ...models.department import Department
from ...models.notification import Notification
from ...models.issue import Issue
from .dependencies import require_team_member

router = APIRouter()


# Pydantic Models
class ToolStatusCounts(BaseModel):
    draft: int
    pending: int
    approved: int
    changes_requested: int


class ToolResponse(BaseModel):
    id: int
    name: str
    description: str
    instruction_type: str
    instructions: Optional[str]
    instruction_pdf_name: Optional[str]
    file_name: Optional[str]
    file_size: int
    file_size_display: str
    status: str
    admin_remarks: Optional[str]
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


class DashboardResponse(BaseModel):
    tools: List[ToolResponse]
    status_counts: ToolStatusCounts


class NotificationResponse(BaseModel):
    id: int
    message: str
    type: str
    tool_id: Optional[int]
    is_read: bool
    time_ago: str


class DepartmentResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]

    class Config:
        from_attributes = True


def _format_file_size(size: int) -> str:
    """Format file size in human-readable format."""
    if size < 1024:
        return f"{size} B"
    elif size < 1024 * 1024:
        return f"{size / 1024:.1f} KB"
    else:
        return f"{size / (1024 * 1024):.1f} MB"


def _format_time_ago(dt: datetime) -> str:
    """Format datetime as relative time string."""
    now = datetime.now(timezone.utc)
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    delta = now - dt
    
    if delta.days > 7:
        return dt.strftime('%b %d')
    elif delta.days > 0:
        return f"{delta.days}d ago"
    elif delta.seconds > 3600:
        return f"{delta.seconds // 3600}h ago"
    elif delta.seconds > 60:
        return f"{delta.seconds // 60}m ago"
    else:
        return "Just now"


def _tool_to_response(tool: Tool) -> ToolResponse:
    """Convert Tool model to ToolResponse."""
    issue_count = len(tool.issues) if hasattr(tool, 'issues') else 0
    open_issue_count = sum(1 for i in tool.issues if not i.is_resolved) if hasattr(tool, 'issues') else 0
    
    return ToolResponse(
        id=tool.id,
        name=tool.name,
        description=tool.description,
        instruction_type=tool.instruction_type or "markdown",
        instructions=tool.instructions,
        instruction_pdf_name=tool.instruction_pdf_name,
        file_name=tool.file_name,
        file_size=tool.file_size,
        file_size_display=_format_file_size(tool.file_size),
        status=tool.status,
        admin_remarks=tool.admin_remarks,
        department_ids=[d.id for d in tool.departments],
        department_names=[d.name for d in tool.departments],
        can_edit=tool.status in ('draft', 'changes_requested'),
        can_update_content=tool.status == 'approved',
        download_count=tool.download_count,
        issue_count=issue_count,
        open_issue_count=open_issue_count,
        created_at=tool.created_at,
        updated_at=tool.updated_at
    )


@router.get("/dashboard", response_model=DashboardResponse)
async def get_dashboard(
    db: Session = Depends(get_db),
    user_id: int = Depends(require_team_member)
):
    """Get team member dashboard data."""
    tools = db.query(Tool).filter(Tool.uploaded_by == user_id).all()
    
    # Calculate status counts
    status_counts = ToolStatusCounts(
        draft=sum(1 for t in tools if t.status == 'draft'),
        pending=sum(1 for t in tools if t.status == 'pending'),
        approved=sum(1 for t in tools if t.status == 'approved'),
        changes_requested=sum(1 for t in tools if t.status == 'changes_requested')
    )
    
    return DashboardResponse(
        tools=[_tool_to_response(t) for t in tools],
        status_counts=status_counts
    )


@router.get("/notifications")
async def get_notifications(
    db: Session = Depends(get_db),
    user_id: int = Depends(require_team_member)
):
    """Get team member notifications."""
    notifications = db.query(Notification).filter(
        Notification.user_id == user_id
    ).order_by(Notification.created_at.desc()).limit(10).all()
    
    return [
        NotificationResponse(
            id=n.id,
            message=n.message,
            type=n.type,
            tool_id=n.tool_id,
            is_read=n.is_read,
            time_ago=_format_time_ago(n.created_at)
        )
        for n in notifications
    ]


@router.get("/departments", response_model=List[DepartmentResponse])
async def get_departments(
    db: Session = Depends(get_db),
    _: int = Depends(require_team_member)
):
    """Get all departments for tool upload form."""
    departments = db.query(Department).order_by(Department.name).all()
    return departments


@router.post("/notifications/{notification_id}/read")
async def mark_notification_read(
    notification_id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(require_team_member)
):
    """Mark a notification as read."""
    notification = db.query(Notification).filter(
        Notification.id == notification_id,
        Notification.user_id == user_id
    ).first()
    
    if notification:
        notification.is_read = True
        db.commit()
    
    return {"success": True}


@router.post("/notifications/read-all")
async def mark_all_notifications_read(
    db: Session = Depends(get_db),
    user_id: int = Depends(require_team_member)
):
    """Mark all notifications as read."""
    db.query(Notification).filter(
        Notification.user_id == user_id,
        Notification.is_read == False
    ).update({"is_read": True})
    db.commit()
    return {"success": True}
