"""
Public Routes - JSON API

Open access tool browsing, downloads, and issue reporting.
Refactored to use shared schemas and converters.
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import BaseModel, EmailStr
from typing import List

from ..database import get_db
from ..services.tool_service import ToolService
from ..services.department_service import DepartmentService
from ..services.notification_service import NotificationService
from ..services.file_service import FileService
from ..models.tool import Tool
from ..models.issue import Issue
from ..schemas.tool_response import ToolDetail, DepartmentResponse, ToolsSearchResponse
from ..schemas.converters import tool_to_list_item, tool_to_detail, department_to_response

router = APIRouter(prefix="/public", tags=["Public"])


class IssueCreate(BaseModel):
    """Issue creation request."""
    name: str
    email: EmailStr
    description: str


@router.get("/tools", response_model=ToolsSearchResponse)
async def get_tools(
    q: str = None,
    department: int = None,
    subcategories: List[int] = Query(None),
    db: Session = Depends(get_db)
):
    """Get all approved tools with optional search and filtering."""
    tool_service = ToolService(db)
    dept_service = DepartmentService(db)
    
    tools = tool_service.get_approved_tools(
        search_query=q, 
        department_id=department,
        subcategory_ids=subcategories
    )
    departments = dept_service.get_all_departments()
    
    return ToolsSearchResponse(
        tools=[tool_to_list_item(t) for t in tools],
        departments=[department_to_response(d) for d in departments],
        search_query=q,
        selected_department=department
    )


@router.get("/tools/{tool_id}", response_model=ToolDetail)
async def get_tool_detail(tool_id: int, db: Session = Depends(get_db)):
    """Get tool detail page data."""
    tool_service = ToolService(db)
    tool = tool_service.get_tool_by_id(tool_id)
    
    if not tool or tool.status != "approved":
        raise HTTPException(status_code=404, detail="Tool not found")
    
    return tool_to_detail(tool)


@router.get("/tools/{tool_id}/download")
async def download_tool(tool_id: int, db: Session = Depends(get_db)):
    """Download tool file."""
    tool_service = ToolService(db)
    file_service = FileService()
    
    tool = tool_service.get_tool_by_id(tool_id)
    
    if not tool or tool.status != "approved":
        raise HTTPException(status_code=404, detail="Tool not found")
    if not tool.file_path:
        raise HTTPException(status_code=404, detail="File not available")
    
    file_path = file_service.get_file_path(tool.file_path)
    if not file_path:
        raise HTTPException(status_code=404, detail="File not found")
    
    tool_service.increment_download_count(tool)
    
    return FileResponse(
        path=file_path,
        filename=tool.file_name,
        media_type="application/octet-stream"
    )


@router.get("/tools/{tool_id}/instructions-pdf")
async def download_instructions_pdf(tool_id: int, db: Session = Depends(get_db)):
    """Download instruction PDF."""
    tool_service = ToolService(db)
    file_service = FileService()
    
    tool = tool_service.get_tool_by_id(tool_id)
    
    if not tool or tool.status != "approved":
        raise HTTPException(status_code=404, detail="Tool not found")
    if not tool.instruction_pdf_path:
        raise HTTPException(status_code=404, detail="PDF not available")
    
    file_path = file_service.get_file_path(tool.instruction_pdf_path)
    if not file_path:
        raise HTTPException(status_code=404, detail="PDF not found")
    
    return FileResponse(
        path=file_path,
        filename=tool.instruction_pdf_name or "instructions.pdf",
        media_type="application/pdf"
    )


@router.post("/tools/{tool_id}/issues")
async def report_issue(tool_id: int, data: IssueCreate, db: Session = Depends(get_db)):
    """Report an issue with a tool (public access)."""
    tool_service = ToolService(db)
    notification_service = NotificationService(db)
    
    tool = tool_service.get_tool_by_id(tool_id)
    
    if not tool or tool.status != "approved":
        raise HTTPException(status_code=404, detail="Tool not found")
    
    issue = Issue(
        reporter_name=data.name,
        reporter_email=data.email,
        description=data.description,
        tool_id=tool_id
    )
    db.add(issue)
    db.commit()
    
    notification_service.notify_user(
        user_id=tool.uploaded_by,
        message=f"New issue reported for '{tool.name}' by {data.name}",
        notification_type="issue",
        tool_id=tool_id
    )
    
    return {"success": True, "message": "Issue reported successfully"}


@router.get("/departments", response_model=List[DepartmentResponse])
async def get_departments(db: Session = Depends(get_db)):
    """Get all departments with tool counts."""
    dept_service = DepartmentService(db)
    return [department_to_response(d) for d in dept_service.get_all_departments()]


from ..models.subcategory import Subcategory
from ..schemas.subcategory import SubcategoryResponse

@router.get("/subcategories", response_model=List[SubcategoryResponse])
async def get_subcategories(db: Session = Depends(get_db)):
    """Get all subcategories."""
    return db.query(Subcategory).order_by(Subcategory.sort_order).all()


@router.get("/stats")
async def get_stats(db: Session = Depends(get_db)):
    """Get public statistics."""
    total_tools = db.query(Tool).filter(Tool.status == "approved").count()
    total_downloads = db.query(func.sum(Tool.download_count)).scalar() or 0
    
    return {"total_tools": total_tools, "total_downloads": total_downloads}
