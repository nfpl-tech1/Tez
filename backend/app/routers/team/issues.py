"""
Team Issues Routes

Issue management endpoints for team members.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

from ...database import get_db
from ...models.tool import Tool
from ...models.issue import Issue
from ...services.tool_service import ToolService
from .dependencies import require_team_member

router = APIRouter()


# Pydantic Models
class IssueResponse(BaseModel):
    id: int
    reporter_name: str
    reporter_email: str
    description: str
    is_resolved: bool
    status_display: str
    tool_id: int
    tool_name: str
    created_at: datetime
    resolved_at: Optional[datetime]

    class Config:
        from_attributes = True


@router.get("/issues", response_model=List[IssueResponse])
async def get_my_issues(
    db: Session = Depends(get_db),
    user_id: int = Depends(require_team_member)
):
    """Get all issues for tools uploaded by current user."""
    issues = db.query(Issue).join(Tool).filter(
        Tool.uploaded_by == user_id
    ).order_by(Issue.created_at.desc()).all()
    
    return [
        IssueResponse(
            id=i.id,
            reporter_name=i.reporter_name,
            reporter_email=i.reporter_email,
            description=i.description,
            is_resolved=i.is_resolved,
            status_display=i.status_display,
            tool_id=i.tool_id,
            tool_name=i.tool.name,
            created_at=i.created_at,
            resolved_at=i.resolved_at
        )
        for i in issues
    ]


@router.get("/tools/{tool_id}/issues", response_model=List[IssueResponse])
async def get_tool_issues(
    tool_id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(require_team_member)
):
    """Get all issues for a specific tool."""
    tool_service = ToolService(db)
    tool = tool_service.get_tool_by_id(tool_id)
    
    if not tool or tool.uploaded_by != user_id:
        raise HTTPException(status_code=404, detail="Tool not found")
    
    return [
        IssueResponse(
            id=i.id,
            reporter_name=i.reporter_name,
            reporter_email=i.reporter_email,
            description=i.description,
            is_resolved=i.is_resolved,
            status_display=i.status_display,
            tool_id=i.tool_id,
            tool_name=tool.name,
            created_at=i.created_at,
            resolved_at=i.resolved_at
        )
        for i in tool.issues
    ]


@router.post("/issues/{issue_id}/resolve")
async def resolve_issue(
    issue_id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(require_team_member)
):
    """Mark an issue as resolved."""
    issue = db.query(Issue).join(Tool).filter(
        Issue.id == issue_id,
        Tool.uploaded_by == user_id
    ).first()
    
    if not issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    
    issue.is_resolved = True
    issue.resolved_at = datetime.utcnow()
    db.commit()
    
    return {"success": True, "message": "Issue marked as resolved"}
