"""
Notification Service

Handles notification creation and management.
Extracted from tool_service.py for Single Responsibility Principle.
"""
from sqlalchemy.orm import Session

from ..models.notification import Notification
from ..models.tool import Tool


class NotificationService:
    """Service for notification operations."""
    
    def __init__(self, db: Session):
        self.db = db
    
    def notify_user(
        self,
        user_id: int,
        message: str,
        notification_type: str,
        tool_id: int = None
    ) -> None:
        """Create a notification for a specific user."""
        notification = Notification(
            user_id=user_id,
            tool_id=tool_id,
            message=message,
            type=notification_type
        )
        self.db.add(notification)
        self.db.commit()
    
    def notify_admins_new_submission(self, tool: Tool) -> None:
        """Create notifications for all admins about new submission."""
        from ..models.user import User
        admins = self.db.query(User).filter(User.role == "admin").all()
        
        for admin in admins:
            notification = Notification(
                user_id=admin.id,
                tool_id=tool.id,
                message=f"New tool submitted: '{tool.name}'",
                type="new_submission"
            )
            self.db.add(notification)
        self.db.commit()
    
    def notify_admins_resubmission(self, tool: Tool) -> None:
        """Create notifications for all admins about resubmission."""
        from ..models.user import User
        admins = self.db.query(User).filter(User.role == "admin").all()
        
        for admin in admins:
            notification = Notification(
                user_id=admin.id,
                tool_id=tool.id,
                message=f"Tool resubmitted after changes: '{tool.name}'",
                type="tool_resubmitted"
            )
            self.db.add(notification)
        self.db.commit()
    
    def notify_tool_approved(self, tool: Tool) -> None:
        """Notify uploader that tool was approved."""
        self.notify_user(
            user_id=tool.uploaded_by,
            message=f"Your tool '{tool.name}' has been approved!",
            notification_type="tool_approved",
            tool_id=tool.id
        )
    
    def notify_changes_requested(self, tool: Tool, remarks: str) -> None:
        """Notify uploader that changes were requested."""
        self.notify_user(
            user_id=tool.uploaded_by,
            message=f"Changes requested for '{tool.name}': {remarks}",
            notification_type="changes_requested",
            tool_id=tool.id
        )
