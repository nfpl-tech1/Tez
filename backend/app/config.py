"""
Application Configuration

Loads settings from environment variables with sensible defaults.
No hardcoded sensitive values.
"""
import os
from pathlib import Path
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""
    
    # Application
    APP_NAME: str = "Tool Repository"
    DEBUG: bool = False
    
    # Secret key for session signing
    SECRET_KEY: str = "change-this-secret-key-in-production"
    
    # Database
    DATABASE_URL: str = "sqlite:///./data/tool_repository.db"
    
    # File uploads
    UPLOAD_DIR: str = "./uploads"
    MAX_FILE_SIZE: int = 157286400  # 150MB in bytes
    ALLOWED_EXTENSIONS: set = {".exe"}
    
    # Default admin credentials (only for initial setup)
    ADMIN_USERNAME: str = "nagarkotadmin"
    ADMIN_PASSWORD: str = "nagarkotadmin"
    ADMIN_EMAIL: str = "admin@nagarkot.co.in"
    
    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()


def ensure_directories():
    """Create necessary directories if they don't exist."""
    settings = get_settings()
    
    # Create upload directory
    upload_path = Path(settings.UPLOAD_DIR)
    upload_path.mkdir(parents=True, exist_ok=True)
    
    # Create data directory for SQLite
    data_path = Path("./data")
    data_path.mkdir(parents=True, exist_ok=True)
