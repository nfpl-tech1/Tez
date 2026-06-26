"""
Team Profile Routes

Team member profile management endpoints.
"""
from fastapi import APIRouter, Request, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import Optional

from ...database import get_db
from ...models.user import User
from ...services.auth_service import AuthService
from .dependencies import require_team_member

router = APIRouter()


# Pydantic Models
class ProfileUpdate(BaseModel):
    name: str
    username: str
    email: EmailStr
    password: Optional[str] = None


class ProfileResponse(BaseModel):
    id: int
    username: str
    email: str
    name: str

    class Config:
        from_attributes = True


@router.get("/profile", response_model=ProfileResponse)
async def get_profile(
    db: Session = Depends(get_db),
    user_id: int = Depends(require_team_member)
):
    """Get current user profile."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    return ProfileResponse(
        id=user.id,
        username=user.username,
        email=user.email,
        name=user.name
    )


@router.put("/profile", response_model=ProfileResponse)
async def update_profile(
    request: Request,
    data: ProfileUpdate,
    db: Session = Depends(get_db),
    user_id: int = Depends(require_team_member)
):
    """Update user profile including username."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check unique username
    if data.username != user.username:
        existing = db.query(User).filter(User.username == data.username).first()
        if existing:
            raise HTTPException(status_code=400, detail="Username already taken")
    
    # Check unique email
    if data.email != user.email:
        existing = db.query(User).filter(User.email == data.email).first()
        if existing:
            raise HTTPException(status_code=400, detail="Email already taken")
    
    user.name = data.name
    user.username = data.username
    user.email = data.email
    
    if data.password:
        user.password_hash = AuthService.hash_password(data.password)
    
    db.commit()
    db.refresh(user)
    
    # Update session
    request.session['username'] = user.username
    
    return ProfileResponse(
        id=user.id,
        username=user.username,
        email=user.email,
        name=user.name
    )
