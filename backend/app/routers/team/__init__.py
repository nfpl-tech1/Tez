"""
Team Routes Package

Modular team router split by domain.
"""
from fastapi import APIRouter

from .profile import router as profile_router
from .dashboard import router as dashboard_router
from .tools import router as tools_router
from .issues import router as issues_router

# Main team router
router = APIRouter(prefix="/team", tags=["Team Member"])

# Include sub-routers
router.include_router(profile_router)
router.include_router(dashboard_router)
router.include_router(tools_router)
router.include_router(issues_router)
