"""
Notification Model

Represents notifications for admin (e.g., when tools are resubmitted).
"""
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship

from ..database import Base


class Notification(Base):
    """Notification model for admin alerts."""
    
    __tablename__ = "notifications"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Target user (usually admin)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    user = relationship("User", back_populates="notifications")
    
    # Related tool
    tool_id = Column(Integer, ForeignKey("tools.id"), nullable=True)
    tool = relationship("Tool", back_populates="notifications")
    
    # Notification content
    message = Column(Text, nullable=False)
    type = Column(String(50), nullable=False)  # tool_resubmitted, tool_approved, changes_requested
    
    # Status
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    @property
    def type_icon(self) -> str:
        """Icon for notification type."""
        icon_map = {
            "tool_resubmitted": "🔄",
            "tool_approved": "✅",
            "changes_requested": "📝",
            "new_submission": "📤"
        }
        return icon_map.get(self.type, "📢")
    
    @property
    def time_ago(self) -> str:
        """Human-readable time difference."""
        now = datetime.utcnow()
        diff = now - self.created_at
        
        if diff.days > 0:
            return f"{diff.days}d ago"
        elif diff.seconds >= 3600:
            return f"{diff.seconds // 3600}h ago"
        elif diff.seconds >= 60:
            return f"{diff.seconds // 60}m ago"
        else:
            return "just now"
    
    def __repr__(self) -> str:
        return f"<Notification {self.type} for User {self.user_id}>"
