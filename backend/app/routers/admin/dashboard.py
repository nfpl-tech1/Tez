"""
Admin Dashboard Routes

Dashboard statistics and notification endpoints.
"""
from fastapi import APIRouter, Request, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

from ...database import get_db
from ...models.user import User
from ...models.tool import Tool
from ...models.notification import Notification
from .dependencies import require_admin

router = APIRouter()


# Pydantic Models
class DashboardStats(BaseModel):
    pending_count: int
    team_member_count: int
    total_tools: int
    total_downloads: int


class NotificationResponse(BaseModel):
    id: int
    message: str
    type: str
    tool_id: Optional[int]
    tool_status: Optional[str]
    is_read: bool
    created_at: datetime
    time_ago: str

    class Config:
        from_attributes = True


def _format_time_ago(dt: datetime) -> str:
    """Format datetime as relative time string."""
    from datetime import timezone
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


@router.get("/dashboard", response_model=DashboardStats)
async def get_dashboard_stats(
    db: Session = Depends(get_db),
    _: int = Depends(require_admin)
):
    """Get admin dashboard statistics."""
    pending_count = db.query(Tool).filter(Tool.status == 'pending').count()
    team_member_count = db.query(User).filter(User.role == 'team_member').count()
    total_tools = db.query(Tool).filter(Tool.status == 'approved').count()
    total_downloads = db.query(func.sum(Tool.download_count)).filter(
        Tool.status == 'approved'
    ).scalar() or 0
    
    return DashboardStats(
        pending_count=pending_count,
        team_member_count=team_member_count,
        total_tools=total_tools,
        total_downloads=total_downloads
    )


@router.get("/notifications")
async def get_notifications(
    request: Request,
    db: Session = Depends(get_db),
    user_id: int = Depends(require_admin)
):
    """Get admin notifications."""
    notifications = db.query(Notification).filter(
        Notification.user_id == user_id
    ).order_by(Notification.created_at.desc()).limit(20).all()
    
    return [
        NotificationResponse(
            id=n.id,
            message=n.message,
            type=n.type,
            tool_id=n.tool_id,
            tool_status=n.tool.status if n.tool else None,
            is_read=n.is_read,
            created_at=n.created_at,
            time_ago=_format_time_ago(n.created_at)
        )
        for n in notifications
    ]


@router.get("/notifications/unread-count")
async def get_unread_count(
    request: Request,
    db: Session = Depends(get_db),
    user_id: int = Depends(require_admin)
):
    """Get count of unread notifications."""
    count = db.query(Notification).filter(
        Notification.user_id == user_id,
        Notification.is_read == False
    ).count()
    return {"unread_count": count}


@router.post("/notifications/{notification_id}/read")
async def mark_notification_read(
    notification_id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(require_admin)
):
    """Mark notification as read."""
    notification = db.query(Notification).filter(
        Notification.id == notification_id,
        Notification.user_id == user_id
    ).first()
    
    if notification:
        notification.is_read = True
        db.commit()
    
    return {"success": True}


@router.post("/notifications/read-all")
async def mark_all_read(
    db: Session = Depends(get_db),
    user_id: int = Depends(require_admin)
):
    """Mark all notifications as read."""
    db.query(Notification).filter(
        Notification.user_id == user_id,
        Notification.is_read == False
    ).update({"is_read": True})
    db.commit()
    return {"success": True}
