"""
Team Tools Routes

Tool CRUD endpoints for team members.
Refactored to use shared schemas and converters.
"""
import urllib.parse
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import Optional, List

from ...database import get_db
from ...models.tool import Tool
from ...models.subcategory import Subcategory
from ...models.department import Department
from ...services.tool_service import ToolService
from ...services.file_service import FileService
from ...schemas.tool_response import ToolResponse
from ...schemas.subcategory import SubcategoryCreate, SubcategoryResponse
from ...schemas.converters import tool_to_response
from .dependencies import require_team_member

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


def parse_department_ids(department_ids: str) -> List[int]:
    """Parse comma-separated department IDs string."""
    if not department_ids:
        return []
    return [int(x.strip()) for x in department_ids.split(",") if x.strip()]


@router.get("/tools")
async def get_my_tools(
    db: Session = Depends(get_db),
    user_id: int = Depends(require_team_member)
):
    """Get all tools uploaded by current user."""
    tools = db.query(Tool).filter(Tool.uploaded_by == user_id).all()
    return [tool_to_response(t) for t in tools]


@router.get("/tools/{tool_id}", response_model=ToolResponse)
async def get_tool(
    tool_id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(require_team_member)
):
    """Get a specific tool."""
    tool_service = ToolService(db)
    tool = tool_service.get_tool_by_id(tool_id)
    
    if not tool or tool.uploaded_by != user_id:
        raise HTTPException(status_code=404, detail="Tool not found")
    
    return tool_to_response(tool)


@router.post("/tools", response_model=ToolResponse)
async def create_tool(
    name: str = Form(...),
    description: str = Form(...),
    instruction_type: str = Form("markdown"),
    instructions: Optional[str] = Form(None),
    department_ids: str = Form(""),
    subcategory_ids: str = Form(""),
    github_url: Optional[str] = Form(None),
    save_as_draft: bool = Form(False),
    file: Optional[UploadFile] = File(None),
    instruction_pdf: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    user_id: int = Depends(require_team_member)
):
    """Create a new tool. Can save as draft or submit for review."""
    file_service = FileService()
    tool_service = ToolService(db)
    
    dept_ids = parse_department_ids(department_ids)
    sub_ids = parse_department_ids(subcategory_ids)
    
    # Check github url uniqueness
    if github_url and tool_service.check_github_url_exists(github_url):
        raise HTTPException(status_code=400, detail="A tool with this GitHub URL already exists")
    
    if github_url and github_url.strip():
        if not is_valid_github_url(github_url):
            raise HTTPException(status_code=400, detail="Must be a valid GitHub URL (e.g., https://github.com/username/repo)")
    
    # Validate for submission
    if not save_as_draft:
        if not github_url or not github_url.strip():
            raise HTTPException(status_code=400, detail="GitHub URL is required for submission")
        if not file or not file.filename:
            raise HTTPException(status_code=400, detail="File is required for submission")
        if instruction_type == "markdown" and not instructions:
            raise HTTPException(status_code=400, detail="Instructions are required")
        if instruction_type == "pdf" and (not instruction_pdf or not instruction_pdf.filename):
            raise HTTPException(status_code=400, detail="Instruction PDF is required")
    
    # Handle file uploads
    file_path, file_name, file_size = None, None, 0
    if file and file.filename:
        is_valid, error_msg = file_service.validate_file(file)
        if not is_valid:
            raise HTTPException(status_code=400, detail=error_msg)
        file_path, file_name, file_size = await file_service.save_file(file)
    
    pdf_path, pdf_name = None, None
    if instruction_type == "pdf" and instruction_pdf and instruction_pdf.filename:
        pdf_path, pdf_name, _ = await file_service.save_file(instruction_pdf, subfolder="instructions")
    
    # Create tool
    tool = tool_service.create_tool(
        name=name,
        description=description,
        instructions=instructions if instruction_type == "markdown" else None,
        uploaded_by=user_id,
        department_ids=dept_ids,
        subcategory_ids=sub_ids,
        github_url=github_url,
        status="draft" if save_as_draft else "pending"
    )
    
    # Update file fields
    tool.instruction_type = instruction_type
    if pdf_path:
        tool.instruction_pdf_path = pdf_path
        tool.instruction_pdf_name = pdf_name
    if file_path:
        tool.file_path = file_path
        tool.file_name = file_name
        tool.file_size = file_size
    
    db.commit()
    db.refresh(tool)
    
    return tool_to_response(tool)


