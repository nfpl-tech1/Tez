"""
Admin Routes Package

Modular admin router split by domain.
"""
from fastapi import APIRouter

from .profile import router as profile_router
from .dashboard import router as dashboard_router
from .team_members import router as team_members_router
from .tools import router as tools_router
from .departments import router as departments_router

# Main admin router
router = APIRouter(prefix="/admin", tags=["Admin"])

# Include sub-routers
router.include_router(profile_router)
router.include_router(dashboard_router)
router.include_router(team_members_router)
router.include_router(tools_router)
router.include_router(departments_router)
