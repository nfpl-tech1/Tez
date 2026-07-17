"""
Admin Departments Routes

Department management endpoints.
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional, List

from ...database import get_db
from ...models.department import Department
from ...models.subcategory import Subcategory
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


@router.delete("/subcategories/{subcategory_id}")
async def delete_subcategory(
    subcategory_id: int,
    db: Session = Depends(get_db),
    _: int = Depends(require_admin)
):
    """Delete a subcategory."""
    sub = db.query(Subcategory).filter(Subcategory.id == subcategory_id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Subcategory not found")
        
    db.delete(sub)
    db.commit()
    return {"success": True, "message": "Subcategory deleted"}


class SubcategoryUpdate(BaseModel):
    name: str


class DepartmentUpdate(BaseModel):
    name: str
    description: Optional[str] = None


@router.put("/departments/{department_id}", response_model=DepartmentResponse)
async def update_department(
    department_id: int,
    data: DepartmentUpdate,
    db: Session = Depends(get_db),
    _: int = Depends(require_admin)
):
    """Update department name and description."""
    dept_service = DepartmentService(db)
    
    # Check duplicate name
    duplicate = db.query(Department).filter(
        Department.name == data.name,
        Department.id != department_id
    ).first()
    if duplicate:
        raise HTTPException(status_code=400, detail="Department name already exists")
        
    try:
        dept = dept_service.update_department(department_id, data.name, data.description)
        return DepartmentResponse(
            id=dept.id,
            name=dept.name,
            description=dept.description,
            tool_count=dept.tool_count
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.put("/subcategories/{subcategory_id}")
async def update_subcategory(
    subcategory_id: int,
    data: SubcategoryUpdate,
    db: Session = Depends(get_db),
    _: int = Depends(require_admin)
):
    """Update a subcategory name."""
    sub = db.query(Subcategory).filter(Subcategory.id == subcategory_id).first()
    if not sub:
        raise HTTPException(status_code=404, detail="Subcategory not found")
        
    # Check duplicate name under the same department
    duplicate = db.query(Subcategory).filter(
        Subcategory.department_id == sub.department_id,
        Subcategory.name == data.name,
        Subcategory.id != subcategory_id
    ).first()
    if duplicate:
        raise HTTPException(status_code=400, detail="Subcategory name already exists in this department")
        
    sub.name = data.name
    db.commit()
    db.refresh(sub)
    return {"success": True, "message": "Subcategory updated", "subcategory": {"id": sub.id, "name": sub.name}}
