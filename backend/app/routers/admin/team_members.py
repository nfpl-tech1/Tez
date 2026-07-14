"""
Admin Team Members Routes

Team member management endpoints.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from datetime import datetime

from ...database import get_db
from ...models.user import User
from ...services.auth_service import AuthService
from .dependencies import require_admin

router = APIRouter()


# Pydantic Models
class TeamMemberCreate(BaseModel):
    username: str
    email: EmailStr
    password: str
    name: str


class TeamMemberResponse(BaseModel):
    id: int
    username: str
    email: str
    name: str
    created_at: datetime

    class Config:
        from_attributes = True


@router.get("/team-members", response_model=list[TeamMemberResponse])
async def get_team_members(
    db: Session = Depends(get_db),
    _: int = Depends(require_admin)
):
    """Get all team members."""
    members = db.query(User).filter(
        User.role == 'team_member'
    ).order_by(User.created_at.desc()).all()
    
    return [
        TeamMemberResponse(
            id=m.id,
            username=m.username,
            email=m.email,
            name=m.name,
            created_at=m.created_at
        )
        for m in members
    ]


@router.post("/team-members", response_model=TeamMemberResponse, status_code=status.HTTP_201_CREATED)
async def create_team_member(
    data: TeamMemberCreate,
    db: Session = Depends(get_db),
    _: int = Depends(require_admin)
):
    """Add a new team member."""
    # Check existing username
    if db.query(User).filter(User.username == data.username).first():
        raise HTTPException(status_code=400, detail="Username already exists")
    
    # Check existing email
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=400, detail="Email already exists")
    
    # Create user
    user = User(
        username=data.username,
        email=data.email,
        name=data.name,
        role='team_member'
    )
    user.set_password(data.password)
    db.add(user)
    db.commit()
    db.refresh(user)
    
    return TeamMemberResponse(
        id=user.id,
        username=user.username,
        email=user.email,
        name=user.name,
        created_at=user.created_at
    )


@router.delete("/team-members/{member_id}")
async def delete_team_member(
    member_id: int,
    db: Session = Depends(get_db),
    _: int = Depends(require_admin)
):
    """Remove a team member."""
    member = db.query(User).filter(
        User.id == member_id,
        User.role == 'team_member'
    ).first()
    
    if not member:
        raise HTTPException(status_code=404, detail="Team member not found")
    
    db.delete(member)
    db.commit()
    
    return {"success": True, "message": "Team member removed"}
