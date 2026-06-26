"""
Authentication Service

Handles user authentication, session management, and role-based access.
"""
from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_

from ..models.user import User
from ..config import get_settings


class AuthService:
    """Service for authentication operations."""
    
    def __init__(self, db: Session):
        self.db = db
        self.settings = get_settings()
    
    def authenticate(self, username_or_email: str, password: str) -> Optional[User]:
        """
        Authenticate user by username OR email.
        Returns User if credentials are valid, None otherwise.
        """
        # Find user by username or email
        user = self.db.query(User).filter(
            or_(
                User.username == username_or_email,
                User.email == username_or_email
            ),
            User.is_active == True
        ).first()
        
        if user and user.verify_password(password):
            return user
        return None
    
    def get_user_by_id(self, user_id: int) -> Optional[User]:
        """Get user by ID."""
        return self.db.query(User).filter(User.id == user_id).first()
    
    def get_user_by_username(self, username: str) -> Optional[User]:
        """Get user by username."""
        return self.db.query(User).filter(User.username == username).first()
    
    def get_user_by_email(self, email: str) -> Optional[User]:
        """Get user by email."""
        return self.db.query(User).filter(User.email == email).first()
    
    def create_user(
        self,
        username: str,
        email: str,
        password: str,
        name: str,
        role: str = "team_member"
    ) -> User:
        """Create a new user."""
        user = User(
            username=username,
            email=email,
            name=name,
            role=role
        )
        user.set_password(password)
        
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user
    
    def update_user(
        self,
        user: User,
        name: Optional[str] = None,
        username: Optional[str] = None,
        email: Optional[str] = None,
        password: Optional[str] = None
    ) -> User:
        """Update user information including username."""
        if name:
            user.name = name
        if username:
            user.username = username
        if email:
            user.email = email
        if password:
            user.set_password(password)
        
        self.db.commit()
        self.db.refresh(user)
        return user
    
    def delete_user(self, user: User) -> bool:
        """Delete a user (deactivate)."""
        user.is_active = False
        self.db.commit()
        return True
    
    def get_all_team_members(self):
        """Get all active team members."""
        return self.db.query(User).filter(
            User.role == "team_member",
            User.is_active == True
        ).order_by(User.name).all()
    
    def get_all_admins(self):
        """Get all active admins."""
        return self.db.query(User).filter(
            User.role == "admin",
            User.is_active == True
        ).all()
    
    def ensure_admin_exists(self) -> None:
        """Create default admin if none exists."""
        admin = self.db.query(User).filter(User.role == "admin").first()
        if not admin:
            self.create_user(
                username=self.settings.ADMIN_USERNAME,
                email=self.settings.ADMIN_EMAIL,
                password=self.settings.ADMIN_PASSWORD,
                name="Administrator",
                role="admin"
            )
