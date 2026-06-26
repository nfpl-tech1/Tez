"""
Routers Package

API route handlers.
"""
from .auth import router as auth_router
from .admin import router as admin_router
from .team import router as team_router
from .public import router as public_router

__all__ = ["auth_router", "admin_router", "team_router", "public_router"]