@router.put("/tools/{tool_id}", response_model=ToolResponse)
async def update_tool(
    tool_id: int,
    name: str = Form(...),
    description: str = Form(...),
    instruction_type: str = Form("markdown"),
    instructions: Optional[str] = Form(None),
    department_ids: str = Form(""),
    subcategory_ids: str = Form(""),
    github_url: Optional[str] = Form(None),
    save_as_draft: bool = Form(False),
    file: Optional[UploadFile] = File(None),
    instruction_pdf: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    user_id: int = Depends(require_team_member)
):
    """Update a tool. Can save as draft or resubmit for review."""
    print(f"DEBUG: update_tool called - tool_id={tool_id}, user_id={user_id}")
    print(f"DEBUG: name={name}, description={description[:50] if description else None}")
    print(f"DEBUG: instruction_type={instruction_type}, save_as_draft={save_as_draft}")
    
    tool_service = ToolService(db)
    file_service = FileService()
    
    tool = tool_service.get_tool_by_id(tool_id)
    print(f"DEBUG: tool found={tool is not None}, tool.status={tool.status if tool else None}")
    print(f"DEBUG: tool.uploaded_by={tool.uploaded_by if tool else None}, can_edit={tool.can_edit if tool else None}")
    
    if not tool or tool.uploaded_by != user_id:
        print(f"DEBUG: 404 - tool not found or ownership mismatch")
        raise HTTPException(status_code=404, detail="Tool not found")
    if not tool.can_edit:
        print(f"DEBUG: 400 - cannot edit, status={tool.status}")
        raise HTTPException(status_code=400, detail="Tool cannot be edited")
    
    dept_ids = parse_department_ids(department_ids)
    sub_ids = parse_department_ids(subcategory_ids)
    
    if github_url and tool_service.check_github_url_exists(github_url, exclude_tool_id=tool_id):
        raise HTTPException(status_code=400, detail="A tool with this GitHub URL already exists")
    
    if github_url and github_url.strip():
        if not is_valid_github_url(github_url):
            raise HTTPException(status_code=400, detail="Must be a valid GitHub URL (e.g., https://github.com/username/repo)")
            
    if not save_as_draft:
        if not github_url or not github_url.strip():
            raise HTTPException(status_code=400, detail="GitHub URL is required for submission")
    
    # Handle file upload
    if file and file.filename:
        is_valid, error_msg = file_service.validate_file(file)
        if not is_valid:
            raise HTTPException(status_code=400, detail=error_msg)
        if tool.file_path:
            file_service.delete_file(tool.file_path)
        file_path, file_name, file_size = await file_service.save_file(file)
        tool.file_path = file_path
        tool.file_name = file_name
        tool.file_size = file_size
    
    # Handle PDF upload
    if instruction_type == "pdf" and instruction_pdf and instruction_pdf.filename:
        if tool.instruction_pdf_path:
            file_service.delete_file(tool.instruction_pdf_path)
        pdf_path, pdf_name, _ = await file_service.save_file(instruction_pdf, subfolder="instructions")
        tool.instruction_pdf_path = pdf_path
        tool.instruction_pdf_name = pdf_name
        tool.instructions = None
    elif instruction_type == "markdown":
        tool.instructions = instructions
        if tool.instruction_pdf_path:
            file_service.delete_file(tool.instruction_pdf_path)
            tool.instruction_pdf_path = None
            tool.instruction_pdf_name = None
    
    # Update fields
    tool.name = name
    tool.description = description
    tool.instruction_type = instruction_type
    
    if save_as_draft:
        tool.status = "draft"
    elif tool.status != "approved":
        tool.status = "pending"
        
    tool.admin_remarks = None
    
    if github_url is not None:
        tool.github_url = github_url or ""
    
    tool_service.update_tool_departments(tool, dept_ids)
    tool_service.update_tool_subcategories(tool, sub_ids)
    db.commit()
    db.refresh(tool)
    
    return tool_to_response(tool)


@router.patch("/tools/{tool_id}/content", response_model=ToolResponse)
async def update_tool_content(
    tool_id: int,
    description: str = Form(...),
    instructions: Optional[str] = Form(None),
    instruction_pdf: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
    user_id: int = Depends(require_team_member)
):
    """Update only description/instructions of an approved tool."""
    tool_service = ToolService(db)
    file_service = FileService()
    
    tool = tool_service.get_tool_by_id(tool_id)
    
    if not tool or tool.uploaded_by != user_id:
        raise HTTPException(status_code=404, detail="Tool not found")
    if not tool.can_update_content:
        raise HTTPException(status_code=400, detail="Content cannot be updated")
    
    tool.description = description
    
    if tool.instruction_type == "pdf" and instruction_pdf and instruction_pdf.filename:
        if tool.instruction_pdf_path:
            file_service.delete_file(tool.instruction_pdf_path)
        pdf_path, pdf_name, _ = await file_service.save_file(instruction_pdf, subfolder="instructions")
        tool.instruction_pdf_path = pdf_path
        tool.instruction_pdf_name = pdf_name
    elif tool.instruction_type == "markdown" and instructions:
        tool.instructions = instructions
    
    db.commit()
    db.refresh(tool)
    
    return tool_to_response(tool)


@router.delete("/tools/{tool_id}")
async def delete_tool(
    tool_id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(require_team_member)
):
    """Delete a tool."""
    tool_service = ToolService(db)
    file_service = FileService()
    
    tool = tool_service.get_tool_by_id(tool_id)
    
    if not tool or tool.uploaded_by != user_id:
        raise HTTPException(status_code=404, detail="Tool not found")
    
    if tool.file_path:
        file_service.delete_file(tool.file_path)
    if tool.instruction_pdf_path:
        file_service.delete_file(tool.instruction_pdf_path)
    
    tool_service.delete_tool(tool)
    
    return {"success": True, "message": "Tool deleted"}


@router.post("/subcategories", response_model=SubcategoryResponse)
async def create_subcategory(
    data: SubcategoryCreate,
    db: Session = Depends(get_db),
    user_id: int = Depends(require_team_member)
):
    """Create a new subcategory under a department."""
    dept = db.query(Department).filter(Department.id == data.department_id).first()
    if not dept:
        raise HTTPException(status_code=404, detail="Department not found")
        
    # Check if subcategory with same name already exists in this department
    existing = db.query(Subcategory).filter(
        Subcategory.name == data.name.strip(),
        Subcategory.department_id == data.department_id
    ).first()
    if existing:
        return existing
        
    sub = Subcategory(
        name=data.name.strip(),
        department_id=data.department_id
    )
    db.add(sub)
    db.commit()
    db.refresh(sub)
    return sub
