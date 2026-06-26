"""
Tool Model

Represents published tools/applications.
Supports status workflow: draft -> pending -> approved/changes_requested
Supports PDF or Markdown instructions
Supports multiple departments via junction table
"""
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Table
from sqlalchemy.orm import relationship

from ..database import Base


# Many-to-many junction table for tools and departments
tool_departments = Table(
    'tool_departments',
    Base.metadata,
    Column('tool_id', Integer, ForeignKey('tools.id', ondelete='CASCADE'), primary_key=True),
    Column('department_id', Integer, ForeignKey('departments.id', ondelete='CASCADE'), primary_key=True)
)


class Tool(Base):
    """Tool model for uploaded applications."""
    
    __tablename__ = "tools"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, index=True)
    description = Column(String(500), nullable=False)
    
    # Instructions can be Markdown text OR PDF file (mutually exclusive)
    instruction_type = Column(String(10), default="markdown")  # 'markdown' or 'pdf'
    instructions = Column(Text, nullable=True)  # Markdown formatted (if instruction_type='markdown')
    instruction_pdf_path = Column(String(255), nullable=True)  # PDF file path (if instruction_type='pdf')
    instruction_pdf_name = Column(String(255), nullable=True)  # Original PDF filename
    
    # Executable file information
    file_path = Column(String(255), nullable=True)  # Internal storage path
    file_name = Column(String(255), nullable=True)  # Original filename
    file_size = Column(Integer, default=0)  # Size in bytes
    
    # Relationships - Many-to-many with departments
    departments = relationship(
        "Department",
        secondary=tool_departments,
        back_populates="tools"
    )
    
    # Legacy single department (for migration compatibility)
    department_id = Column(Integer, ForeignKey("departments.id"), nullable=True)
    
    uploaded_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    uploader = relationship("User", back_populates="tools")
    
    # Status workflow
    status = Column(String(20), default="draft")  # draft, pending, approved, changes_requested
    admin_remarks = Column(Text, nullable=True)
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Statistics
    download_count = Column(Integer, default=0)
    
    # Relationship for notifications
    notifications = relationship("Notification", back_populates="tool", cascade="all, delete-orphan")
    
    # Relationship for issues
    issues = relationship("Issue", back_populates="tool", cascade="all, delete-orphan")
    
    @property
    def status_display(self) -> str:
        """Human-readable status."""
        status_map = {
            "draft": "Draft",
            "pending": "Pending Review",
            "approved": "Approved",
            "changes_requested": "Changes Requested"
        }
        return status_map.get(self.status, self.status.title())
    
    @property
    def status_color(self) -> str:
        """CSS class for status badge."""
        color_map = {
            "draft": "gray",
            "pending": "yellow",
            "approved": "green",
            "changes_requested": "orange"
        }
        return color_map.get(self.status, "gray")
    
    @property
    def can_edit(self) -> bool:
        """Check if tool can be fully edited (before approval)."""
        return self.status in ["draft", "pending", "changes_requested", "approved"]
    
    @property
    def can_update_content(self) -> bool:
        """Check if instructions/description can be updated (even after approval)."""
        return self.status in ["draft", "changes_requested", "approved"]
    
    @property
    def file_size_display(self) -> str:
        """Human-readable file size."""
        if self.file_size < 1024:
            return f"{self.file_size} B"
        elif self.file_size < 1024 * 1024:
            return f"{self.file_size / 1024:.1f} KB"
        else:
            return f"{self.file_size / (1024 * 1024):.1f} MB"
    
    @property
    def department_names(self) -> list:
        """List of department names this tool belongs to."""
        return [dept.name for dept in self.departments]
    
    def __repr__(self) -> str:
        return f"<Tool {self.name} ({self.status})>"
