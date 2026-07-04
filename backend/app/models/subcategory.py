"""
Subcategory Model

Represents subcategories under a specific department.
"""
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from ..database import Base

class Subcategory(Base):
    """Subcategory model for categorizing tools under a department."""
    
    __tablename__ = "subcategories"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), index=True, nullable=False)
    department_id = Column(Integer, ForeignKey("departments.id", ondelete='CASCADE'), nullable=False)
    sort_order = Column(Integer, default=0)
    
    # Relationships
    department = relationship("Department", back_populates="subcategories")
    
    tools = relationship(
        "Tool",
        secondary="tool_subcategories",
        back_populates="subcategories"
    )
    
    def __repr__(self) -> str:
        return f"<Subcategory {self.name}>"
