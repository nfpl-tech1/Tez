"""
Issue Model

Represents issues reported by public users for tools.
"""
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship

from ..database import Base


class Issue(Base):
    """Issue model for public issue reporting."""
    
    __tablename__ = "issues"
    
    id = Column(Integer, primary_key=True, index=True)
    
    # Reporter info (public user, not logged in)
    reporter_name = Column(String(100), nullable=False)
    reporter_email = Column(String(100), nullable=False)
    
    # Issue details
    description = Column(Text, nullable=False)
    
    # Status
    is_resolved = Column(Boolean, default=False)
    resolved_at = Column(DateTime, nullable=True)
    
    # Tool relationship
    tool_id = Column(Integer, ForeignKey("tools.id", ondelete="CASCADE"), nullable=False)
    tool = relationship("Tool", back_populates="issues")
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    @property
    def status_display(self) -> str:
        """Human-readable status."""
        return "Resolved" if self.is_resolved else "Open"
    
    def __repr__(self) -> str:
        return f"<Issue {self.id} for Tool {self.tool_id} ({self.status_display})>"
