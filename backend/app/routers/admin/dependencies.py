"""
Admin Dependencies

Shared dependencies for admin routes.
"""
from fastapi import Request, Depends, HTTPException
from sqlalchemy.orm import Session

from ...database import get_db
from ...models.user import User


def require_admin(request: Request, db: Session = Depends(get_db)) -> int:
    """Require admin role."""
    user_id = request.session.get("user_id")
    role = request.session.get("role")
    
    if not user_id:
        raise HTTPException(status_code=401, detail="Not authenticated")
    
    if role != 'admin':
        raise HTTPException(status_code=403, detail="Admin access required")
    
    # Verify user still exists and is active
    user = db.query(User).filter(User.id == user_id, User.is_active == True).first()
    if not user:
        request.session.clear()
        raise HTTPException(status_code=401, detail="User not found or inactive")
    
    return user_id
