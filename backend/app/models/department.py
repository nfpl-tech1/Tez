"""
Department Model

Represents tool categories/departments.
Supports many-to-many relationship with tools.
"""
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from ..database import Base


class Department(Base):
    """Department model for categorizing tools."""
    
    __tablename__ = "departments"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True, nullable=False)
    description = Column(String(255), nullable=True)
    sort_order = Column(Integer, default=0)
    
    # Many-to-many relationship with tools
    tools = relationship(
        "Tool",
        secondary="tool_departments",
        back_populates="departments"
    )
    
    @property
    def tool_count(self) -> int:
        """Count of approved tools in this department."""
        return len([t for t in self.tools if t.status == "approved"])
    
    def __repr__(self) -> str:
        return f"<Department {self.name}>"
