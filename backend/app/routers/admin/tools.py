"""
Admin Tools Routes

Tool review and management endpoints.
"""
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
import markdown2

from ...database import get_db
from ...services.tool_service import ToolService
import urllib.parse
from ...services.file_service import FileService
from .dependencies import require_admin

router = APIRouter()


def is_valid_github_url(url: Optional[str]) -> bool:
    """Check if a URL is a valid GitHub URL."""
    if not url:
        return False
    try:
        parsed = urllib.parse.urlparse(url)
        return parsed.scheme in ["http", "https"] and parsed.netloc in ["github.com", "www.github.com"]
    except Exception:
        return False


# Pydantic Models
class UploaderInfo(BaseModel):
    name: str
    email: str

class ToolReviewResponse(BaseModel):
    id: int
    name: str
    description: str
    resource_type: Optional[str] = None
    webapp_url: Optional[str] = None
    instruction_type: str
    instructions: Optional[str]
    instructions_html: Optional[str] = None
    instruction_pdf_name: Optional[str]
    instruction_pdf_available: bool
    file_name: Optional[str]
    file_size: int
    file_size_display: str = ""
    status: str
    created_at: datetime
    updated_at: datetime
    uploader_name: str
    uploader_email: str
    uploader: Optional[UploaderInfo] = None
    department_ids: List[int] = []
    department_names: List[str] = []
    subcategory_ids: List[int] = []
    subcategory_names: List[str] = []
    github_url: Optional[str] = None
    visible: Optional[bool] = None
    video_tutorial_url: Optional[str] = None
    video_required: bool = True
    download_count: int = 0

    class Config:
        from_attributes = True


class ToolEditRequest(BaseModel):
    name: str
    description: str
    instructions: Optional[str] = None
    department_ids: List[int] = []
    subcategory_ids: List[int] = []
    github_url: Optional[str] = None


class RemarksRequest(BaseModel):
    remarks: str


def _format_file_size(size_bytes: int) -> str:
    """Format file size in human readable format."""
    if size_bytes < 1024:
        return f"{size_bytes} B"
    elif size_bytes < 1024 * 1024:
        return f"{size_bytes / 1024:.1f} KB"
    else:
        return f"{size_bytes / (1024 * 1024):.1f} MB"

def _tool_to_review_response(tool) -> ToolReviewResponse:
    """Convert Tool model to ToolReviewResponse."""
    # Convert markdown instructions to HTML
    instructions_html = None
    if tool.instructions and tool.instruction_type == "markdown":
        instructions_html = markdown2.markdown(
            tool.instructions,
            extras=["fenced-code-blocks", "tables", "break-on-newline"]
        )
    
    return ToolReviewResponse(
        id=tool.id,
        name=tool.name,
        description=tool.description,
        resource_type=tool.resource_type,
        webapp_url=tool.webapp_url,
        instruction_type=tool.instruction_type or "markdown",
        instructions=tool.instructions,
        instructions_html=instructions_html,
        instruction_pdf_name=tool.instruction_pdf_name,
        instruction_pdf_available=bool(tool.instruction_pdf_name),
        file_name=tool.file_name,
        file_size=tool.file_size,
        file_size_display=_format_file_size(tool.file_size),
        status=tool.status,
        created_at=tool.created_at,
        updated_at=tool.updated_at,
        uploader_name=tool.uploader.name,
        uploader_email=tool.uploader.email,
        uploader=UploaderInfo(name=tool.uploader.name, email=tool.uploader.email),
        department_ids=[d.id for d in tool.departments],
        department_names=[d.name for d in tool.departments],
        subcategory_ids=[s.id for s in tool.subcategories],
        subcategory_names=[s.name for s in tool.subcategories],
        github_url=tool.github_url,
        visible=tool.visible,
        video_tutorial_url=tool.video_tutorial_url,
        video_required=tool.video_required,
        download_count=tool.download_count
    )


