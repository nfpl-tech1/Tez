"""
Tool Response Converters

Helper functions to convert Tool models to response schemas.
Follows DRY principle by centralizing response conversion logic.
"""
from ..models.tool import Tool
from ..schemas.tool_response import (
    ToolResponse, ToolListItem, ToolDetail, DepartmentResponse, format_file_size
)
import markdown2


def tool_to_response(tool: Tool) -> ToolResponse:
    """Convert Tool model to ToolResponse for team views."""
    issue_count = len(tool.issues) if hasattr(tool, 'issues') else 0
    open_issue_count = sum(1 for i in tool.issues if not i.is_resolved) if hasattr(tool, 'issues') else 0
    
    return ToolResponse(
        id=tool.id,
        name=tool.name,
        description=tool.description,
        instruction_type=tool.instruction_type or "markdown",
        instructions=tool.instructions,
        instruction_pdf_name=tool.instruction_pdf_name,
        file_name=tool.file_name,
        file_size=tool.file_size,
        file_size_display=format_file_size(tool.file_size),
        status=tool.status,
        admin_remarks=tool.admin_remarks,
        department_ids=[d.id for d in tool.departments],
        department_names=[d.name for d in tool.departments],
        subcategory_ids=[s.id for s in getattr(tool, 'subcategories', [])],
        subcategory_names=[s.name for s in getattr(tool, 'subcategories', [])],
        github_url=getattr(tool, 'github_url', None),
        can_edit=tool.status in ('draft', 'changes_requested'),
        can_update_content=tool.status == 'approved',
        download_count=tool.download_count,
        issue_count=issue_count,
        open_issue_count=open_issue_count,
        created_at=tool.created_at,
        updated_at=tool.updated_at
    )


def tool_to_list_item(tool: Tool) -> ToolListItem:
    """Convert Tool model to ToolListItem for list views."""
    return ToolListItem(
        id=tool.id,
        name=tool.name,
        description=tool.description,
        file_size_display=tool.file_size_display,
        department_names=[d.name for d in tool.departments],
        subcategory_names=[s.name for s in getattr(tool, 'subcategories', [])],
        github_url=getattr(tool, 'github_url', None),
        uploader_name=tool.uploader.name,
        download_count=tool.download_count,
        updated_at=tool.updated_at
    )


def tool_to_detail(tool: Tool) -> ToolDetail:
    """Convert Tool model to ToolDetail for public detail view."""
    instructions_html = None
    if tool.instruction_type == "markdown" and tool.instructions:
        instructions_html = markdown2.markdown(
            tool.instructions,
            extras=["fenced-code-blocks", "tables", "break-on-newline", "code-friendly"]
        )
    
    return ToolDetail(
        id=tool.id,
        name=tool.name,
        description=tool.description,
        instruction_type=tool.instruction_type or "markdown",
        instructions=tool.instructions,
        instructions_html=instructions_html,
        instruction_pdf_available=bool(tool.instruction_pdf_path),
        file_name=tool.file_name,
        file_size=tool.file_size,
        file_size_display=tool.file_size_display,
        department_names=[d.name for d in tool.departments],
        subcategory_names=[s.name for s in getattr(tool, 'subcategories', [])],
        github_url=getattr(tool, 'github_url', None),
        uploader_name=tool.uploader.name,
        uploader_email=tool.uploader.email,
        download_count=tool.download_count,
        created_at=tool.created_at,
        updated_at=tool.updated_at
    )


def department_to_response(dept) -> DepartmentResponse:
    """Convert Department model to DepartmentResponse."""
    return DepartmentResponse(
        id=dept.id,
        name=dept.name,
        description=dept.description,
        tool_count=dept.tool_count
    )
