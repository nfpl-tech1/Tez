"""
Tool Repository - FastAPI Backend

Main application entry point with CORS and session configuration.
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from starlette.middleware.sessions import SessionMiddleware
from pathlib import Path

from .config import get_settings, ensure_directories
from .database import init_db, SessionLocal
from .services.auth_service import AuthService
from .services.tool_service import DepartmentService


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown events."""
    # Startup
    ensure_directories()
    init_db()
    
    # Create default admin and department
    db = SessionLocal()
    try:
        auth_service = AuthService(db)
        auth_service.ensure_admin_exists()
        
        dept_service = DepartmentService(db)
        dept_service.ensure_default_department()
    finally:
        db.close()
    
    yield
    
    # Shutdown
    pass


settings = get_settings()

app = FastAPI(
    title="Tool Repository API",
    description="API for managing and distributing developer tools",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite dev server
        "http://localhost:3000",  # Alternative
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Session middleware for authentication
app.add_middleware(
    SessionMiddleware,
    secret_key=settings.SECRET_KEY,
    session_cookie="tool_repo_session",
    max_age=86400,  # 24 hours
    same_site="lax",
    https_only=False  # Set to True in production with HTTPS
)

# Mount uploads directory for file serving
uploads_path = Path(settings.UPLOAD_DIR)
if uploads_path.exists():
    app.mount("/uploads", StaticFiles(directory=str(uploads_path)), name="uploads")

# Import and include routers
from .routers import auth_router, admin_router, team_router, public_router

app.include_router(auth_router, prefix="/api")
app.include_router(admin_router, prefix="/api")
app.include_router(team_router, prefix="/api")
app.include_router(public_router, prefix="/api")


@app.get("/health")
async def health_check():
    """Health check endpoint for Docker."""
    return {"status": "healthy", "service": "tool-repository-api"}


@app.get("/api")
async def api_root():
    """API root endpoint."""
    return {
        "name": "Tool Repository API",
        "version": "1.0.0",
        "docs": "/docs"
    }
