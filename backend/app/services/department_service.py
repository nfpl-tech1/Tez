"""
Department Service

Handles department CRUD operations.
Extracted from tool_service.py for Single Responsibility Principle.
"""
from typing import List, Optional
from sqlalchemy.orm import Session

from ..models.department import Department


class DepartmentService:
    """Service for department operations."""
    
    def __init__(self, db: Session):
        self.db = db
    
    def get_all_departments(self) -> List[Department]:
        """Get all departments ordered by sort order."""
        return self.db.query(Department).order_by(Department.sort_order).all()
    
    def get_department_by_id(self, dept_id: int) -> Optional[Department]:
        """Get department by ID."""
        return self.db.query(Department).filter(Department.id == dept_id).first()
    
    def get_departments_by_ids(self, dept_ids: List[int]) -> List[Department]:
        """Get departments by list of IDs."""
        if not dept_ids:
            return []
        return self.db.query(Department).filter(Department.id.in_(dept_ids)).all()
    
    def create_department(self, name: str, description: str = None) -> Department:
        """Create a new department."""
        max_order = self.db.query(Department).count()
        
        dept = Department(
            name=name,
            description=description,
            sort_order=max_order
        )
        self.db.add(dept)
        self.db.commit()
        self.db.refresh(dept)
        return dept
    
    def ensure_default_department(self) -> None:
        """Create default Miscellaneous department if none exists."""
        misc = self.db.query(Department).filter(
            Department.name == "Miscellaneous"
        ).first()
        
        if not misc:
            self.create_department(
                name="Miscellaneous",
                description="General utilities (Excel to CSV, PDF tools, etc.)"
            )

    def update_department(self, dept_id: int, name: str, description: Optional[str] = None) -> Department:
        """Update department name and description."""
        dept = self.get_department_by_id(dept_id)
        if not dept:
            raise ValueError("Department not found")
        dept.name = name
        if description is not None:
            dept.description = description
        self.db.commit()
        self.db.refresh(dept)
        return dept