@router.get("/tools", response_model=List[ToolReviewResponse])
async def get_all_tools(
    db: Session = Depends(get_db),
    _: int = Depends(require_admin)
):
    """Get all tools for admin management."""
    tool_service = ToolService(db)
    tools = tool_service.get_all_tools()
    return [_tool_to_review_response(t) for t in tools]


@router.get("/tools/pending", response_model=List[ToolReviewResponse])
async def get_pending_tools(
    db: Session = Depends(get_db),
    _: int = Depends(require_admin)
):
    """Get all tools pending review."""
    tool_service = ToolService(db)
    tools = tool_service.get_pending_tools()
    return [_tool_to_review_response(t) for t in tools]


@router.get("/tools/{tool_id}", response_model=ToolReviewResponse)
async def get_tool_for_review(
    tool_id: int,
    db: Session = Depends(get_db),
    _: int = Depends(require_admin)
):
    """Get a specific tool for review."""
    tool_service = ToolService(db)
    tool = tool_service.get_tool_by_id(tool_id)
    
    if not tool:
        raise HTTPException(status_code=404, detail="Tool not found")
    
    return _tool_to_review_response(tool)


@router.put("/tools/{tool_id}")
async def admin_edit_tool(
    tool_id: int,
    data: ToolEditRequest,
    db: Session = Depends(get_db),
    _: int = Depends(require_admin)
):
    """Admin edit tool (name, description, instructions, departments). No re-review needed."""
    tool_service = ToolService(db)
    tool = tool_service.get_tool_by_id(tool_id)
    
    if not tool:
        raise HTTPException(status_code=404, detail="Tool not found")
    
    # Update basic info
    if not data.github_url or not data.github_url.strip():
        raise HTTPException(status_code=400, detail="GitHub URL is required")
    if not is_valid_github_url(data.github_url):
        raise HTTPException(status_code=400, detail="Must be a valid GitHub URL (e.g., https://github.com/username/repo)")
    if tool_service.check_github_url_exists(data.github_url, exclude_tool_id=tool_id):
        raise HTTPException(status_code=400, detail="A tool with this GitHub URL already exists")

    tool.name = data.name
    tool.description = data.description
    
    if data.instructions and tool.instruction_type == "markdown":
        tool.instructions = data.instructions
    
    # Update departments and subcategories
    tool_service.update_tool_departments(tool, data.department_ids)
    tool_service.update_tool_subcategories(tool, data.subcategory_ids)
    
    tool.github_url = data.github_url
    
    db.commit()
    
    return {"success": True, "message": "Tool updated"}


@router.post("/tools/{tool_id}/approve")
async def approve_tool(
    tool_id: int,
    db: Session = Depends(get_db),
    _: int = Depends(require_admin)
):
    """Approve a tool for publishing."""
    tool_service = ToolService(db)
    tool = tool_service.get_tool_by_id(tool_id)
    
    if not tool:
        raise HTTPException(status_code=404, detail="Tool not found")
    
    if tool.status != "pending":
        raise HTTPException(status_code=400, detail="Tool is not pending review")
    
    tool_service.approve_tool(tool)
    return {"success": True, "message": "Tool approved"}


@router.post("/tools/{tool_id}/request-changes")
async def request_changes(
    tool_id: int,
    data: RemarksRequest,
    db: Session = Depends(get_db),
    _: int = Depends(require_admin)
):
    """Request changes for a tool."""
    tool_service = ToolService(db)
    tool = tool_service.get_tool_by_id(tool_id)
    
    if not tool:
        raise HTTPException(status_code=404, detail="Tool not found")
    
    if tool.status != "pending":
        raise HTTPException(status_code=400, detail="Tool is not pending review")
    
    tool_service.reject_tool(tool, data.remarks)
    return {"success": True, "message": "Changes requested"}


@router.get("/tools/{tool_id}/instructions-pdf")
async def get_tool_instructions_pdf(
    tool_id: int,
    db: Session = Depends(get_db),
    _: int = Depends(require_admin)
):
    """Get instruction PDF for any tool (admin only, no approval check)."""
    tool_service = ToolService(db)
    file_service = FileService()
    
    tool = tool_service.get_tool_by_id(tool_id)
    
    if not tool:
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
