from pydantic import BaseModel

class SubcategoryBase(BaseModel):
    name: str

class SubcategoryResponse(SubcategoryBase):
    id: int
    department_id: int
    
    class Config:
        orm_mode = True
