"""
Authentication Routes - JSON API

Handles login, logout, and session management.
"""
from fastapi import APIRouter, Request, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr
from typing import Optional

from ..database import get_db
from ..services.auth_service import AuthService

router = APIRouter(prefix="/auth", tags=["Authentication"])


class LoginRequest(BaseModel):
    """Login request body."""
    username_or_email: str
    password: str


class UserResponse(BaseModel):
    """User response model."""
    id: int
    username: str
    email: str
    name: str
    role: str
    
    class Config:
        from_attributes = True


class LoginResponse(BaseModel):
    """Login response model."""
    success: bool
    message: str
    user: Optional[UserResponse] = None


@router.post("/login", response_model=LoginResponse)
async def login(
    request: Request,
    credentials: LoginRequest,
    db: Session = Depends(get_db)
):
    """Authenticate user and create session."""
    auth_service = AuthService(db)
    user = auth_service.authenticate(credentials.username_or_email, credentials.password)
    
    if user:
        # Store user info in session
        request.session["user_id"] = user.id
        request.session["username"] = user.username
        request.session["name"] = user.name
        request.session["role"] = user.role
        
        return LoginResponse(
            success=True,
            message="Login successful",
            user=UserResponse(
                id=user.id,
                username=user.username,
                email=user.email,
                name=user.name,
                role=user.role
            )
        )
    
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid username/email or password"
    )


@router.post("/logout")
async def logout(request: Request):
    """Clear session and logout."""
    request.session.clear()
    return {"success": True, "message": "Logged out successfully"}


@router.get("/me", response_model=Optional[UserResponse])
async def get_current_user(
    request: Request,
    db: Session = Depends(get_db)
):
    """Get current logged-in user."""
    user_id = request.session.get("user_id")
    
    if not user_id:
        return None
    
    auth_service = AuthService(db)
    user = auth_service.get_user_by_id(user_id)
    
    if not user or not user.is_active:
        request.session.clear()
        return None
    
    return UserResponse(
        id=user.id,
        username=user.username,
        email=user.email,
        name=user.name,
        role=user.role
    )


@router.get("/check")
async def check_auth(request: Request):
    """Check if user is authenticated."""
    user_id = request.session.get("user_id")
    role = request.session.get("role")
    
    return {
        "authenticated": user_id is not None,
        "role": role
    }
