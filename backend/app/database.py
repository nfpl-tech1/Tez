"""
Database Configuration and Session Management

Uses SQLAlchemy with SQLite for data persistence.
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.pool import StaticPool
from .config import get_settings

settings = get_settings()

# Create engine with SQLite-specific settings
# Using StaticPool for SQLite to handle concurrent access
engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
    echo=settings.DEBUG
)

# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()


def get_db():
    """
    Dependency that provides a database session.
    Automatically closes the session after the request.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Initialize database tables."""
    # Import all models to ensure they're registered
    from .models import user, tool, notification, department, issue, subcategory
    
    # Create all tables
    Base.metadata.create_all(bind=engine)
