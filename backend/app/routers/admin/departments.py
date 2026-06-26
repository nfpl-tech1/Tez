"""
Admin Departments Routes

Department management endpoints.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List

from ...database import get_db
from ...services.tool_service import DepartmentService
from .dependencies import require_admin

router = APIRouter()


# Pydantic Models
class DepartmentCreate(BaseModel):
    name: str
    description: Optional[str] = ""


class DepartmentResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    tool_count: int = 0

    class Config:
        from_attributes = True


@router.get("/departments", response_model=List[DepartmentResponse])
async def get_departments(
    db: Session = Depends(get_db),
    _: int = Depends(require_admin)
):
    """Get all departments with tool counts."""
    dept_service = DepartmentService(db)
    departments = dept_service.get_all_departments()
    
    return [
        DepartmentResponse(
            id=d.id,
            name=d.name,
            description=d.description,
            tool_count=d.tool_count
        )
        for d in departments
    ]


@router.post("/departments", response_model=DepartmentResponse)
async def create_department(
    data: DepartmentCreate,
    db: Session = Depends(get_db),
    _: int = Depends(require_admin)
):
    """Create a new department."""
    dept_service = DepartmentService(db)
    
    try:
        dept = dept_service.create_department(data.name, data.description)
        return DepartmentResponse(
            id=dept.id,
            name=dept.name,
            description=dept.description,
            tool_count=0
        )
    except Exception:
        raise HTTPException(status_code=400, detail="Department name already exists")
