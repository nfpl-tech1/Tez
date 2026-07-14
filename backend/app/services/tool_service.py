"""
Tool Service

Handles tool CRUD operations, status management, and search.
Refactored to use NotificationService for notifications.
"""
from typing import List, Optional
from datetime import datetime
from sqlalchemy.orm import Session
from sqlalchemy import or_

from ..models.tool import Tool, tool_departments
from ..models.department import Department
from ..models.subcategory import Subcategory
from .notification_service import NotificationService


class ToolService:
    """Service for tool operations."""
    
    def __init__(self, db: Session):
        self.db = db
        self._notification_service = None
    
    @property
    def notifications(self) -> NotificationService:
        """Lazy load notification service."""
        if self._notification_service is None:
            self._notification_service = NotificationService(self.db)
        return self._notification_service
    
    def create_tool(
        self,
        name: str,
        description: str,
        instructions: Optional[str],
        uploaded_by: int,
        department_ids: List[int] = None,
        subcategory_ids: List[int] = None,
        github_url: Optional[str] = None,
        status: str = "pending"
    ) -> Tool:
        """Create a new tool with multiple department support."""
        tool = Tool(
            name=name,
            description=description,
            instructions=instructions,
            uploaded_by=uploaded_by,
            github_url=github_url or "",
            status=status
        )
        
        self.db.add(tool)
        self.db.flush()
        
        if department_ids:
            departments = self.db.query(Department).filter(
                Department.id.in_(department_ids)
            ).all()
            tool.departments = departments
            
        if subcategory_ids:
            subcategories = self.db.query(Subcategory).filter(
                Subcategory.id.in_(subcategory_ids)
            ).all()
            tool.subcategories = subcategories
        
        self.db.commit()
        self.db.refresh(tool)
        
        if status == "pending":
            self.notifications.notify_admins_new_submission(tool)
        
        return tool
    
    def update_tool_departments(self, tool: Tool, department_ids: List[int]) -> None:
        """Update tool departments (many-to-many)."""
        departments = self.db.query(Department).filter(
            Department.id.in_(department_ids)
        ).all() if department_ids else []
        tool.departments = departments
        self.db.commit()
        
    def update_tool_subcategories(self, tool: Tool, subcategory_ids: List[int]) -> None:
        """Update tool subcategories (many-to-many)."""
        subcategories = self.db.query(Subcategory).filter(
            Subcategory.id.in_(subcategory_ids)
        ).all() if subcategory_ids else []
        tool.subcategories = subcategories
        self.db.commit()
    
    def check_github_url_exists(self, github_url: str, exclude_tool_id: Optional[int] = None) -> bool:
        """Check if a github url already exists in the database."""
        if not github_url:
            return False
        query = self.db.query(Tool).filter(Tool.github_url == github_url)
        if exclude_tool_id:
            query = query.filter(Tool.id != exclude_tool_id)
        return query.first() is not None
    
    def update_tool(
        self,
        tool: Tool,
        name: Optional[str] = None,
        description: Optional[str] = None,
        instructions: Optional[str] = None,
        department_ids: Optional[List[int]] = None,
        subcategory_ids: Optional[List[int]] = None,
        github_url: Optional[str] = None
    ) -> Tool:
        """Update tool details."""
        if name:
            tool.name = name
        if description:
            tool.description = description
        if instructions:
            tool.instructions = instructions
        if department_ids is not None:
            self.update_tool_departments(tool, department_ids)
        if subcategory_ids is not None:
            self.update_tool_subcategories(tool, subcategory_ids)
        if github_url is not None:
            tool.github_url = github_url
        
        tool.updated_at = datetime.utcnow()
        self.db.commit()
        self.db.refresh(tool)
        return tool
    
    def submit_for_review(self, tool: Tool) -> Tool:
        """Submit tool for admin review."""
        was_changes_requested = tool.status == "changes_requested"
        tool.status = "pending"
        tool.admin_remarks = None
        tool.updated_at = datetime.utcnow()
        self.db.commit()
        
        if was_changes_requested:
            self.notifications.notify_admins_resubmission(tool)
        else:
            self.notifications.notify_admins_new_submission(tool)
        
        return tool
    
    def approve_tool(self, tool: Tool) -> Tool:
        """Approve a tool for publishing."""
        tool.status = "approved"
        tool.updated_at = datetime.utcnow()
        self.db.commit()
        self.notifications.notify_tool_approved(tool)
        return tool
    
    def reject_tool(self, tool: Tool, remarks: str) -> Tool:
        """Reject a tool with remarks."""
        tool.status = "changes_requested"
        tool.admin_remarks = remarks
        tool.updated_at = datetime.utcnow()
        self.db.commit()
        self.notifications.notify_changes_requested(tool, remarks)
        return tool
    
    def delete_tool(self, tool: Tool) -> bool:
        """Delete a tool."""
        self.db.delete(tool)
        self.db.commit()
        return True
    
    def get_tool_by_id(self, tool_id: int) -> Optional[Tool]:
        """Get tool by ID."""
        return self.db.query(Tool).filter(Tool.id == tool_id).first()
    
    def get_tools_by_user(self, user_id: int) -> List[Tool]:
        """Get all tools uploaded by a user."""
        return self.db.query(Tool).filter(
            Tool.uploaded_by == user_id
        ).order_by(Tool.updated_at.desc()).all()
    
    def get_pending_tools(self) -> List[Tool]:
        """Get all tools pending review."""
        return self.db.query(Tool).filter(
            Tool.status == "pending"
        ).order_by(Tool.created_at.asc()).all()
    
    def get_all_tools(self) -> List[Tool]:
        """Get all tools for admin management."""
        return self.db.query(Tool).order_by(Tool.updated_at.desc()).all()
    
    def get_approved_tools(
        self,
        search_query: Optional[str] = None,
        department_id: Optional[int] = None,
        subcategory_ids: Optional[List[int]] = None
    ) -> List[Tool]:
        """Get approved tools with optional filtering."""
        query = self.db.query(Tool).filter(Tool.status == "approved")
        
        if search_query:
            search_term = f"%{search_query}%"
            query = query.filter(
                or_(
                    Tool.name.ilike(search_term),
                    Tool.description.ilike(search_term)
                )
            )
        
        if department_id:
            query = query.join(tool_departments).filter(
                tool_departments.c.department_id == department_id
            )
            
        if subcategory_ids:
            query = query.filter(Tool.subcategories.any(Subcategory.id.in_(subcategory_ids)))
        
        return query.distinct().order_by(Tool.updated_at.desc()).all()
    
    def increment_download_count(self, tool: Tool) -> None:
        """Increment tool download counter without updating 'updated_at'."""
        self.db.query(Tool).filter(Tool.id == tool.id).update(
            {
                "download_count": Tool.download_count + 1,
                "updated_at": Tool.updated_at
            },
            synchronize_session=False
        )
        self.db.commit()
        tool.download_count += 1
    
    def get_pending_count(self) -> int:
        """Get count of pending tools."""
        return self.db.query(Tool).filter(Tool.status == "pending").count()


# Re-export DepartmentService for backwards compatibility
from .department_service import DepartmentService

__all__ = ['ToolService', 'DepartmentService']
