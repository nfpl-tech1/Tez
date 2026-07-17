from pydantic import BaseModel

class SubcategoryBase(BaseModel):
    name: str

class SubcategoryCreate(BaseModel):
    name: str
    department_id: int

class SubcategoryResponse(SubcategoryBase):
    id: int
    department_id: int
    sort_order: int = 0
    
    class Config:
        from_attributes = True
